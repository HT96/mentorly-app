const db = require('../database/db');

const table = 'professional_fields';

const fields = [
  'id',
  'title',
  'status',
  'created_at',
  'updated_at'
];

const Field = function(data) {
  if (data) {
    this.setFields(data);
  }
};

Field.prototype.setFields = function(data) {
  for (let field of fields) {
    if (data.hasOwnProperty(field)) {
      this[field] = data[field];
    }
  }
};

Field.getTable = () => {
  return table;
};

Field.STATUS_ACTIVE = 1;
Field.STATUS_INACTIVE = 0;

Field.create = function(title) {
  return new Promise((resolve, reject) => {
    const field = new Field({
      title: title,
      status: Field.STATUS_ACTIVE
    });
    db.query("INSERT INTO " + db.escapeId(table) + " SET ?", field, (error, results) => {
      if (error) {
        reject(error);
      } else {
        field.id = results.insertId;
        resolve(field);
      }
    });
  });
};

Field.exists = (title) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT EXISTS(SELECT * FROM " + db.escapeId(table) + " WHERE `title` = ?) AS `exists`", [title], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].exists);
      }
    });
  });
};

Field.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM " + db.escapeId(table) + " WHERE `id` = ? LIMIT 1", [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const field = results.length ? new Field(results[0]) : null;
        resolve(field);
      }
    });
  });
};

Field.findByQuery = (query) => {
  let sql = "SELECT `fields`.* " +
    "FROM " + db.escapeId(table) + " AS `fields`";
  let where = " WHERE `fields`.`status` = " + db.escape(Field.STATUS_ACTIVE);
  if (query.search) {
    where += " AND (`fields`.`title` LIKE " + db.escape(`%${query.search}%`) + ")";
  }
  if (query.user_id) {
    sql += " INNER JOIN `user_field_relation` AS `relation` ON `fields`.`id` = `relation`.`field_id`";
    where += " AND `relation`.`user_id` = " + db.escape(query.user_id);
  }
  sql += where;
  sql += " GROUP BY `fields`.`id`";
  if (query.order && query.order.column && fields.includes(query.order.column)) {
    sql += " ORDER BY `fields`." + db.escapeId(query.order.column) + (query.order.dir && query.order.dir.toUpperCase() === 'DESC' ? " DESC" : " ASC");
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

module.exports = Field;