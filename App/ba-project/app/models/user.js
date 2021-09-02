const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const confiq = require('./config/config')
    
	/* Environment */
	const environmentSchema = new mongoose.Schema({
		name: String,
		action: String,
		url: String,
		builds: [String],
	});

	/* deployMethod */
	const deployMethod = new mongoose.Schema({
		name: String,
		environments: [environmentSchema],
	});

	/* Project */
	const projectSchema = new mongoose.Schema({
		projectId: {
			type: String,
			index: true
		},
		id: String,
		name: String,
		githubURL: String,
		repoName: String,
		repoOwner: String,
		githubToken: String,
		deployMethods: [deployMethod],
	});

    /* User Schema */
	const userSchema = new mongoose.Schema({
		full_name: {
			type: String,
			trim: true,
		},
		username: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			unique: false,
			require: true,
		},
		attributes: {
			type: Object,
			default: {}
		},
		projects: [projectSchema]
	});

	userSchema.methods.comparepassword=function(password, hash, cb){
		bcrypt.compare(password, hash, function(err, isMatch){
			if(err) return cb(false);
			cb(null, isMatch);
		})
	}

	// userSchema.methods.generateToken=function(cb){
	// 	var user = this;
	// 	var token=jwt.sign(user._id.toHexString(), confiq.SECRET);

	// 	user.token=token;
	// 	user.save(function(err, user){
	// 		if(err) return cb(err);
	// 		cb(null, user);
	// 	})
	// }

	const user = mongoose.model('user', userSchema);

    module.exports = user;