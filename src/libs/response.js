class Responses {
    constructor() {
        return this;
    }
    success(errorCode, data, message, meta) {
        return {
            error: false,
            errorCode,
            data,
            message,
            meta
        };
    };
    error(errorCode, message) {
        return {
            error: true,
            errorCode,
            message
        };
    };
    output(errorCode, data, message) {
        return {
            error: false,
            errorCode,
            data,
            message
        }
    }
}
const responses = new Responses()
module.exports = responses