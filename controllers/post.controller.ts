import { Request, Response, NextFunction } from 'express';
import { Post, IPost } from '../models/post.model';
import { IUser, User } from '../models/user.model';
import mongoose from 'mongoose';
import { log } from 'node:console';
import { getSocketInstance } from '../services/socket-context';


interface IAuthRequest extends Request {
    user?: IUser & {
        _id: mongoose.Types.ObjectId;
    };
}

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Add user to req.body
        req.body.author = req.user?._id;
         console.log(req.body);
          
        
       

        const post:any = await Post.create(req.body);
        const  id:string = post._id.toString();
  const user = await User.findByIdAndUpdate(req.user?._id, { $push: { posts: id } }, {
                    new: true,
                    runValidators: true
                });

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const posts = await Post.find({ privacy: { $ne: "private" } }) // Exclude private posts
            .populate('author', '_id username avatar email firstName lastName role bio')
            .populate('comments.user', '_id username email avatar firstName lastName role bio')
            .populate('likes', '_id username avatar email firstName lastName role bio')
            .sort('-createdAt');

         
         


        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await Post.find({ author: req.user?.id } )
            .populate('author', '-_id username avatar')
            .populate('comments.user', '-_id username email avatar')
            .populate('likes',    '-_id username email avatar');

        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }

        // Make sure user is post owner
        if (post.author.toString() !== req.user?._id.toString()) {
            res.status(401).json({
                success: false,
                error: 'User not authorized to update this post'
            });
            return;
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }

        // Make sure user is post owner
        if (post.author.toString() !== req.user?._id.toString()) {
            res.status(401).json({
                success: false,
                error: 'User not authorized to delete this post'
            });
            return;
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('request to like post', req.params.id, );
              const socketService = getSocketInstance();
        
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }

        const userId:any = req.user?._id;
        // Check if post has already been liked
        if (post.likes.some(like => like.equals(userId))) {
            // Unlike
            post.likes = post.likes.filter(like => !like.equals(userId));
        } else {
            // Like
            post.likes.push(userId);

             socketService.emitToUser(post.author.toString(), 'new Like', {
                        message: `Your Post: ${post.content} Got Alike`,
                    });
        }

        await post.save();
     

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
              const socketService = getSocketInstance();


        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }

        if (!req.user?._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const newComment = {
            user: req.user._id,
            content: req.body.content,
            createdAt: new Date()
        };

        post.comments.unshift(newComment);

        await post.save();
          socketService.emitToUser(post.author.toString(), 'new Comment', {
                        message: `Your Post: ${post.content} Got A Comment`,
                    });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};
