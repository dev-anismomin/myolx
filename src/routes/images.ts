/// <reference path='../../typings/tsd.d.ts' />

import express = require('express');
import multer = require('multer');
import fs = require('fs');

// var upload: any = multer({
// 	dest: 'uploads/',
// 	inMemory: true
// });

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
})

var upload = multer({ storage: storage })


var router = express.Router();

router.get('/', (req, res) => {
	
	let vm = {
		title: 'Uploader'
	}
	res.render('postings/images', vm);

}).post('/', upload.array('file'), (req: express.Request, res: express.Response, next) => {
	
	console.log(req.files);

	res.send(typeof req.files[0].filename);

	// console.log(req.files.file.name);
	// console.log(req.files.file.path);
	// console.log(req.files.file.type);

	// var file = __dirname + "/" + req.files.file.name;
	// fs.readFile(req.files.file.path, function(err, data) {
 //        fs.writeFile(file, data, function(err) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			response = {
	// 				message: 'File uploaded successfully',
	// 				filename: req.files.file.name
	// 			};
	// 		}
	// 		console.log(response);
	// 		res.end(JSON.stringify(response));
	// 	});
	// });

	// console.log(req.files);
	
}).get('/:id', function(req, res) {
	var pic_id = req.param('id');
	var gfs = req.gfs;

	gfs.files.find({ filename: pic_id }).toArray(function(err, files) {

        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = 'image/jpeg';
            res.set('Content-Type', mime);
            var read_stream = gfs.createReadStream({ filename: pic_id });
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });
});

export  = router;