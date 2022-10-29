const db = require("./db");

exports.Create = (tablename, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let sql = "INSERT INTO " + tablename + " (";
  sql += keys.join(",");
  sql += `) VALUES (`;
  for (let i = 1; i < values.length; i++) {
    sql += "?,";
  }
  sql += "?)";

  // console.log(sql);

  return db.execute(sql, values);
};

exports.MultipleRowCreate = (tablename, keys, values) => {
  let sql = "INSERT INTO " + tablename + " (";
  sql += keys.join(",");
  sql += `) VALUES  ? `;
  // console.log(sql);

  return db.query(sql, values);
};

exports.Select = (tablename, where = null, value = null, order = null) => {
  let sql = "SELECT * FROM " + tablename;
  if (where !== null) {
    sql += ` WHERE ${where}`;
  }
  if (order !== null) {
    sql += ` ORDER BY ${order}`;
  }

  // console.log(sql);
  return db.execute(sql, value);
};

exports.SelectAnd = (tablename, where = null, value = null, order = null) => {
  let sql = "SELECT * FROM " + tablename;
  if (where !== null) {
    sql += ` WHERE ${where}`;
  }
  if (order !== null) {
    sql += ` ORDER BY ${order}`;
  }

  // console.log(sql);
  return db.execute(sql, value);
};

exports.Update = (tablename, data, id, value) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let sql = `UPDATE ${tablename} SET `;
  sql += keys.join("=?,");
  sql += `=? WHERE ${id} `;

  const margeValue = values.concat(value);
  return db.execute(sql, margeValue);
  // console.log(sql);
  // return true;
};

exports.UpdateAll = (tablename, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let sql = `UPDATE ${tablename} SET `;
  sql += keys.join("=?,");
  sql += `=? `;

  // const margeValue = values;
  return db.execute(sql, values);
  // console.log(sql);
  // return true;
};

exports.Delete = (tablename, id, value) => {
  let sql = `DELETE FROM ${tablename} `;
  sql += ` WHERE ${id}=?`;
  // console.log(sql);
  return db.execute(sql, value);
  // return true;
};

exports.Count = (tablename, where = null, value = null) => {
  let sql = `SELECT COUNT(*) AS count FROM ${tablename}`;

  if (where !== null && value !== null) {
    sql += ` WHERE ${where}`;
    return db.execute(sql, value);
  }

  return db.execute(sql);
};
