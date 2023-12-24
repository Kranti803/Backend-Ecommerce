export const catchAsyncError = (passedFunc) => {
    return (req, res, next) => {
        Promise.resolve(passedFunc(req,res,next)).catch(next)
    }
}