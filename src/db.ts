/// <reference path='../typings/tsd.d.ts' />

import mongoose = require('mongoose');	

//mongoose.connect('mongodb://localhost:27017/olx');
mongoose.connect('mongodb://rambo:rambo123@ds037185.mongolab.com:37185/olx');

// https://serene-hollows-9541.herokuapp.com/

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(callback) {
	console.log('database connect Successfully');
});

export default mongoose;