import { Request, Response, NextFunction } from 'express';

interface ErrorResponse extends Error {
    statusCode?: number;
    code?: number;
}

export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    let error: ErrorResponse = {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode || 500,
        code: err.code,
    };
      
    error.message = err.message;

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err).map((val: any) => val.message).join(', ');
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};
