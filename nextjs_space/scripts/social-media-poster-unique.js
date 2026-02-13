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
        var secretsPath, secrets, twitterCreds, sevenDaysAgo, recentPosts, recentPagePaths, topContent, recentPrograms, posts, _i, topContent_1, content, post, _a, recentPrograms_1, program, post, postedCount, postedDetails, _b, _c, post, result, error_1, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🎯 Starting Social Media Auto-Posting...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 24, 25, 27]);
                    secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
                    secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
                    twitterCreds = secrets['x (twitter) - basketball factory'];
                    if (!twitterCreds || !twitterCreds.secrets) {
                        console.error('❌ Twitter credentials not found');
                        return [2 /*return*/];
                    }
                    sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma.sEOAuditLog.findMany({
                            where: {
                                action: 'social_media_post',
                                success: true,
                                timestamp: {
                                    gte: sevenDaysAgo
                                }
                            }
                        })];
                case 2:
                    recentPosts = _d.sent();
                    recentPagePaths = new Set(recentPosts.map(function (p) { return p.pagePath; }));
                    return [4 /*yield*/, prisma.sEOPerformance.findMany({
                            where: {
                                dateKey: {
                                    gte: sevenDaysAgo.toISOString().split('T')[0]
                                },
                                pagePath: {
                                    not: null,
                                    notIn: Array.from(recentPagePaths)
                                }
                            },
                            orderBy: { clicks: 'desc' },
                            take: 10
                        })];
                case 3:
                    topContent = _d.sent();
                    return [4 /*yield*/, prisma.sEOPageConfig.findMany({
                            where: {
                                status: 'active',
                                pagePath: {
                                    contains: '/programs/',
                                    notIn: Array.from(recentPagePaths)
                                }
                            },
                            orderBy: { updatedAt: 'desc' },
                            take: 5
                        })];
                case 4:
                    recentPrograms = _d.sent();
                    posts = [];
                    _i = 0, topContent_1 = topContent;
                    _d.label = 5;
                case 5:
                    if (!(_i < topContent_1.length)) return [3 /*break*/, 8];
                    content = topContent_1[_i];
                    if (!(content.pagePath && content.pagePath !== '/' && !recentPagePaths.has(content.pagePath))) return [3 /*break*/, 7];
                    return [4 /*yield*/, generatePostContent(content)];
                case 6:
                    post = _d.sent();
                    if (post)
                        posts.push(post);
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    _a = 0, recentPrograms_1 = recentPrograms;
                    _d.label = 9;
                case 9:
                    if (!(_a < recentPrograms_1.length)) return [3 /*break*/, 12];
                    program = recentPrograms_1[_a];
                    if (!!recentPagePaths.has(program.pagePath)) return [3 /*break*/, 11];
                    return [4 /*yield*/, generateProgramPost(program)];
                case 10:
                    post = _d.sent();
                    if (post)
                        posts.push(post);
                    _d.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12:
                    console.log("\uD83D\uDCDD Generated ".concat(posts.length, " potential posts"));
                    console.log("\uD83D\uDEAB Skipped ".concat(recentPagePaths.size, " recently posted pages"));
                    postedCount = 0;
                    postedDetails = [];
                    _b = 0, _c = posts.slice(0, 3);
                    _d.label = 13;
                case 13:
                    if (!(_b < _c.length)) return [3 /*break*/, 23];
                    post = _c[_b];
                    _d.label = 14;
                case 14:
                    _d.trys.push([14, 21, , 22]);
                    return [4 /*yield*/, postToTwitter(post, twitterCreds.secrets)];
                case 15:
                    result = _d.sent();
                    if (!(result.success && result.tweetId)) return [3 /*break*/, 17];
                    postedCount++;
                    // Log individual post to audit
                    return [4 /*yield*/, prisma.sEOAuditLog.create({
                            data: {
                                action: 'social_media_post',
                                entityType: 'page',
                                pagePath: post.pagePath,
                                performedBy: 'system',
                                success: true,
                                changes: {
                                    text: post.text,
                                    url: post.url,
                                    tweetId: result.tweetId
                                }
                            }
                        })];
                case 16:
                    // Log individual post to audit
                    _d.sent();
                    postedDetails.push({
                        platform: 'Twitter/X',
                        content: post.text,
                        url: post.url,
                        tweetId: result.tweetId,
                        timestamp: new Date().toISOString()
                    });
                    console.log("\u2705 Posted to Twitter: ".concat(post.text.substring(0, 50), "..."));
                    return [3 /*break*/, 18];
                case 17:
                    console.log("\u26A0\uFE0F Failed to post: ".concat(result.error));
                    _d.label = 18;
                case 18:
                    if (!(posts.indexOf(post) < posts.length - 1)) return [3 /*break*/, 20];
                    console.log('⏳ Waiting 60 seconds before next post...');
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 19:
                    _d.sent(); // 1 minute delay
                    _d.label = 20;
                case 20: return [3 /*break*/, 22];
                case 21:
                    error_1 = _d.sent();
                    console.error("\u274C Failed to post:", error_1);
                    return [3 /*break*/, 22];
                case 22:
                    _b++;
                    return [3 /*break*/, 13];
                case 23:
                    console.log("\n\u2728 Social Media Auto-Posting Complete!");
                    console.log("\uD83D\uDCCA Posted ".concat(postedCount, " updates"));
                    return [2 /*return*/, {
                            success: true,
                            postsCreated: postedCount,
                            posts: postedDetails
                        }];
                case 24:
                    error_2 = _d.sent();
                    console.error('❌ Social media posting failed:', error_2);
                    throw error_2;
                case 25: return [4 /*yield*/, prisma.$disconnect()];
                case 26:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
}
exports.autoPostToSocial = autoPostToSocial;
function generatePostContent(content) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var url, text, hashtags, programName, templates, templates;
        return __generator(this, function (_b) {
            // Skip if pagePath is null or empty
            if (!content.pagePath) {
                return [2 /*return*/, null];
            }
            url = "https://riseasoneaau.com".concat(content.pagePath);
            text = '';
            hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];
            if (content.pagePath.includes('/programs/')) {
                programName = ((_a = content.pagePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/-/g, ' ')) || 'Program';
                templates = [
                    "\uD83C\uDFC0 Discover ".concat(programName, " - Elite basketball training that delivers results! \uD83C\uDFC6"),
                    "\u2B50 ".concat(programName, " is transforming young athletes. Join us today!"),
                    "\uD83D\uDD25 ".concat(programName, ": Where dedication meets excellence. Limited spots!"),
                    "\uD83D\uDCAA Elevate your game with ".concat(programName, ". Expert coaching awaits!")
                ];
                text = templates[Math.floor(Math.random() * templates.length)];
                hashtags.push('#BasketballTraining');
            }
            else if (content.pagePath.includes('/private-lessons')) {
                templates = [
                    "\u2B50 1-on-1 basketball training that gets results! Personalized coaching for serious athletes.",
                    "\uD83C\uDFC0 Private lessons with expert coaches. Transform your game today!",
                    "\uD83D\uDCAA Take your skills to the next level with personalized basketball training."
                ];
                text = templates[Math.floor(Math.random() * templates.length)];
                hashtags.push('#PrivateTraining');
            }
            else if (content.pagePath.includes('/about')) {
                text = "\uD83C\uDFC0 Learn about our mission to develop champions on and off the court!";
            }
            else if (content.pagePath.includes('/contact')) {
                text = "\uD83D\uDCDE Ready to start your basketball journey? Get in touch with us today!";
            }
            else {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, { text: text, url: url, hashtags: hashtags, pagePath: content.pagePath }];
        });
    });
}
function generateProgramPost(program) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var url, programName, templates, text, hashtags;
        return __generator(this, function (_b) {
            url = "https://riseasoneaau.com".concat(program.pagePath);
            programName = program.pageTitle || ((_a = program.pagePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/-/g, ' ')) || 'Basketball Program';
            templates = [
                "\uD83C\uDFC0 ".concat(programName, " - Join the best basketball training in NJ! \uD83C\uDFC6"),
                "\u2B50 Ready to elevate your game? ".concat(programName, " offers expert coaching!"),
                "\uD83D\uDD25 ".concat(programName, " - Where champions are made. Register now!"),
                "\uD83D\uDCAA ".concat(programName, ": Elite training, proven results. Limited spots!"),
                "\uD83C\uDFC0 Transform your game with ".concat(programName, ". Expert coaches, real results!")
            ];
            text = templates[Math.floor(Math.random() * templates.length)];
            hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];
            return [2 /*return*/, { text: text, url: url, hashtags: hashtags, pagePath: program.pagePath }];
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
                    return [2 /*return*/, { success: true, tweetId: result.data.id }];
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
