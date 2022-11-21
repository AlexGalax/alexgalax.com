const stream = require('logrotate-stream');
const logFile = stream({ file: process.env.LOG_FILE_ERROR, size: '100k', keep: 3 });

module.exports = require('errorlog')({
    logger: logFile,
    level: process.env.LOG_LEVEL
});