const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//user login route

router.get('/login', (req, res) => {
    res.send('login');
});

//user register route

router.get('/register', (req, res) => {
    res.send('register');
});



module.exports = router;