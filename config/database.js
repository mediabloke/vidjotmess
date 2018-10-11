if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://yossi:Foofly123@ds129823.mlab.com:29823/vid-jod-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}