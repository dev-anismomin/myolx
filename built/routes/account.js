/// <reference path='./../../typings/tsd.d.ts' />
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var router = express.Router();
var User_1 = require('../models/User');
function hash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
router
    .use(bodyParser.json())
    .use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(session({
    genid: function (req) {
        return (Date.now().toString()); // use UUIDs for session IDs 
    },
    secret: 'asdsae324h2h4n2kh42nh4n456kh45l09wuc220230ymc80m',
    resave: false,
    saveUninitialized: true
}))
    .use(flash())
    .get('/login', function (req, res) {
    var vm = { title: 'Login', test: 5 };
    res.render('signin', vm);
}).post('/', function (req, res, next) {
    var userdata = {
        email: req.body.email.toLowerCase(),
        password: hash(req.body.password)
    };
    User_1.User.findOne(userdata, function (err, user) {
        if (user) {
            req.session['user_id'] = user._id;
            req.session["isLogin"] = true;
            req.session["user"] = user;
            if (user.admin) {
                req.flash("info", "Welcome Admin !");
                res.redirect("/admin");
            }
            else {
                req.flash("info", "Welcome User hope you are fine!");
                res.redirect("/");
            }
        }
        else {
            var vm = {
                title: 'Login',
                input: req.body,
                error: new Error('Credentials not match with record!')
            };
            res.render('signin', vm);
        }
    });
})
    .get('/register', function (req, res) {
    var vm = {
        title: 'Register'
    };
    req.flash("info", "Welcome User hope you are fine!");
    res.render('signup', vm);
})
    .post('/register', function (req, res, next) {
    var b = req.body;
    if (b.password !== b.cpassword) {
        var vm = {
            title: 'Register',
            input: req.body,
            error: new Error('The passwords do not match')
        };
        res.render('signup', vm);
    }
    else {
        User_1.User.findOne({ email: b.email.toLowerCase() }, function (err, user) {
            var userdata = {
                username: b.username,
                email: b.email.toLowerCase(),
                admin: false,
                status: false,
                password: hash(b.password)
            };
            if (b.email == 'anis_momin@hotmail.com' || b.email == 'anismomin@hotmail.com') {
                userdata.admin = true;
                userdata.status = true;
            }
            if (!user) {
                var newUser = new User_1.User(userdata);
                newUser.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    req.session['user_id'] = newUser._id;
                    req.session["isLogin"] = true;
                    req.session["user"] = newUser;
                    res.redirect("/");
                });
            }
            else {
                var vm = {
                    title: 'Register',
                    input: req.body,
                    error: new Error('The Email you entered already exists!')
                };
                res.render('signup', vm);
            }
        });
    }
})
    .get('/logout', function (req, res) {
    delete req.session['user_id'];
    delete req.session["isLogin"];
    delete req.session["user"];
    res.redirect('/login');
})
    .use(function (req, res, next) {
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
})
    .use(function (req, res, next) {
    if (req.session['user_id']) {
        User_1.User.findOne({ _id: req.session['user_id'] }, function (err, user) {
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
            next();
        });
    }
    else {
        next();
    }
});
module.exports = router;
