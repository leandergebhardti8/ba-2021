module.exports = function(app) {
    var userController = require('../services/userController.js');
    
    // Create new User
    app.post('/api/register', userController.create);

    // find User and check if provided LoginInfo is correct
    app.post('/api/login', userController.logIn);

    // Get one User by username
    app.get('/api/user/:username', userController.findOne);

    // Update a User with Id
    app.put('/api/user/:username:password', userController.update);

    // Delete a User with Username and Password
    app.delete('/api/user/:username:password', userController.delete);
}