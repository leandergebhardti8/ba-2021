import axios from "axios";
// import project from '../../config/models/project';
// import vm from 'v-response';

export default {
    async getProjects() {
        let res = await axios.get("http://localhost:8080/projects");
        return res.data;
    },
    
    async getProjectSingle(projectId) {
        let res = await axios.get("http://localhost:8080/project/" + projectId);
        return res.data;
    }
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