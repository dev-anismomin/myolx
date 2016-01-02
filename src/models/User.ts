//import mongoose = require('mongoose');

import mongoose from '../db'
import IUser from './IUser';

export interface IUserModel extends IUser, mongoose.Document { };

var UserSchema = new mongoose.Schema({
	username: { type: String, required: 'Please Enter Valid Email', unique: true },
	email: { type: String, required: 'Please Enter Valid Email', unique: true },
	password: { type: String, required: 'Password is Required' },
	admin: { type: Boolean, default: false },
	status: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now() },
	updated_at: Date
});

export let User = mongoose.model<IUserModel>('User', UserSchema);