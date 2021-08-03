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

// app.use(express.static(__dirname + '/dist/'))
// app.get(/.*/, function (req, res) {
//   res.sendFile(__dirname + '/dist/index.html')
// })

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

require('./app/routes/project.routes.js')(app);

// app.post('/api/projects/create', async (req, res) => {
//   projects = req.body
//   console.log(projects)

//   const response = await project.create(project)
//   console.log(response)
// })