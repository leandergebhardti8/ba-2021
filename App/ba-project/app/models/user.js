const mongoose = require('mongoose');
    
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
		}
	}, { collection: 'user' });

	const user = mongoose.model('user', userSchema);

    module.exports = user;