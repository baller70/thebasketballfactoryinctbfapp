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
exports.autoPostToSocial = void 0;
var client_1 = require("@prisma/client");
var fs = require("fs");
var path = require("path");
var prisma = new client_1.PrismaClient();
function autoPostToSocial() {
    return __awaiter(this, void 0, void 0, function () {
        var secretsPath, secrets, twitterCreds, sevenDaysAgo, topContent, recentPrograms, posts, _i, topContent_1, content, post, _a, recentPrograms_1, program, post, postedCount, postedDetails, _b, _c, post, result, error_1, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🎯 Starting Social Media Auto-Posting...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 20, 21, 23]);
                    secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
                    secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
                    twitterCreds = secrets['x (twitter) - basketball factory'];
                    if (!twitterCreds || !twitterCreds.secrets) {
                        console.error('❌ Twitter credentials not found');
                        return [2 /*return*/];
                    }
                    sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma.sEOPerformance.findMany({
                            where: {
                                dateKey: {
                                    gte: sevenDaysAgo.toISOString().split('T')[0]
                                },
                                pagePath: {
                                    not: null
                                }
                            },
                            orderBy: { clicks: 'desc' },
                            take: 5
                        })];
                case 2:
                    topContent = _d.sent();
                    return [4 /*yield*/, prisma.sEOPageConfig.findMany({
                            where: {
                                status: 'active',
                                pagePath: {
                                    contains: '/programs/'
                                }
                            },
                            orderBy: { updatedAt: 'desc' },
                            take: 3
                        })];
                case 3:
                    recentPrograms = _d.sent();
                    posts = [];
                    _i = 0, topContent_1 = topContent;
                    _d.label = 4;
                case 4:
                    if (!(_i < topContent_1.length)) return [3 /*break*/, 7];
                    content = topContent_1[_i];
                    if (!(content.pagePath !== '/')) return [3 /*break*/, 6];
                    return [4 /*yield*/, generatePostContent(content)];
                case 5:
                    post = _d.sent();
                    if (post)
                        posts.push(post);
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    _a = 0, recentPrograms_1 = recentPrograms;
                    _d.label = 8;
                case 8:
                    if (!(_a < recentPrograms_1.length)) return [3 /*break*/, 11];
                    program = recentPrograms_1[_a];
                    return [4 /*yield*/, generateProgramPost(program)];
                case 9:
                    post = _d.sent();
                    if (post)
                        posts.push(post);
                    _d.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11:
                    postedCount = 0;
                    postedDetails = [];
                    _b = 0, _c = posts.slice(0, 3);
                    _d.label = 12;
                case 12:
                    if (!(_b < _c.length)) return [3 /*break*/, 18];
                    post = _c[_b];
                    _d.label = 13;
                case 13:
                    _d.trys.push([13, 16, , 17]);
                    return [4 /*yield*/, postToTwitter(post, twitterCreds.secrets)];
                case 14:
                    result = _d.sent();
                    if (result.success) {
                        postedCount++;
                        postedDetails.push({
                            platform: 'Twitter/X',
                            content: post.text,
                            url: post.url,
                            timestamp: new Date().toISOString()
                        });
                        console.log("\u2705 Posted to Twitter: ".concat(post.text.substring(0, 50), "..."));
                    }
                    // Wait between posts to avoid rate limiting
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 15:
                    // Wait between posts to avoid rate limiting
                    _d.sent(); // 1 minute delay
                    return [3 /*break*/, 17];
                case 16:
                    error_1 = _d.sent();
                    console.error("\u274C Failed to post:", error_1);
                    return [3 /*break*/, 17];
                case 17:
                    _b++;
                    return [3 /*break*/, 12];
                case 18: 
                // Log to audit
                return [4 /*yield*/, prisma.sEOAuditLog.create({
                        data: {
                            action: 'social_media_posted',
                            entityType: 'content',
                            performedBy: 'system',
                            changes: {
                                postsCreated: postedCount,
                                posts: postedDetails
                            }
                        }
                    })];
                case 19:
                    // Log to audit
                    _d.sent();
                    console.log("\n\u2728 Social Media Auto-Posting Complete!");
                    console.log("\uD83D\uDCCA Posted ".concat(postedCount, " updates"));
                    return [2 /*return*/, {
                            success: true,
                            postsCreated: postedCount,
                            posts: postedDetails
                        }];
                case 20:
                    error_2 = _d.sent();
                    console.error('❌ Social media posting failed:', error_2);
                    throw error_2;
                case 21: return [4 /*yield*/, prisma.$disconnect()];
                case 22:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
}
exports.autoPostToSocial = autoPostToSocial;
function generatePostContent(content) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var url, text, hashtags, programName;
        return __generator(this, function (_b) {
            // Skip if pagePath is null or empty
            if (!content.pagePath) {
                return [2 /*return*/, null];
            }
            url = "https://thebasketballfactoryinc.com".concat(content.pagePath);
            text = '';
            hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];
            if (content.pagePath.includes('/programs/')) {
                programName = ((_a = content.pagePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/-/g, ' ')) || 'Program';
                text = "\uD83C\uDFC0 Join our ".concat(programName, "! Elite coaching, proven results, and a pathway to success. Limited spots available!");
                hashtags.push('#BasketballTraining', '#EliteCoaching');
            }
            else if (content.pagePath.includes('/private-lessons')) {
                text = "\u2B50 Transform your game with 1-on-1 basketball training! Our expert coaches create personalized programs for maximum results.";
                hashtags.push('#PrivateTraining', '#SkillDevelopment');
            }
            else {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, { text: text, url: url, hashtags: hashtags }];
        });
    });
}
function generateProgramPost(program) {
    return __awaiter(this, void 0, void 0, function () {
        var url, programName, templates, text, hashtags;
        return __generator(this, function (_a) {
            url = "https://thebasketballfactoryinc.com".concat(program.pagePath);
            programName = program.pageTitle || 'Basketball Program';
            templates = [
                "\uD83C\uDFC0 ".concat(programName, " is now open for registration! Join the best basketball training in NJ."),
                "\u2B50 Ready to elevate your game? ".concat(programName, " offers expert coaching and proven results."),
                "\uD83D\uDD25 Don't miss out! ".concat(programName, " - where champions are made. Register today!"),
                "\uD83D\uDCAA Take your skills to the next level with ".concat(programName, ". Limited spots available!")
            ];
            text = templates[Math.floor(Math.random() * templates.length)];
            hashtags = ['#Basketball', '#NJBasketball', '#BasketballTraining', '#YouthSports'];
            return [2 /*return*/, { text: text, url: url, hashtags: hashtags }];
        });
    });
}
function postToTwitter(post, creds) {
    return __awaiter(this, void 0, void 0, function () {
        var TwitterApi, client, tweetText, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    TwitterApi = require('twitter-api-v2').TwitterApi;
                    client = new TwitterApi({
                        appKey: creds.api_key.value,
                        appSecret: creds.api_secret.value,
                        accessToken: creds.access_token.value,
                        accessSecret: creds.access_token_secret.value,
                    });
                    tweetText = "".concat(post.text, "\n\n").concat(post.url, "\n\n").concat(post.hashtags.join(' '));
                    return [4 /*yield*/, client.v2.tweet(tweetText)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Twitter API error:', error_3);
                    return [2 /*return*/, {
                            success: false,
                            error: error_3.message || 'Unknown error'
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (require.main === module) {
    autoPostToSocial()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
}
