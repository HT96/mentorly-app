const express = require('express');
const config = require('config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const fieldRoutes = require('./routes/field.routes');
const authMiddleware = require('./middleware/auth.middleware');
const db = require('./database/db');

const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// connect auth routes
app.use('/api/v1/auth', authRoutes);
// connect user routes
app.use('/api/v1/users', authMiddleware, userRoutes);
// connect field routes
app.use('/api/v1/fields', authMiddleware, fieldRoutes);

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