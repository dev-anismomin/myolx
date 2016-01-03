/// <reference path='../../typings/tsd.d.ts' />
var express = require('express');
var router = express.Router();
router
    .get('/', function (req, res) {
    var vm = {
        title: 'Home Page',
        bodyClass: 'home'
    };
    res.render('index', vm);
});
module.exports = router;
