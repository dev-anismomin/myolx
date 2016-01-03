//import mongoose = require('mongoose');
var db_1 = require('../db');
;
var UserSchema = new db_1["default"].Schema({
    username: { type: String, required: 'Please Enter Valid Email', unique: true },
    email: { type: String, required: 'Please Enter Valid Email', unique: true },
    password: { type: String, required: 'Password is Required' },
    admin: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now() },
    updated_at: Date
});
exports.User = db_1["default"].model('User', UserSchema);
