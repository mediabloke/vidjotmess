const express = require('express');
const exphbs = require('express-handlebars');
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


const port = 5000;


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

//add idea form

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
});

