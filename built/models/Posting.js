//import mongoose = require('mongoose');
var db_1 = require('../db');
// set type of User Id to ObjectId // but what if want to fill with blank
var Schema = db_1["default"].Schema, ObjectId = Schema.ObjectId;
;
var PostingSchema = new db_1["default"].Schema({
    user_id: String,
    title: { type: String, required: 'Please Enter Title' },
    price: { type: Number, required: 'Please Enter Price' },
    category: { type: String, required: 'Please Select a Category' },
    description: { type: String, required: 'Please Enter Some Description' },
    images: { type: Array, required: 'Please Add Some Images' },
    name: { type: String, required: 'Please Enter Name' },
    phone: { type: Number, required: 'Please Enter Valid Phone' },
    state: { type: String, required: 'Please Select a State' },
    city: { type: String, required: 'Pleaset Selec a City' },
    status: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now() }
});
exports.Posting = db_1["default"].model('Posting', PostingSchema);
