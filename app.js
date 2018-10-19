const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//load routes

const skills = require('./routes/skills');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//get rid of mongooses error
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(() => {
        console.log('mongoDb connected')
    })
    .catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//index route
app.get('/', (req, res) => {
    const theTitle = 'Keep Track Of Your Coding Skills';
    res.render('index', {
        title: theTitle
    });

});

//About Page
app.get('/about', (req, res) => {
    res.render('about')
});


//use routes
app.use('/skills', skills);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});

