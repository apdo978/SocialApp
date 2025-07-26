import express, { Router, RequestHandler } from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment
} from '../controllers/post.controller';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    postValidation,
    commentValidation,
    idValidation
} from '../validators';

const router: Router = express.Router();

// Cast middleware and controller functions to RequestHandler
router.route('/')
    .get(getPosts as RequestHandler)
    .post(protect as RequestHandler, postValidation, validate as RequestHandler, createPost as RequestHandler);

router.route('/:id')
    .get( validate as RequestHandler, protect as RequestHandler,getPost as RequestHandler)
    .put(protect as RequestHandler, idValidation, postValidation, validate as RequestHandler, updatePost as RequestHandler)
    .delete(protect as RequestHandler, idValidation, validate as RequestHandler, deletePost as RequestHandler);

router.route('/:id/like')
    .put(protect as RequestHandler, idValidation, validate as RequestHandler, likePost as RequestHandler);

router.route('/:id/comments')
    .post(protect as RequestHandler, commentValidation, validate as RequestHandler, addComment as RequestHandler);

export default router;
