const User = require ('../models/user');


// FETCH All Users
exports.getAll = (req, res) => {
    User.find()
        .exec()
        .then(users => {
            console.log('Sending users')
            res.send(users)
        })
        .catch((error) => {
            console.log(error.message);
            return[];
        })
}

// CREATE a new User
exports.create = (req, res) => {
    const user = new User({
        full_name: req.body.full_name,
        username: req.body.username,
        password: req.body.password,
        attributes: req.body.attributes,
    });

    // Save User in MongoDB
    user.save()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

// FIND ONE User by Id
exports.findOne = (req, res) => {
    User.findOne({ id: req.params.id })
    .then(user => {
        if(!user) {
            return res.status(500).send({
                message: `User not found with Id ${req.params.id}`
            })
        }
        console.log(`Sending project with Id: ${req.params.id}`)
        res.send(user)
    }).catch(err => {
        return res.status(500).send({
            message: `Error retrieving User with ${req.params.id} ${err.message}`
        })
    })
}

// UPDATE a Project with Id
exports.update = (req, res) => {
    // Find project and update it
    User.updateOne({_id: req.params.id}, {
        name: req.body.name,
        id: req.body.id,
        githubURL: req.body.githubURL,
        repoName: req.body.repoName,
        repoOwner: req.body.repoOwner,
        githubToken: req.body.githubToken,
        deployMethods: req.body.deployMethods,
    }, {new: true})
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: `Project not found with Id  ${req.params.id}`
            });
        }
        res.send(project);
    }).catch(err => {
        return res.status(500).send({
            message: `Error updating Project with Id ${req.params.id} ${err.message}`
        });
    });
}

// DELETE a Project
exports.delete =(req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: `Project not found with Id ${req.params.id}`
            });
        }
        res.send({message: 'Project deleted successfully!'});
    }).catch(err => {
        return res.status(500).send({
            message: `Error delete Project with Id ${req.params.id} ${err.message}`
        });
    })
}