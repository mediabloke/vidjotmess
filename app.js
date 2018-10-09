const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


//get rid of mongooses error

mongoose.Promise = global.Promise;

//connect to mongoose

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then( () => {console.log('mongoDb connected')})
    .catch(err => console.log(err));

//load idea model

require('./views/models/Idea')
const Idea = mongoose.model('ideas');


//handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));;

//index route

app.get('/', (req, res) => {
    const theTitle = 'what\'s the poiyyyyynt';
    res.render('index', {
        title: theTitle
    });

});

//About Page

app.get('/about', (req, res) => {
    res.render('about')
});

//add ideas redirect

app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    })
    
});

//add idea form

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
});

//edit idea form

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    })
    
});


//process form

app.post('/ideas', (req, res) => {
   let errors = [];
   if(!req.body.title){
       errors.push({text: 'please add a title'});
   }
   if(!req.body.details) {
       errors.push({text: 'please add some details'});
   }

   if(errors.length > 0) {
       res.render('ideas/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   } else{
       const newUser = {
           title: req.body.title,
           details: req.body.details
       }
       new Idea(newUser)
       .save()
       .then(idea => {
           res.redirect('/ideas');
       })
   }
});

//edit form process

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        })
    })
});

//delete ideas

app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id })
    .then(()=>{
        res.redirect('/ideas');
    })
})

const port = 5000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});

