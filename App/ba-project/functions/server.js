const express = require('express')
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const cors = require('cors');
const port = process.env.PORT || 8080
const app = express()
const keys = require('../config/keys')

app.use(bodyParser.json());
app.use(cors());


app.listen(port)

console.log(`Server listening at PORT: ${port} ...`)

if (keys.mongoURI) {
  console.log('Trying to connect to mongodb');
  try {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line no-unused-vars
    const db =  require('../config/database.js')();
  } catch (error) {
    console.log("mongo connect error", error);
    console.log('MONGO CONNECTION ERROR');
  }
} else {
  console.log('NO MONGO URI SPECIFIED!');
}

app.get('/', (req, res) => {
  res.send('Hello from Usus Backend. To view the API Documentation go to <a href="https://usus-ba-leander.herokuapp.com/docs" target="_blank">https://usus-ba-leander.herokuapp.com/docs</a>.')
});

// Routes for Users
require('../app/routes/user.routes.js')(app);
// Routes for Projects
require('../app/routes/project.routes.js')(app);

// app.use('/.netlify/functions/server', router);  // path must route to lambda
module.exports.handler = serverless(app);

