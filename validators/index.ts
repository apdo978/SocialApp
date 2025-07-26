import { body, param } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Please add a username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    
    body('email')
        .notEmpty()
        .withMessage('Please add an email')
        .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .withMessage('Please add a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Please add a password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('firstName')
        .notEmpty()
        .trim() .withMessage('Please add a firstName')
        .isLength({ min: 3 }),
    
    body('lastName')
         .notEmpty()
       .trim().withMessage('Please add a lastName')
        .isLength({ min: 3 })
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const updateDetailsValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    
    body('email')
        .optional()
        .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .withMessage('Please add a valid email')
        .normalizeEmail(),
    
    body('firstName')
        .optional()
        .trim(),
    
    body('lastName')
        .optional()
        .trim(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot be more than 500 characters')
];

export const postValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Post content is required')
        .isLength({ max: 1000 })
        .withMessage('Post content cannot exceed 1000 characters'),
    
    body('privacy')
        .optional()
        .isIn(['public', 'private', 'friends'])
        .withMessage('Invalid privacy setting'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    
    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Tags cannot be empty')
];

export const commentValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid post ID'),
    
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ max: 500 })
        .withMessage('Comment cannot exceed 500 characters')
];

export const idValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format')
];

export {
  validateCreateGroup,
  validateRenameGroup,
  validateGroupMembers,
  validateSendMessage,
} from './chat.validator';
