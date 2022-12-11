const {createLogger, transports, format} = require('winston');

const getLabel = function (moduleDetails) {
    if (Object.keys(moduleDetails).length > 0) {
        // let parts = moduleDetails.filename.split(path.sep)
        // return parts.pop();
        return moduleDetails.filename;
    }else{
        return;
    }
}

module.exports = function (callingModule) {
    return new createLogger({
        transports: [
            new transports.File({
                label: getLabel(callingModule),
                filename: 'error.log',
                timestamp: true,
                format: format.combine(format.label({label:getLabel(callingModule)}),format.timestamp(), format.json())
            })
        ]
    });
}
