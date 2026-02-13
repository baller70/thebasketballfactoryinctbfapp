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
exports.createEmailTemplate = exports.sendEmail = void 0;
var resend_1 = require("resend");
var resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function sendEmail(_a) {
    var _b;
    var to = _a.to, subject = _a.subject, html = _a.html, _c = _a.from, from = _c === void 0 ? 'The Basketball Factory <khouston@thebasketballfactorynj.com>' : _c;
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    console.log('📤 Attempting to send email:', {
                        to: to,
                        from: from,
                        subject: subject,
                        hasHtml: !!html,
                        htmlLength: (html === null || html === void 0 ? void 0 : html.length) || 0
                    });
                    return [4 /*yield*/, resend.emails.send({
                            from: from,
                            to: to,
                            subject: subject,
                            html: html,
                        })];
                case 1:
                    result = _d.sent();
                    if (result.error) {
                        console.error('❌ Error sending email via Resend:', {
                            to: to,
                            subject: subject,
                            error: result.error
                        });
                        return [2 /*return*/, { success: false, error: result.error }];
                    }
                    console.log('✅ Email sent successfully via Resend:', {
                        to: to,
                        subject: subject,
                        messageId: (_b = result.data) === null || _b === void 0 ? void 0 : _b.id
                    });
                    return [2 /*return*/, { success: true, data: result.data }];
                case 2:
                    error_1 = _d.sent();
                    console.error('❌ Exception sending email via Resend:', {
                        to: to,
                        subject: subject,
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                        fullError: error_1
                    });
                    return [2 /*return*/, { success: false, error: error_1 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.sendEmail = sendEmail;
function createEmailTemplate(content, customerName) {
    return "\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <style>\n          body {\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n          }\n          .header {\n            background: linear-gradient(135deg, #0066cc 0%, #004d99 100%);\n            color: white;\n            padding: 30px 20px;\n            text-align: center;\n            border-radius: 8px 8px 0 0;\n          }\n          .content {\n            background: white;\n            padding: 30px 20px;\n            border: 1px solid #e0e0e0;\n            border-top: none;\n          }\n          .footer {\n            background: #f5f5f5;\n            padding: 20px;\n            text-align: center;\n            font-size: 12px;\n            color: #666;\n            border-radius: 0 0 8px 8px;\n          }\n          .button {\n            display: inline-block;\n            padding: 12px 30px;\n            background: #0066cc;\n            color: white;\n            text-decoration: none;\n            border-radius: 5px;\n            margin: 15px 0;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <h1>Rise As One AAU</h1>\n        </div>\n        <div class=\"content\">\n          ".concat(customerName ? "<p>Hi ".concat(customerName, ",</p>") : '', "\n          ").concat(content, "\n        </div>\n        <div class=\"footer\">\n          <p>\u00A9 ").concat(new Date().getFullYear(), " Rise As One AAU - The Basketball Factory</p>\n          <p>If you have any questions, please contact us at khouston@thebasketballfactorynj.com</p>\n        </div>\n      </body>\n    </html>\n  ");
}
exports.createEmailTemplate = createEmailTemplate;
