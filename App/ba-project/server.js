const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080
const app = express()
const keys = require('./config/keys')

app.use(bodyParser.json());
app.use(cors());

// Mongoose Models
// const user = require('./config/models/user');
// const project = require('./config/models/project');

app.use(express.static(__dirname + '/dist/'))
app.get(/.*/, function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

app.get('/', (req, res) => {
  res.send(`Hi! Server is listening on port ${port}`);
})

app.listen(port)

console.log('Server started...')

if (keys.mongoURI) {
  // create a custom db access method
  console.log('Trying to connect to mongodb');
  try {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line no-unused-vars
    const db =  require('./config/database.js')();
  } catch (error) {
    console.log("mongo connect error", error);
    console.log('MONGO CONNECTION ERROR');
  }
} else {
  console.log('NO MONGO URI SPECIFIED!');
}

let projects = [
  { 
  name: 'BA - Projekt', 
  id: '1', 
  githubURL: 'https://github.com/leandergebhardti8/ba-2021.git', 
  repoOwner: 'leandergebhardti8', 
  repoName: 'ba-2021', 
  githubToken: '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', 
  deployMethods: [
    {
      name: 'Heroku',
      environments: [
        {
          name: 'Heroku', 
          action: 'run-deploy', 
          id: '1', 
          url: 'https://ba-2021.herokuapp.com/', 
          builds: ["07.03.2021 11:12:40"]
        }, 
        {
          name: 'Dev', 
          action: 'Dev Deploy', 
          id: '2'
        }
      ],
    }
  ], 
  },
  { 
    name: 'ExampleName', 
    id: '2', 
    githubURL: 'test.test.test.git',
    epoOwner: '', 
    repoName: '', 
    githubToken: '', 
    deployMethods: [
      {
        name: 'S3',
        environments: [],
      }
    ] 
  },
]

app.get('/projects', (req, res) => {
  res.send(projects);
})


// app.post('/api/projects/create', async (req, res) => {
//   projects = req.body
//   console.log(projects)

//   const response = await project.create(project)
//   console.log(response)
// })