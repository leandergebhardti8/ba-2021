// import axios from "axios";
const Project = require ('../models/project');
// import vm from 'v-response';

// export default {
//     async getProjects() {
//         let res = await axios.get("http://localhost:8080/projects");
//         return res.data;
//     },
    
//     async getProjectSingle(projectId) {
//         let res = await axios.get("http://localhost:8080/project/" + projectId);
//         return res.data;
//     },
// }

// FETCH All Projects
exports.getAll = (req, res) => {
    Project.find()
        .exec()
        .then(projects => {
            console.log('Sending projects')
            res.send(projects)
        })
        .catch((error) => {
            console.log(error.message);
            return[];
        })
}

// CREATE a new Project
exports.create = (req, res) => {
    const project = new Project({
        name: req.body.name,
        id: req.body.id,
        githubURL: req.body.githubURL,
        deployMethods: req.body.deployMethods,
    });

    // Save Project in MongoDB
    project.save()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

// FIND ONE Project by Id
exports.findOne = (req, res) => {
    Project.findOne({ id: req.params.id }), (err, obj) => {
        if(err) {
            res.status(500).send({
                message: err.message
            })
        }
        else {
            console.log(`Sending project with id ${req.params.id}`)
            res.send(obj)
        }
    }
}

// UPDATE a Project with Id
exports.update = (req, res) => {
    // FInd project and update it
    Project.findOne({ id: req.params.id}, {
        name: req.body.name,
        id: req.body.id,
        githubURL: req.body.githubURL,
        deployMethods: req.body.deployMethods
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
    Project.findOne({ id: req.params.id})
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

// exports.create_projects = (req, res) => {
//     let project_body = req.body;
//     const new_projects = new project(project_body);
//     new_projects.save()
//         .then(saved => {
//             if(!saved) {
//                 return res.status(400)
//                 .json(vm.ApiResponse(false, 400, "unable to save product please try again"))
//             }
//             if(saved) {
//                 return res.status(201)
//                     .json(vm.ApiResponse(true, 201, 'product created successfully', saved))
//             }
//         }).catch(error => {
//             return res.status(500)
//             .json(vm.ApiResponse(false, 500, 'hoops an error occured', undefined, error))
//         })
// };