"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContentFreshness = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function updateContentFreshness() {
    return __awaiter(this, void 0, void 0, function () {
        var thirtyDaysAgo, pages, updatedCount, updates, _i, pages_1, page, performance_1, avgPosition, totalImpressions, contentStrategy, freshContent, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎯 Starting Content Freshness Update...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, 13, 15]);
                    thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma.sEOPageConfig.findMany({
                            where: {
                                status: 'active',
                                updatedAt: {
                                    lt: thirtyDaysAgo
                                }
                            }
                        })];
                case 2:
                    pages = _a.sent();
                    updatedCount = 0;
                    updates = [];
                    _i = 0, pages_1 = pages;
                    _a.label = 3;
                case 3:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 9];
                    page = pages_1[_i];
                    return [4 /*yield*/, prisma.sEOPerformance.findMany({
                            where: {
                                pagePath: page.pagePath,
                                dateKey: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                }
                            }
                        })];
                case 4:
                    performance_1 = _a.sent();
                    if (performance_1.length === 0) {
                        console.log("\u23ED\uFE0F  Skipping ".concat(page.pagePath, " - no performance data"));
                        return [3 /*break*/, 8];
                    }
                    avgPosition = performance_1.reduce(function (sum, p) { var _a; return sum + ((_a = p.position) !== null && _a !== void 0 ? _a : 0); }, 0) / performance_1.length;
                    totalImpressions = performance_1.reduce(function (sum, p) { return sum + p.impressions; }, 0);
                    if (!(avgPosition > 10 || totalImpressions < 50)) return [3 /*break*/, 7];
                    contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy) : {};
                    return [4 /*yield*/, generateFreshContent(page, performance_1)];
                case 5:
                    freshContent = _a.sent();
                    contentStrategy.lastRefreshDate = new Date().toISOString();
                    contentStrategy.refreshReason = avgPosition > 10 ? 'poor_ranking' : 'low_impressions';
                    contentStrategy.freshContentSuggestions = freshContent;
                    return [4 /*yield*/, prisma.sEOPageConfig.update({
                            where: { id: page.id },
                            data: {
                                contentStrategy: JSON.stringify(contentStrategy),
                                updatedAt: new Date()
                            }
                        })];
                case 6:
                    _a.sent();
                    updatedCount++;
                    updates.push({
                        page: page.pagePath,
                        avgPosition: avgPosition.toFixed(2),
                        impressions: totalImpressions,
                        reason: contentStrategy.refreshReason,
                        suggestions: freshContent
                    });
                    console.log("\u2705 Updated ".concat(page.pagePath, " (Pos: ").concat(avgPosition.toFixed(2), ", Imp: ").concat(totalImpressions, ")"));
                    return [3 /*break*/, 8];
                case 7:
                    console.log("\u2713 ".concat(page.pagePath, " is performing well"));
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    if (!(updatedCount > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prisma.sEOAuditLog.create({
                            data: {
                                action: 'content_freshness_updated',
                                entityType: 'page',
                                performedBy: 'system',
                                changes: {
                                    pagesUpdated: updatedCount,
                                    updates: updates
                                }
                            }
                        })];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    console.log("\n\u2728 Content Freshness Update Complete!");
                    console.log("\uD83D\uDCCA Updated ".concat(updatedCount, " pages"));
                    return [2 /*return*/, {
                            success: true,
                            pagesUpdated: updatedCount,
                            updates: updates
                        }];
                case 12:
                    error_1 = _a.sent();
                    console.error('❌ Content freshness update failed:', error_1);
                    throw error_1;
                case 13: return [4 /*yield*/, prisma.$disconnect()];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.updateContentFreshness = updateContentFreshness;
function generateFreshContent(page, performance) {
    return __awaiter(this, void 0, void 0, function () {
        var suggestions, contentStrategy, pagePath, currentMonth, currentYear, season, avgPosition, totalClicks;
        return __generator(this, function (_a) {
            suggestions = [];
            contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy) : {};
            pagePath = page.pagePath.toLowerCase();
            currentMonth = new Date().getMonth();
            currentYear = new Date().getFullYear();
            season = currentMonth >= 2 && currentMonth <= 5 ? 'spring' :
                currentMonth >= 6 && currentMonth <= 8 ? 'summer' :
                    currentMonth >= 9 && currentMonth <= 11 ? 'fall' : 'winter';
            // Page-specific suggestions
            if (pagePath.includes('/programs/')) {
                suggestions.push("Update program dates for ".concat(season, " ").concat(currentYear));
                suggestions.push('Add recent success stories or testimonials');
                suggestions.push('Include updated training schedule');
                suggestions.push('Highlight any new coaching additions');
                suggestions.push('Add FAQ section if missing');
            }
            else if (pagePath.includes('/private-lessons')) {
                suggestions.push('Update availability calendar');
                suggestions.push('Add recent athlete achievements');
                suggestions.push('Include new training packages or special offers');
                suggestions.push('Update coach bios and qualifications');
            }
            else if (pagePath === '/') {
                suggestions.push("Highlight ".concat(season, " ").concat(currentYear, " programs"));
                suggestions.push('Update featured testimonials');
                suggestions.push('Showcase recent tournament results');
                suggestions.push('Add current enrollment numbers or stats');
            }
            avgPosition = performance.reduce(function (sum, p) { return sum + p.position || 0 || 0; }, 0) / performance.length;
            totalClicks = performance.reduce(function (sum, p) { return sum + p.clicks; }, 0);
            if (avgPosition > 15) {
                suggestions.push('Add more target keywords naturally to content');
                suggestions.push('Improve internal linking to this page');
                suggestions.push('Add more comprehensive content sections');
            }
            if (totalClicks < 20) {
                suggestions.push('Enhance title tag with action words');
                suggestions.push('Add compelling call-to-action buttons');
                suggestions.push('Include video content if possible');
            }
            // General suggestions
            suggestions.push("Last updated: ".concat(new Date().toLocaleDateString(), " - Content refreshed for ").concat(season, " ").concat(currentYear));
            suggestions.push('Add fresh images or update existing ones');
            suggestions.push('Review and update all links');
            return [2 /*return*/, suggestions];
        });
    });
}
// Run if called directly
if (require.main === module) {
    updateContentFreshness()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
}
