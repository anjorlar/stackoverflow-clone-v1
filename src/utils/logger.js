const { createLogger, format, transports, error } = require('winston');
module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.align(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),
    defaultMeta: { service: 'Stackoverflow-Clone' },
    transports: [
        new transports.File({
            maxsize: 5120000,
            //maxFiles:5,
            filename: `${process.cwd()}/logs/error.log`, level: 'error'
        }),
        new transports.File({
            maxsize: 5120000,
            filename: `${process.cwd()}/logs/combined.log`
        }),
    ]
});