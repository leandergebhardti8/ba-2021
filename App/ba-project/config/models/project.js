const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

	/* Project */
	const projectSchema = new mongoose.Schema({
		projectId: {
			type: String,
			index: true
		},
		id: String,
		name: String,
		githubURL: String,
		deployMethods: [{
			name: String,
			environments: [{
				name: String,
				action: String,
				url: String,
				builds: [String],
			}],
		}],
		

	});

	const project = mongoose.model('project', projectSchema);

    module.exports.project = project;