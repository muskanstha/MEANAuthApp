const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const Post = require('../models/post');

const User = require('../models/user');
const config = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // console.log(req.body.title);

    let newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user.username,
        access: req.body.access,
        public: req.body.public
    });
    console.log(newPost);
    Post.addPost(newPost, (err, post) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create post' });
        } else {
            res.json({ success: true, msg: 'Post Created' });

        }
    })
});

router.get('/public', (req, res, next) => {
    Post.getPublicPosts((err, posts) => {
        if (err) throw err;
        res.json({
            posts: posts
        });
    });
});

router.get('/private', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // console.log(req.user);
    Post.getPrivatePosts(req.user, (err, posts) => {
        if (err) throw err;
        res.json({
            posts: posts
        });
    });
});
module.exports = router;
