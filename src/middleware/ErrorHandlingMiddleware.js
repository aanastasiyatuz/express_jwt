const ApiError = require("../utils/error");

const ErrorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
};

module.exports = ErrorMiddleware;
