const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);

// on database connection
mongoose.connection.on('connected', () => {
    console.log('connected to db ' + config.database);
});

// on database error
mongoose.connection.on('error', (err) => {
    console.log('Database error' + err);
});

const app = express();

const users = require('./routes/users');
const posts = require('./routes/posts');

// port no
// const port = 3000;

const port = process.env.PORT || 8080;


// cors middleware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/posts', posts);



// index route
app.get('/', (req, res) => {
    res.send('Invaid Endpoint')
});

app.get('*', (req,res) =>{
res.sendFile(path.join(__dirname, 'public/index.html'));
});



// start server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
