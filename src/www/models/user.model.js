const db = require('../database/db');

const table = 'users';

const fields = [
  'id',
  'email',
  'password',
  'first_name',
  'last_name',
  'is_mentor',
  'position',
  'plans',
  'education',
  'experience',
  'about',
  'status',
  'created_at',
  'updated_at'
];

const User = function(data) {
  if (data) {
    this.setFields(data);
  }
};

User.prototype.setFields = function(data) {
  for (let field of fields) {
    if (data.hasOwnProperty(field)) {
      this[field] = data[field];
    }
  }
};

User.prototype.deleteHiddenFields = function() {
  delete this.status;
  delete this.password;
};

User.prototype.deleteFieldsBeforeCreate = function() {
  delete this.id;
  delete this.created_at;
  delete this.updated_at;
};

User.prototype.deleteFieldsBeforeUpdate = function() {
  this.deleteFieldsBeforeCreate();
  this.deleteHiddenFields();
  delete this.email;
};

User.prototype.create = function() {
  return new Promise((resolve, reject) => {
    this.deleteFieldsBeforeCreate();
    this.is_mentor = parseInt(this.is_mentor) ? 1 : 0;
    this.status = User.STATUS_ACTIVE;
    let sql = "INSERT INTO " + db.escapeId(table) +
      " SET ?";
    db.query(sql, this, (error, results) => {
      if (error) {
        reject(error);
      } else {
        this.deleteHiddenFields();
        this.id = results.insertId;
        resolve(this);
      }
    });
  });
};

User.prototype.update = function(id) {
  return new Promise((resolve, reject) => {
    this.deleteFieldsBeforeUpdate();
    let sql = "UPDATE " + db.escapeId(table) +
      " SET ?" +
      " WHERE `id` = ? AND `status` = ?";
    db.query(sql, [this, id, User.STATUS_ACTIVE], (error, results) => {
      if (error) {
        reject(error);
      } else {
        this.id = id;
        resolve(results.affectedRows);
      }
    });
  });
};

User.prototype.delete = function(id) {
  return new Promise((resolve, reject) => {
    let sql = "UPDATE " + db.escapeId(table) +
      " SET `status` = ?" +
      " WHERE `id` = ? AND `status` = ?";
    db.query(sql, [User.STATUS_INACTIVE, id, User.STATUS_ACTIVE], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
    });
  });
};

User.prototype.attachField = function(fieldId) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT EXISTS(SELECT * FROM `user_field_relation` WHERE `user_id` = ? AND `field_id` = ?) AS `exists`";
    const values = [this.id, fieldId];
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else if (results[0].exists) {
        resolve(0);
      } else {
        sql = "INSERT INTO `user_field_relation`" +
          " SET `user_id` = ?, `field_id` = ?";
        db.query(sql, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.affectedRows);
          }
        });
      }
    });
  });
};

User.prototype.detachField = function(fieldId) {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM `user_field_relation`" +
      " WHERE `user_id` = ? AND `field_id` = ?";
    db.query(sql, [this.id, fieldId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
    });
  });
};

User.getTable = () => {
  return table;
};

User.STATUS_ACTIVE = 1;
User.STATUS_INACTIVE = 0;

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

User.findByQuery = (query) => {
  let sql = "SELECT `users`.`id`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`position`, " +
    "`users`.`is_mentor`, `users`.`created_at`, `users`.`updated_at` " +
    "FROM `users`";
  let where = " WHERE `users`.`status` = " + db.escape(User.STATUS_ACTIVE);
  if (query.search) {
    const search = db.escape(`%${query.search}%`);
    where += " AND (`users`.`email` LIKE " + search +
      " OR `users`.`first_name` LIKE " + search +
      " OR `users`.`last_name` LIKE " + search +
      " OR `users`.`position` LIKE " + search +
      " OR DATE_FORMAT(`users`.`created_at`, '%b %D %Y, %l:%i %p') LIKE " + search + ")";
  }
  if ('is_mentor' in query) {
    where += " AND `users`.`is_mentor` = " + (parseInt(query.is_mentor) ? "1" : "0");
  }
  if (query.field_id) {
    sql += " INNER JOIN `user_field_relation` AS `relation` ON `users`.`id` = `relation`.`user_id`";
    where += " AND `relation`.`field_id` = " + db.escape(query.field_id);
  }
  sql += where;
  sql += " GROUP BY `users`.`id`";
  if (query.order && query.order.column && fields.includes(query.order.column)) {
    sql += " ORDER BY `users`." + db.escapeId(query.order.column) + (query.order.dir && query.order.dir.toUpperCase() === 'DESC' ? " DESC" : " ASC");
  }
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = User;