"use strict";
/**
 * Daily GA Sync Runner
 * Executes the automatedGASync function and logs results
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seo_automation_1 = require("../lib/seo-automation");
const db_1 = require("../lib/db");
const fs = __importStar(require("fs"));
async function runGASync() {
    const timestamp = new Date().toISOString();
    const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
    try {
        console.log(`[${timestamp}] Starting automated GA sync...`);
        // Execute the sync
        const result = await (0, seo_automation_1.automatedGASync)();
        // Count synced keywords
        const keywordCount = await db_1.prisma.sEOKeyword.count({
            where: { isActive: true }
        });
        console.log(`[${timestamp}] ${result.message} - Keywords synced: ${keywordCount}`);
        // Log to file
        const logEntry = `[${timestamp}] ${result.success ? 'SUCCESS' : 'FAILURE'} - ${result.message} - Keywords synced: ${keywordCount}\n`;
        fs.appendFileSync(logFile, logEntry);
        return { ...result, keywordsSynced: keywordCount };
    }
    catch (error) {
        const errorMsg = error.message || 'Unknown error occurred';
        console.error(`[${timestamp}] ERROR:`, error);
        // Log error to file
        const logEntry = `[${timestamp}] FAILURE - Error: ${errorMsg}\nStack: ${error.stack}\n`;
        fs.appendFileSync(logFile, logEntry);
        return { success: false, message: errorMsg, keywordsSynced: 0, error: error.stack };
    }
    finally {
        await db_1.prisma.$disconnect();
    }
}
// Execute the sync
runGASync()
    .then(result => {
    console.log('Sync completed:', result);
    process.exit(result.success ? 0 : 1);
})
    .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
