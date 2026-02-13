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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeMetaDescriptions = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function optimizeMetaDescriptions() {
    return __awaiter(this, void 0, void 0, function () {
        var pages, optimizedCount, optimizations, _i, pages_1, page, performance_1, totalImpressions, totalClicks, avgCTR, currentMeta, optimizedMeta, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎯 Starting Meta Description Optimization...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, 14, 16]);
                    return [4 /*yield*/, prisma.sEOPageConfig.findMany({
                            where: { status: 'active' }
                        })];
                case 2:
                    pages = _a.sent();
                    optimizedCount = 0;
                    optimizations = [];
                    _i = 0, pages_1 = pages;
                    _a.label = 3;
                case 3:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 10];
                    page = pages_1[_i];
                    return [4 /*yield*/, prisma.sEOPerformance.findMany({
                            where: {
                                pagePath: page.pagePath,
                                dateKey: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                }
                            },
                            orderBy: { dateKey: 'desc' }
                        })];
                case 4:
                    performance_1 = _a.sent();
                    if (performance_1.length === 0) {
                        console.log("\u23ED\uFE0F  Skipping ".concat(page.pagePath, " - no performance data"));
                        return [3 /*break*/, 9];
                    }
                    totalImpressions = performance_1.reduce(function (sum, p) { return sum + p.impressions; }, 0);
                    totalClicks = performance_1.reduce(function (sum, p) { return sum + p.clicks; }, 0);
                    avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
                    if (!(avgCTR < 2.0 && totalImpressions > 100)) return [3 /*break*/, 8];
                    currentMeta = page.metaDescription || '';
                    return [4 /*yield*/, generateOptimizedMeta(page, currentMeta)];
                case 5:
                    optimizedMeta = _a.sent();
                    if (!(optimizedMeta !== currentMeta)) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.sEOPageConfig.update({
                            where: { id: page.id },
                            data: {
                                metaDescription: optimizedMeta,
                                updatedAt: new Date()
                            }
                        })];
                case 6:
                    _a.sent();
                    optimizedCount++;
                    optimizations.push({
                        page: page.pagePath,
                        oldMeta: currentMeta,
                        newMeta: optimizedMeta,
                        avgCTR: avgCTR.toFixed(2),
                        impressions: totalImpressions
                    });
                    console.log("\u2705 Optimized ".concat(page.pagePath, " (CTR: ").concat(avgCTR.toFixed(2), "%)"));
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.log("\u2713 ".concat(page.pagePath, " CTR is healthy: ").concat(avgCTR.toFixed(2), "%"));
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    if (!(optimizedCount > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, prisma.sEOAuditLog.create({
                            data: {
                                action: 'meta_descriptions_optimized',
                                entityType: 'page',
                                performedBy: 'system',
                                changes: {
                                    pagesOptimized: optimizedCount,
                                    optimizations: optimizations
                                }
                            }
                        })];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    console.log("\n\u2728 Meta Description Optimization Complete!");
                    console.log("\uD83D\uDCCA Optimized ".concat(optimizedCount, " pages"));
                    return [2 /*return*/, {
                            success: true,
                            pagesOptimized: optimizedCount,
                            optimizations: optimizations
                        }];
                case 13:
                    error_1 = _a.sent();
                    console.error('❌ Meta description optimization failed:', error_1);
                    throw error_1;
                case 14: return [4 /*yield*/, prisma.$disconnect()];
                case 15:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.optimizeMetaDescriptions = optimizeMetaDescriptions;
function generateOptimizedMeta(page, currentMeta) {
    return __awaiter(this, void 0, void 0, function () {
        var contentStrategy, primaryKeyword, secondaryKeywords, targetKeywords, optimizedMeta, pagePath, programName, keywords;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy) : {};
                    primaryKeyword = contentStrategy.primaryKeyword || '';
                    secondaryKeywords = contentStrategy.secondaryKeywords || [];
                    return [4 /*yield*/, prisma.sEOKeyword.findMany({
                            where: {
                                keyword: {
                                    in: __spreadArray([primaryKeyword], secondaryKeywords, true)
                                }
                            }
                        })];
                case 1:
                    targetKeywords = _a.sent();
                    optimizedMeta = currentMeta;
                    pagePath = page.pagePath.toLowerCase();
                    if (pagePath.includes('/programs/')) {
                        programName = page.pageTitle || 'Basketball Training Program';
                        optimizedMeta = "Join ".concat(programName, " at The Basketball Factory in Sparta, NJ. Expert coaching, proven results. ") +
                            "".concat(primaryKeyword ? "Master ".concat(primaryKeyword.toLowerCase(), ".") : '', " Register today!");
                    }
                    else if (pagePath.includes('/private-lessons')) {
                        optimizedMeta = "Elite 1-on-1 basketball training in NJ. ".concat(primaryKeyword ? "Improve ".concat(primaryKeyword.toLowerCase(), ".") : '', " ") +
                            "Professional coaches, custom programs, proven results. Book your session!";
                    }
                    else if (pagePath === '/') {
                        optimizedMeta = "The Basketball Factory - Elite basketball training in Sparta, NJ. Programs for youth & high school athletes. " +
                            "Expert coaching, skill development, competitive edge. Start your journey today!";
                    }
                    else {
                        keywords = __spreadArray([primaryKeyword], secondaryKeywords.slice(0, 2), true).filter(Boolean)
                            .join(', ');
                        if (keywords && !currentMeta.toLowerCase().includes(keywords.toLowerCase())) {
                            optimizedMeta = currentMeta.replace(/\.$/, '') + ". ".concat(keywords, ". Book now!");
                        }
                        else if (!currentMeta.includes('!') && !currentMeta.includes('?')) {
                            optimizedMeta = currentMeta.replace(/\.$/, '') + '. Register today!';
                        }
                    }
                    // Ensure meta description is within optimal length (150-160 characters)
                    if (optimizedMeta.length > 160) {
                        optimizedMeta = optimizedMeta.substring(0, 157) + '...';
                    }
                    else if (optimizedMeta.length < 120 && primaryKeyword) {
                        optimizedMeta += " ".concat(primaryKeyword, ". Sign up now!");
                    }
                    return [2 /*return*/, optimizedMeta];
            }
        });
    });
}
// Run if called directly
if (require.main === module) {
    optimizeMetaDescriptions()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
}
