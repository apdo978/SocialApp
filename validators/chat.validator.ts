import { body } from 'express-validator';

export const validateCreateGroup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Group name must be between 3 and 50 characters'),
  body('users')
    .isArray({ min: 2 })
    .withMessage('Group must have at least 2 other members')
    .custom((users: string[]) => {
      if (!users.every((user) => typeof user === 'string' && user.length === 24)) {
        throw new Error('Invalid user ID in the users array');
      }
      return true;
    }),
];

export const validateRenameGroup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Group name must be between 3 and 50 characters'),
];

export const validateGroupMembers = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 24, max: 24 })
    .withMessage('Invalid user ID format'),
];

export const validateSendMessage = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message content cannot exceed 2000 characters'),
  body('chatId')
    .trim()
    .notEmpty()
    .withMessage('Chat ID is required')
    .isLength({ min: 24, max: 24 })
    .withMessage('Invalid chat ID format'),
];
