const ApiError = require('../utils/ApiError'); 

const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        statusCode = err.statusCode || 500;
        message = err.message || "Internal Server Error";
    }

    const response = {
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

module.exports = errorMiddleware;