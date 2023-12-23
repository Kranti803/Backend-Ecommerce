export const CustomError = (err, req, res, next) => {

    err.StatusCode = err.StatusCode || 500;
    err.message = err.message || "Internal Server Error"
    res.status(err.StatusCode).json({
        message: err.message
    })

}