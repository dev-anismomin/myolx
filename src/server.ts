// =======================
// reference TDS files ============
// =======================

/// <reference path='../typings/tsd.d.ts' />


// =======================
// get the packages we need ============
// =======================

import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");

import express = require('express');
var app: express.Express = express();
import path = require('path');
import morgan = require('morgan');

import mongoose = require('mongoose');
var hash : any = require('bcryptjs');
var hbs: any = require('express-hbs');

import flash = require('connect-flash');

var hbsHelpers = require('./helpers/hbs-helpers');

app.set('port', (process.env.PORT || 3000));

// =======================
// Routers ============
// =======================
import account = require('./routes/account');
import pages = require('./routes/pages');
import postingRoute = require('./routes/posting');
import adminRoute = require('./routes/admin');
//import imageRoute = require('./routes/images');
app.use(account);

// =======================
// Configration ============
// =======================
app.set('views', path.join(__dirname, './../views'));
app.use('/public', express.static(path.join(__dirname, '/../public')));
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.engine('hbs', hbs.express4({
	defaultLayout: path.join(__dirname, './../views/layouts/main.hbs'),
	helpers: require(path.join(__dirname, "./../public/js/helpers.js")).helpers, 
	partialsDir: path.join(__dirname, './../views/partials'),
	layoutsDir: path.join(__dirname, './../views/layouts')
}));
app.use(morgan('dev')); 



// app.use(function(req, res, next) {
// 	res.locals = {
// 		username: req.session["isLogin"] ? req.session["user"].username : null,
// 		admin: req.session["isLogin"] ? req.session["user"].admin : false
// 	}
// 	next();
// });


// =======================
// Route Authenticatoin Helper ============
// =======================
function auth(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
	} else {
		next();
	}
} 

function onlyAdmin(req, res, next) {
	if (!req.user || !req.user.admin) {
		res.redirect('/');
	} else {
		next();
	}
} 

// =======================
// Routes ============
// =======================
// Simple Routes

app.use('/', pages); 
app.use('/posting', postingRoute);
app.use('/admin', onlyAdmin, adminRoute);
//app.use('/images', imageRoute);

// Simple Routes

// =======================
// Server Start ============
// =======================
// var port: number = process.env.PORT | 3000;


var server = app.listen(app.get('port'), () => {
	var listeningPort: number = server.address().port;
	console.log('The server is listening on port: ' + listeningPort);
});


