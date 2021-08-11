module.exports = function(app) {
    var userController = require('../services/projectController.js');
    
    // Create a new user
    app.post('/api/login', userController.findOne);

    // Get all projects
    app.get('/api/register', userController.create);

    // Get one project by Id
    app.get('/api/user/:id', userController.findOne);

    // Update a Project with Id
    app.put('/api/user/:id', userController.update);

    // Delete a Project with Id
    app.delete('/api/user/:id', userController.delete);
}