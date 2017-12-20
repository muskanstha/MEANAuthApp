

const mongoose = require('mongoose');
const config = require('../config/database');


// post Schema

// const User = require('../models/user');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    }
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
}

module.exports.getPublicPosts = function (callback) {
    // query.select('-access');
    // Post.find({ public: true }, { access: 0 }, callback);
    var query = Post.find({ public: true }, callback).select('title content author -_id');

};

module.exports.getPrivatePosts = function (user, callback) {
    // console.log(user);
    var query = Post.find({ author: user.username, public: false }, callback).select('title content author public -_id');
    // User.find({}, { password: 0 }, { phone: 0 }, callback);
};