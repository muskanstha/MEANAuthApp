const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// user schema

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    permission: {
        type: String,
        required: true,
        default: 'user'
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
    const query = { username: username };
    User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
    // console.log(newUser);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getUsers = function (callback) {
    var query = User.find({}, callback).select('name email username');
    // User.find({}, { password: 0 }, { phone: 0 }, callback);
};

module.exports.getUsersFull = function (callback) {
    var query = User.find({}, callback).select('name email username phone permission');

    // var query =  User.find({},callback);
    // User.find({}, { password: 0 }, { phone: 0 }, callback);
};

module.exports.deleteUser = function (id, callback) {
    User.findByIdAndRemove(id, callback);
}