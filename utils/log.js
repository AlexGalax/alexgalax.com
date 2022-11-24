const stream = require('logrotate-stream');

const logFileError = stream({ file: process.env.LOG_FILE_ERROR, size: '100k', keep: 3 });
module.exports.errorLog = require('errorlog')({
    logger: logFileError,
    level: process.env.LOG_LEVEL
});

const logFileDebug = stream({ file: process.env.LOG_FILE_OPENAI, size: '100k', keep: 3 });
module.exports.debugLog = require('errorlog')({
    logger: logFileDebug,
    level: process.env.LOG_LEVEL
});