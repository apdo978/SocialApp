"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.likePost = exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const post_model_1 = require("../models/post.model");
const user_model_1 = require("../models/user.model");
// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Add user to req.body
        req.body.author = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        console.log(req.body);
        const post = yield post_model_1.Post.create(req.body);
        const id = post._id.toString();
        const user = yield user_model_1.User.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, { $push: { posts: id } }, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.Post.find({ privacy: { $ne: "private" } }) // Exclude private posts
            .populate('author', '_id username avatar email firstName lastName role bio')
            .populate('comments.user', '_id username email avatar firstName lastName role bio')
            .populate('likes', '_id username avatar email firstName lastName role bio')
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPosts = getPosts;
// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_model_1.Post.find({ author: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
            .populate('author', '-_id username avatar')
            .populate('comments.user', '-_id username email avatar')
            .populate('likes', '-_id username email avatar');
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
    }
    catch (error) {
        next(error);
    }
});
exports.getPost = getPost;
// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }
        // Make sure user is post owner
        if (post.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            res.status(401).json({
                success: false,
                error: 'User not authorized to update this post'
            });
            return;
        }
        post = yield post_model_1.Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePost = updatePost;
// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }
        // Make sure user is post owner
        if (post.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            res.status(401).json({
                success: false,
                error: 'User not authorized to delete this post'
            });
            return;
        }
        yield post.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('request to like post', req.params.id);
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Check if post has already been liked
        if (post.likes.some(like => like.equals(userId))) {
            // Unlike
            post.likes = post.likes.filter(like => !like.equals(userId));
        }
        else {
            // Like
            post.likes.push(userId);
        }
        yield post.save();
        res.status(200).json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
exports.likePost = likePost;
// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Post not found'
            });
            return;
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
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
        yield post.save();
        res.status(200).json({
            success: true,
            data: post
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addComment = addComment;
