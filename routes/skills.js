const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load auth helper
const {ensureAuthenticated} = require('../helpers/auth');

// Load Skills Model
require('../models/Skills');
const Skill = mongoose.model('skills');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Skill.find({user: req.user.id})
        .sort({date:'desc'})
        .then(skills => {
            res.render('skills/index', {
                skills:skills
            });
        });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('skills/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Skill.findOne({
        _id: req.params.id
    })
        .then(skill => {
            if (skill.user !== req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/skills ');
            } else {
                res.render('skills/edit', {
                    skill: skill
                });
            }
        });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0){
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Skill(newUser)
            .save()
            .then(skill => {
                req.flash('success_msg', 'Code Skill Added');
                res.redirect('/skills');
            })
    }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Skill.findOne({
        _id: req.params.id
    })
        .then(skill => {
            // new values
            skill.title = req.body.title;
            skill.details = req.body.details;
            skill.save()
                .then(skill => {
                    req.flash('success_msg', 'Skill Choice Updated');
                    res.redirect('/skills');
                })
        });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Skill.deleteOne({
        _id: req.params.id
    })
        .then(() => {
            req.flash('success_msg', 'Skill Choice Removed');
            res.redirect('/skills');
        });
});

module.exports = router;