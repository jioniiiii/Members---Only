const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./config/passport');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const app = express();

//view Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//static Files
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use("/", indexRoutes);
app.use("/", authRoutes);

//start Server
app.listen(3000, () => console.log("app listening on http://localhost:3000/"));