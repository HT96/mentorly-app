const express = require('express');
const config = require('config');
const authMiddleware = require('./middleware/auth.middleware');
const db = require('./database/db');

const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// connect auth routes
app.use('/api/v1/auth', require('./routes/auth.routes'));

app.use('/api/v1/test', authMiddleware, function(req, res) {
  return res.status(200)
    .json({
      msg: 'Authenticated'
    });
});

// connect to db
db.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("Successfully connected to the database");
  // run server
  const PORT = config.get('PORT') || 8080;
  app.listen(PORT, () => {
    console.log('App has been started on port: ' + PORT);
  });
});