/// <reference path='../../typings/tsd.d.ts' />

import express = require('express');
var router = express.Router();

router
.get('/', (req, res) => {

	let vm = {
		title: 'Home Page',
		bodyClass: 'home'
	}

	res.render('index', vm);

});

export = router;