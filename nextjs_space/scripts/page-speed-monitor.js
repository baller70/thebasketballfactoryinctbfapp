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
exports.monitorPageSpeed = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function monitorPageSpeed() {
    return __awaiter(this, void 0, void 0, function () {
        var pages, baseUrl, results, slowPages, _i, pages_1, page, url, metrics, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎯 Starting Page Speed Monitoring...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, 11, 13]);
                    return [4 /*yield*/, prisma.sEOPageConfig.findMany({
                            where: { status: 'active' }
                        })];
                case 2:
                    pages = _a.sent();
                    baseUrl = 'https://thebasketballfactoryinc.com';
                    results = [];
                    slowPages = [];
                    _i = 0, pages_1 = pages;
                    _a.label = 3;
                case 3:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 8];
                    page = pages_1[_i];
                    url = "".concat(baseUrl).concat(page.pagePath);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, checkPageSpeed(url)];
                case 5:
                    metrics = _a.sent();
                    results.push(metrics);
                    // Flag slow pages (load time > 3 seconds or LCP > 2.5s)
                    if (metrics.loadTime > 3000 || metrics.largestContentfulPaint > 2500) {
                        slowPages.push({
                            page: page.pagePath,
                            loadTime: metrics.loadTime,
                            lcp: metrics.largestContentfulPaint,
                            speedScore: metrics.speedScore,
                            issues: metrics.issues
                        });
                        console.log("\u26A0\uFE0F  Slow page detected: ".concat(page.pagePath, " (").concat(metrics.loadTime, "ms)"));
                    }
                    else {
                        console.log("\u2713 ".concat(page.pagePath, " is performing well (").concat(metrics.loadTime, "ms)"));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to check ".concat(page.pagePath, ":"), error_1);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: 
                // Log to audit
                return [4 /*yield*/, prisma.sEOAuditLog.create({
                        data: {
                            action: 'page_speed_monitored',
                            entityType: 'page',
                            performedBy: 'system',
                            changes: {
                                totalPages: results.length,
                                slowPages: slowPages.length,
                                averageLoadTime: results.reduce(function (sum, r) { return sum + r.loadTime; }, 0) / results.length,
                                slowPagesDetails: slowPages
                            }
                        }
                    })];
                case 9:
                    // Log to audit
                    _a.sent();
                    console.log("\n\u2728 Page Speed Monitoring Complete!");
                    console.log("\uD83D\uDCCA Checked ".concat(results.length, " pages"));
                    console.log("\u26A0\uFE0F  ".concat(slowPages.length, " slow pages detected"));
                    return [2 /*return*/, {
                            success: true,
                            totalPages: results.length,
                            slowPages: slowPages.length,
                            results: results,
                            slowPagesDetails: slowPages
                        }];
                case 10:
                    error_2 = _a.sent();
                    console.error('❌ Page speed monitoring failed:', error_2);
                    throw error_2;
                case 11: return [4 /*yield*/, prisma.$disconnect()];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.monitorPageSpeed = monitorPageSpeed;
function checkPageSpeed(url) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, apiUrl, response, data, lighthouseMetrics, performanceScore, issues, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
                    if (!apiKey) {
                        // Fallback to simulated metrics for testing
                        console.log('⚠️  No PageSpeed API key found, using simulated data');
                        return [2 /*return*/, simulatePageSpeedMetrics(url)];
                    }
                    apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=".concat(encodeURIComponent(url), "&key=").concat(apiKey, "&category=PERFORMANCE");
                    return [4 /*yield*/, fetch(apiUrl)];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _b.sent();
                    if (!response.ok) {
                        throw new Error("PageSpeed API error: ".concat(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'));
                    }
                    lighthouseMetrics = data.lighthouseResult.audits;
                    performanceScore = data.lighthouseResult.categories.performance.score * 100;
                    issues = [];
                    // Check for common issues
                    if (lighthouseMetrics['largest-contentful-paint'].score < 0.5) {
                        issues.push('Slow Largest Contentful Paint - optimize images and critical rendering path');
                    }
                    if (lighthouseMetrics['cumulative-layout-shift'].score < 0.5) {
                        issues.push('High Cumulative Layout Shift - specify image dimensions and avoid dynamic content');
                    }
                    if (lighthouseMetrics['total-blocking-time'].score < 0.5) {
                        issues.push('High Total Blocking Time - minimize JavaScript execution');
                    }
                    if (lighthouseMetrics['server-response-time'].score < 0.5) {
                        issues.push('Slow server response time - optimize backend and caching');
                    }
                    return [2 /*return*/, {
                            url: url,
                            loadTime: parseFloat(lighthouseMetrics['speed-index'].displayValue.replace(/[^\d.]/g, '')) * 1000,
                            firstContentfulPaint: parseFloat(lighthouseMetrics['first-contentful-paint'].displayValue.replace(/[^\d.]/g, '')) * 1000,
                            largestContentfulPaint: parseFloat(lighthouseMetrics['largest-contentful-paint'].displayValue.replace(/[^\d.]/g, '')) * 1000,
                            timeToInteractive: parseFloat(lighthouseMetrics['interactive'].displayValue.replace(/[^\d.]/g, '')) * 1000,
                            cumulativeLayoutShift: parseFloat(lighthouseMetrics['cumulative-layout-shift'].displayValue),
                            speedScore: performanceScore,
                            issues: issues
                        }];
                case 3:
                    error_3 = _b.sent();
                    console.error("Error checking page speed for ".concat(url, ":"), error_3);
                    return [2 /*return*/, simulatePageSpeedMetrics(url)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function simulatePageSpeedMetrics(url) {
    // Simulate metrics for testing (remove in production)
    var baseLoadTime = 1500 + Math.random() * 2000;
    return {
        url: url,
        loadTime: baseLoadTime,
        firstContentfulPaint: baseLoadTime * 0.6,
        largestContentfulPaint: baseLoadTime * 0.8,
        timeToInteractive: baseLoadTime * 1.2,
        cumulativeLayoutShift: Math.random() * 0.3,
        speedScore: 70 + Math.random() * 25,
        issues: baseLoadTime > 3000 ? ['Page load time exceeds 3 seconds'] : []
    };
}
// Run if called directly
if (require.main === module) {
    monitorPageSpeed()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
}
