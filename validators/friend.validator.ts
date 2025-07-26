import { body, param } from 'express-validator';

export const validateFriendRequest = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    
    body('message')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Message cannot exceed 200 characters')
];
