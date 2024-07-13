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
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.reasonPhrases = ReasonPhrases.BAD_REQUEST;
    }
}

class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
        this.reasonPhrases = ReasonPhrases.UNAUTHORIZED;
    }
};

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
        this.reasonPhrases = ReasonPhrases.FORBIDDEN;
    };
};


module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
}