const db = require('../database/db');

const table = 'users';

const fields = [
  'id',
  'email',
  'password',
  'first_name',
  'last_name',
  'status',
  'created_at',
  'updated_at'
];

const User = function(data) {
  if (data) {
    for (let field of fields) {
      if (data.hasOwnProperty(field)) {
        this[field] = data[field];
      }
    }
  }
};

// User.prototype.save = function() {
//   console.log(this, 'add');
// };

User.getTable = () => {
  return table;
};

User.STATUS_ACTIVE = 1;
User.STATUS_INACTIVE = 0;

User.create = (userData) => {
  return new Promise((resolve, reject) => {
    const user = new User(userData);
    user.status = User.STATUS_ACTIVE;
    db.query("INSERT INTO `" + table + "` SET ?", user, (error, results) => {
      if (error) {
        reject(error);
      } else {
        delete user.status;
        delete user.password;
        user.id = results.insertId;
        resolve(user);
      }
    });
  });
};

User.exists = (column, value) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT EXISTS(SELECT * FROM `" + table + "` WHERE ?? = ?) AS `exists`", [column, value], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].exists);
      }
    });
  });
};

User.findOneBy = (column, value) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM `" + table + "` WHERE ?? = ? LIMIT 1", [column, value], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const user = results.length ? new User(results[0]) : null;
        resolve(user);
      }
    });
  });
};

module.exports = User;