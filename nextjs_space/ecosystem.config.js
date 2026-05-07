module.exports = {
  apps: [{
    name: 'thebasketballfactory',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/thebasketballfactory/nextjs_space',
    kill_timeout: 10000,
    listen_timeout: 10000,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
  }]
};
