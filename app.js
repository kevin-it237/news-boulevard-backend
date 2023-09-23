const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
const config = require('./config/database');
const http = require('http');
const path = require('path');
const { initializeApp } = require("firebase-admin/app");
const firebaseAdmin = require("firebase-admin");

// Routes
const news = require('./api/routes/news');
const admin = require('./api/routes/admin');
const emailsRoutes = require('./api/routes/emails');
const auth = require('./api/routes/auth');

require('dotenv').config();

// Connect to db
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('Connected to mongodb', config.database);
})

// App initialization
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

initializeApp({
    credential: firebaseAdmin.credential.applicationDefault()
});

const server = http.createServer(app);

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

/* App Routes */
app.use('/api/auth', auth);
app.use('/api/news', news);
app.use('/api/admin', admin);
app.use('/api/email', emailsRoutes); 

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

// Start the app
server.listen(process.env.PORT || 5000, function() {
    console.log("Server started")
})