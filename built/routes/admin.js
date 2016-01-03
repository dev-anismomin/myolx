/// <reference path='../../typings/tsd.d.ts' />
var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var User_1 = require('../models/User');
var Posting_1 = require('../models/Posting');
// Param Precondiction for reuse name parameter
router.param('user_id', function (req, res, next, user_id) {
    User_1.User.find({ _id: user_id }, function (err, docs) {
        if (err) {
            var er = new Error('User Not Found');
            next(err);
        }
        else {
            req.user = docs[0];
            next();
        }
    });
});
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
//seurured route with restrict
router
    .get('/', function (req, res) {
    User_1.User.find({}, function (err, docs) {
        var posts = [];
        for (var i = 0; i < docs.length; i++) {
            if (!docs[i].admin) {
                posts.push(docs[i]);
            }
        }
        var vm = {
            title: 'Users',
            users: posts
        };
        res.render('users/index', vm);
    });
})
    .get('/users', function (req, res) {
    User_1.User.find({}, function (err, docs) {
        var posts = [];
        for (var i = 0; i < docs.length; i++) {
            if (!docs[i].admin) {
                posts.push(docs[i]);
            }
        }
        var vm = {
            title: 'Users',
            users: posts
        };
        res.render('users/index', vm);
    });
})
    .get('/users/:user_id', function (req, res) {
    //show	
    res.render('users/show', { user: req.user });
})
    .get('/users/:user_id/edit', function (req, res) {
    res.render('users/edit', { user: req.user });
})
    .put('/users/:user_id', function (req, res) {
    var user_id = req;
    var b = req.body;
    var userstatus = false;
    if (b.status != undefined) {
        userstatus = true;
    }
    User_1.User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);
        user.username = b.username;
        user.status = userstatus;
        user.updated_at = Date.now();
        user.save(function (err) {
            if (err)
                res.send(err);
            delete user.password;
            user.password = null;
            console.log(user);
            //res.redirect('/admin/users/'+user._id);
            res.json({ status: 'Success', message: 'User updated!', callback: 'updateUser', data: user });
        });
    });
})
    .delete('/users/:user_id', function (req, res) {
    // User.remove({ '_id': req.params.user_id }, function(err, user) {
    // 	res.json({ status: 'Success', message: 'User Delete!', callback: 'deleteUser', data: user, });
    // });
    User_1.User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);
        user.remove(function (err, user) {
            if (err)
                res.send(err);
            res.json({ status: 'Success', message: 'User Delete!', callback: 'deleteUser', data: user });
            //res.end();
        });
    });
})
    .get('/postings', function (req, res) {
    Posting_1.Posting.find({}, function (err, docs) {
        var vm = {
            title: 'Postings',
            postings: docs
        };
        res.render('postings/index', vm);
    });
});
module.exports = router;
