import express, { Router, RequestHandler } from 'express';
import { register, login, getMe, updateDetails, getFriend } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    registerValidation,
    loginValidation,
    updateDetailsValidation
} from '../validators';

const router: Router = express.Router();

router.route('/register')
    .post(registerValidation, validate as RequestHandler, register as RequestHandler);

router.route('/login')
    .post(loginValidation, validate as RequestHandler, login as RequestHandler);

router.route('/me')
    .get(protect as RequestHandler, getMe as RequestHandler);
router.route('/friend/:friendId')
    .get(protect as RequestHandler, getFriend as RequestHandler);

router.route('/updatedetails')
    .put(protect as RequestHandler, updateDetailsValidation, validate as RequestHandler, updateDetails as RequestHandler);

export default router;
