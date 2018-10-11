const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//load user model

require('../models/User');
const User = mongoose.model('users');


//user login route

router.get('/login', (req, res) => {
    res.render('users/login');
});

//user register route

router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login Form POST

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register form POST

router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password !== req.body.password2) {
        errors.push({text: 'passwords do not match'});
    }
    if (req.body.password.length < 5) {
        errors.push({text: "Password Must Be At Least 5 Characters"});
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        //look for duplicate user
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email has already been registered');
                    res.redirect('/users/register');
                }
                else {
                    //create new user object
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    //encrypt password

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    if(user) {
                                        req.flash('success_msg', 'You are now registered and can log in');
                                        res.redirect('/users/login');
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            });
    }
});


//logout

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;