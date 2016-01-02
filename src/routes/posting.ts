/// <reference path='../../typings/tsd.d.ts' />

import express = require('express');
import path = require('path');
var methodOverride = require('method-override');
var multer = require('multer');
var crypto = require('crypto');

var storage = multer.diskStorage({
	destination: './uploads/',
	filename: function(req, file, cb) {
		crypto.pseudoRandomBytes(16, function(err, raw) {
			if (err) return cb(err)
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});

var upload = multer({ storage: storage })

var router = express.Router();

import {IUserModel, User} from '../models/User';
import {IPostingModel, Posting} from '../models/Posting';

router.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method
		delete req.body._method
		return method
	}
}))

router.get('/', (req: express.Request, res: express.Response) => {

	Posting.find({ status: true }, (err, docs) => {
		
		let vm = {
			title: 'Advertisment',
			postings: docs
		};

		res.render('postings/index', vm);
	});


})
router.get('/create', (req: express.Request, res: express.Response) => {
	
	let vm = {
		title: 'Ad Posting'
	};
	
	res.render('postings/create', vm);

}).post('/post', upload.array('images', 12), (req: express.Request, res: express.Response, next) => {
	

	let b = req.body;
	var images = req.files;
	var imgArray = [];
	
	images.forEach(function(file) {
		imgArray.push({
			path: file.path,
			filename: file.filename
		});
	});


	let userId = '';

	if (req.session["isLogin"] ) {
		userId = req.session["user"]._id.toString();	
	} 

	let posting: IPostingModel = new Posting({
		user_id: userId,
		title: b.title,
		category: b.category,
		price: b.price,
		description: b.description,
		images: imgArray,
		name: b.name,
		phone: b.phone,
		state: b.state,
		city: b.city,
		created_at: Date.now()
	});
	console.log(posting);

	posting.save(function(err) {
		if (err) {
			
			var vm = {
				title: 'Create Posting',
				input: req.body,
				error: err
			};
			res.render('postings/my', vm);
			return;	
		}

		res.redirect('/posting/my');
	});


}).get('/my', (req: express.Request, res: express.Response) => {

	Posting.find({}, (err, docs) => {

		var posts = [];
			
		var user = req.session["user"];

		if (req.session["isLogin"] && !user.admin) {
			for (var i = 0; i < docs.length; i++) {
				if (req.session["user"]._id == docs[i].user_id) {
					posts.push(docs[i]);
				}
			}
		} else {

			for (var i = 0; i < docs.length; i++) {
				if (docs[i].status == true) {
					posts.push(docs[i]);
				}
			}
		}
	
		let vm = {
			title: 'My Advertisments',
			postings: posts
		};

		res.render('postings/index', vm);
	});

}).get('/:id' , (req: express.Request, res: express.Response) => {

	Posting.findOne({ _id: req.params.id }, (err, docs) => {

		let vm = {
			title: req.params.title,
			posting: docs
		};

		res.render('postings/show', vm);

	});

}).get('/:post_id/edit', (req: express.Request, res: express.Response) => {

	Posting.findOne({ _id: req.params.post_id }, (err, docs) => {
		let vm = {
			title: req.params.title,
			posting: docs
		};
		res.render('postings/edit', vm);
	});

}).put('/:post_id', (req, res) => {

	var b = req.body;
	// var postStatus = false;

	// if (b.status != undefined) {
	// 	postStatus = true;
	// }

	// Posting.findById(req.params.post_id, function(err, post) {
	// 	res.send(post);

	// 	if (err)	
	// 		res.send(err);

	// 	post.title = b.title;
	// 	post.category = b.category;
	// 	post.price = b.price;
	// 	post.description = b.description;
	// 	post.name = b.name;
	// 	post.phone = b.phone;
	// 	post.state = b.state;
	// 	post.city = b.city;
	// 	// post.status = postStatus;
	// 	// post.updated_at = Date.now();
		
	// 	post.save(function(err) {
	// 		if (err)
	// 			res.send(err);

	// 		//res.redirect('/admin/users/'+user._id);
	// 		res.json({ status: 'Success', message: 'Post updated!', callback: 'updateUser', data: post, });
	// 	});

	// });


	Posting.update(
	{
		_id: req.params.post_id
	},
	{
		title: b.title,
		category: b.category,
		price: b.price,
		description: b.description,
		name: b.name,
		phone: b.phone,
		state: b.state,
		city: b.city,
	},
	(err, user) => {
		res.redirect(req.params.post_id);
	});

})
.delete('/:post_id', (req, res) => {

	var b = req.body;
	Posting.update(
		{
			_id: req.params.post_id
		},
		{
			title: b.title,
			category: b.category,
			price: b.price,
			description: b.description,
			name: b.name,
			phone: b.phone,
			state: b.state,
			city: b.city,
		},
		(err, user) => {
			res.redirect(req.params.id);
		});

});


export  = router;