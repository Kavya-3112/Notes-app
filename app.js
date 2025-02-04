require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const connectDB = require('./backend/server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Use sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Connect to Database
connectDB();  

// Static Files
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Templating Engine
app.use(expressLayouts);
app.set('layout', path.join('layouts', 'main'));
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./backend/server/routes/auth'));
app.use('/', require('./backend/server/routes/index'));
app.use('/', require('./backend/server/routes/dashboard'));

// Handle 404
app.get('*', function(req, res) {
  res.status(404).render('404', { layout: 'layouts/main' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
