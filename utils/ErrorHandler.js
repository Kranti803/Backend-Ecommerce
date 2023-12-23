export class ErrorHandler extends Error {
    constructor(message, StatusCode) {
        super(message)
        this.StatusCode = StatusCode
    }
}