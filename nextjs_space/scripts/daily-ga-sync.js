"use strict";
/**
 * Daily GA Sync Runner
 * Executes the automatedGASync function and logs results
 */
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
var seo_automation_1 = require("../lib/seo-automation");
var email_1 = require("../lib/email");
var date_fns_1 = require("date-fns");
var fs_1 = require("fs");
function runSync() {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, logFile, result, keywordsSynced, logEntry, emailError_1, emailErrorLog, error_1, errorLog, emailError_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timestamp = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 12]);
                    console.log("[".concat(timestamp, "] Starting daily GA sync..."));
                    return [4 /*yield*/, (0, seo_automation_1.automatedGASync)()];
                case 2:
                    result = _a.sent();
                    keywordsSynced = result.message.includes('successful') ? 'N/A' : '0';
                    logEntry = "[".concat(timestamp, "] Status: ").concat(result.success ? 'SUCCESS' : 'FAILURE', " | Message: ").concat(result.message, " | Keywords Synced: ").concat(keywordsSynced, "\n");
                    (0, fs_1.appendFileSync)(logFile, logEntry);
                    console.log(logEntry);
                    if (!!result.success) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, email_1.sendEmail)({
                            to: 'khouston@thebasketballfactorynj.com',
                            subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
                            html: "\n            <h2>Daily Google Analytics Sync Failed</h2>\n            <p><strong>Timestamp:</strong> ".concat(timestamp, "</p>\n            <p><strong>Error Message:</strong> ").concat(result.message, "</p>\n            <p><strong>Keywords Synced:</strong> ").concat(keywordsSynced, "</p>\n            <hr>\n            <p>Please check the logs or visit the admin dashboard to investigate further.</p>\n          ")
                        })];
                case 4:
                    _a.sent();
                    console.log('Alert email sent to khouston@thebasketballfactorynj.com');
                    return [3 /*break*/, 6];
                case 5:
                    emailError_1 = _a.sent();
                    console.error('Failed to send alert email:', emailError_1);
                    emailErrorLog = "[".concat(timestamp, "] Email alert failed: ").concat(emailError_1, "\n");
                    (0, fs_1.appendFileSync)(logFile, emailErrorLog);
                    return [3 /*break*/, 6];
                case 6:
                    process.exit(result.success ? 0 : 1);
                    return [3 /*break*/, 12];
                case 7:
                    error_1 = _a.sent();
                    errorLog = "[".concat(timestamp, "] Status: ERROR | Message: ").concat(error_1.message, " | Keywords Synced: 0\n");
                    (0, fs_1.appendFileSync)(logFile, errorLog);
                    console.error(errorLog);
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, email_1.sendEmail)({
                            to: 'khouston@thebasketballfactorynj.com',
                            subject: '🚨 Daily GA Sync Error - Rise As One AAU',
                            html: "\n          <h2>Daily Google Analytics Sync Error</h2>\n          <p><strong>Timestamp:</strong> ".concat(timestamp, "</p>\n          <p><strong>Error Message:</strong> ").concat(error_1.message, "</p>\n          <p><strong>Stack Trace:</strong></p>\n          <pre>").concat(error_1.stack || 'N/A', "</pre>\n          <hr>\n          <p>Please check the logs or visit the admin dashboard to investigate further.</p>\n        ")
                        })];
                case 9:
                    _a.sent();
                    console.log('Error alert email sent to khouston@thebasketballfactorynj.com');
                    return [3 /*break*/, 11];
                case 10:
                    emailError_2 = _a.sent();
                    console.error('Failed to send error alert email:', emailError_2);
                    return [3 /*break*/, 11];
                case 11:
                    process.exit(1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
runSync();
