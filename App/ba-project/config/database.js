/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
// const user = require('./models/user');
// const project = require('./models/project');

const { Schema } = mongoose;
const keys = require('./keys');

mongoose.pluralize(null);

module.exports = () => {
	mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

	mongoose.Promise = global.Promise;

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', () => {
		console.info('CONNECTED TO DB!');
	});

	// return {
	// 	users: {
	// 		get(id, cb) {
	// 			return user.findOne(
	// 				{
	// 					id
	// 				},
	// 				cb
	// 			);
	// 		},
	// 		save(data, cb) {
	// 			user.findOne(
	// 				{
	// 					id: data.id
	// 				},
	// 				(err, user) => {
	// 					if (err) {
	// 						if (cb) return cb(err);
	// 					}
	// 					if (!user) {
	// 						user = new user(data);
	// 					}

	// 					// copy values
	// 					// eslint-disable-next-line guard-for-in
	// 					for (const key in data) {
	// 						// eslint-disable-next-line no-param-reassign
	// 						user[key] = data[key];
	// 					}
	// 					user.save(err => {
	// 						if (cb) cb(err, user);
	// 					});
	// 				}
	// 			);
	// 		},
	// 		all(cb) {
	// 			return user.find({}, cb);
	// 		},
	// 		find(data, cb) {
	// 			return user.find(data, cb);
	// 		}
	// 	},
	// 	projects: {
	// 		addProject(data, cb) {
	// 			console.log('RECEIVED DATA\n', data);
	// 			project.findOne(
	// 				{
	// 					projectId: data.user
	// 				},
	// 				(err, user) => {
	// 					if (err) {
	// 						if (cb) return cb(err);
	// 					}
	// 					if (!user) {
	// 						console.log('Creating new user');
	// 						user = new project({
	// 							projectId: data.user,
	// 							options: {}
	// 						});
	// 						console.log(user);
	// 					}

	// 					console.log('SAVING USER\n', user);

	// 					user.markModified('options');

	// 					user.save(err => {
	// 						if (cb) cb(err, user);
	// 					});
	// 				}
	// 			);
	// 		},
	// 		getProject(uid, cb) {
	// 			return project.findOne(
	// 				{
	// 					projectId: uid
	// 				},
	// 				cb
	// 			);
	// 		},
	// 		removeProject(uid, cb) {
	// 			return project.deleteOne({ userId: uid }, cb);
	// 		}
	// 	},
	// };
};
