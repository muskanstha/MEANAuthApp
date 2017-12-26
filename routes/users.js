const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');
// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        permission: 'user',
    });

    User.getUserByUsername(req.body.username, (err, user) => {
        if (err) throw err;
        if (!user) {
            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to register user' });
                } else {
                    res.json({ success: true, msg: 'registered user' });
                }
            });
        }
        else {
            res.json({ success: false, msg: 'user already exists' });
        }
    });

});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        permission: user.permission
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Could not delete user' });
            }
        });
    });
});


// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// Users
// router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     User.getUsers((err, users) => {
//         if (err) throw err;
//         res.json({
//             users: users
//         });
//     });
// });

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.getUsers((err, users) => {
        if (err) throw err;
        res.json({
            users: users
        });
    });
});

// get users list will full details
router.get('/manage', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if (req.user.permission === 'user') {
        return res.json({ success: false, msg: 'Access NOT authorized!!' });
    }
    else if (req.user.permission === 'admin') {
        User.getUsersFull((err, users) => {
            if (err) throw err;
            res.json({
                users: users
            });
        });
    }
    else {
        return res.json({ success: false, msg: 'Access NOT authorized!!' });
    }
});

// delete users
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const id = req.params.id;
    
    if (req.user.permission === 'user') {
        return res.json({ success: false, msg: 'Access NOT authorized!!' });
    }
    else if (req.user.permission === 'admin') {
        // console.log(id);
        // User.deleteUser(id,(err) => {
        //     if (err) throw err;
        // });
        // res.json({ success: true, msg: 'User Successfully deleted!!' });

        User.getUserById(id, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({ success: false, msg: 'User not found' });
            }
            User.deleteUser(id,(err) => {
                if (err) throw err;
                res.json({ success: true, msg: 'User Successfully deleted!!' });
            });
        });

        // User.getUserByUsername(username, (err, user) => {
        //     if (err) throw err;
        //     if (!user) {
        //         return res.json({ success: false, msg: 'User not found' });
        //     }
            
        // });
    }
    else {
        return res.json({ success: false, msg: 'Access NOT authorized!!' });
    }
});


// Validate
// router.get('/validate', (req,res, next) => {
//     res.send('VALIDATE')
// })


module.exports = router;