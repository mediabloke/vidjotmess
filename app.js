const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const app = express();

//load routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');


//get rid of mongooses error

mongoose.Promise = global.Promise;

//connect to mongoose

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then( () => {console.log('mongoDb connected')})
    .catch(err => console.log(err));

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
  }));

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



//use routes

app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});

