const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080
const app = express()
const keys = require('./config/keys')

app.use(bodyParser.json());
app.use(cors());

// app.use(express.static(__dirname + '/dist/'))
// app.get(/.*/, function (req, res) {
//   res.sendFile(__dirname + '/dist/index.html')
// })

app.listen(port)

console.log('Server started...')

if (keys.mongoURI) {
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

// Routes for Projects
require('./app/routes/project.routes.js')(app);
