export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('uncaughtException', (err) => {
      // Suppress the digest null crash from stale Server Actions
      if (err?.message?.includes('digest') || err?.message?.includes('Server Action')) {
        console.error('[TBF] Suppressed Server Action error:', err.message);
        return;
      }
      console.error('[TBF] Uncaught exception:', err);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('[TBF] Unhandled rejection:', reason);
    });
  }
}
