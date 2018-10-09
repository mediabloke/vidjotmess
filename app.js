const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
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
app.use(methodOverride('_method'));

//session middleware

app.use(session({
    secret: 'secres',
    resave: true,
    saveUninitialized: true
  }))

  app.use(flash());

  //global variables

  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });

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
        req.flash('success_msg', 'Video Idea Added');
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
            req.flash('success_msg', 'Video Idea updated');
            res.redirect('/ideas');
        })
    })
});

//delete ideas

app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id })
    .then(()=>{
        req.flash('success_msg', 'Video Idea Removed');
        res.redirect('/ideas');
    })
})

const port = 5000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});

