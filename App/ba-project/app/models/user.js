const mongoose = require('mongoose');
    
    /* User Schema */
	const userSchema = new mongoose.Schema({
		id: {
			type: String,
			index: true
		},
		name: {
			first: {
				type: String,
				trim: true,
			},
			last: {
				type: String,
				trim: true,
			},
		},
		username: {
			type: String,
			unique: true,
			required: true,
		},
		attributes: {
			type: Object,
			default: {}
		}
	});

	const user = mongoose.model('user', userSchema);

    module.exports = user;