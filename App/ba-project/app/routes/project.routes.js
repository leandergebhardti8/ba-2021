module.exports = function(app) {
    var projectService = require('../services/projectService.js');
    
    // Create a new project
    app.post('/api/project', projectService.create);

    // Get all projects
    app.get('/api/projects', projectService.getAll);

    // Get one project by Id
    app.get('/api/project/:id', projectService.findOne);

    // Update a Project with Id
    app.put('/api/project/:id', projectService.update);

    // Delete a Project with Id
    app.delete('/api/project/:id', projectService.delete);
}