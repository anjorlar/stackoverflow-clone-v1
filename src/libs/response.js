class Responses {
    constructor() {
        return this;
    }
    success(errorCode, message, data, meta) {
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
    output(errorCode, message, data) {
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