const { StatusCodes, ReasonPhrases } = require('http-status-codes');

class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
        this.reasonPhrases = ReasonPhrases.NOT_FOUND;
        this.reason = message;
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.reasonPhrases = ReasonPhrases.BAD_REQUEST;
        this.reason = message;
    }
}

class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
        this.reasonPhrases = ReasonPhrases.UNAUTHORIZED;
        this.reason = message;
    }
};

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
        this.reasonPhrases = message;
        this.reason = message;
    };
};


module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
}