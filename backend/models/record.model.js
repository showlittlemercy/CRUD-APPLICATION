// models/record.model.js
const db = require('../config/db.config.js');

const Record = function(record) {
  this.name  = record.name;
  this.email = record.email;
  this.age   = record.age;
};

Record.create = async (newRecord, result) => {
  try {
    const [res] = await db.query("INSERT INTO records SET ?", newRecord);
    result(null, { id: res.insertId, ...newRecord });
  } catch (err) {
    console.error("Error in Record.create:", err.stack || err);
    result(err, null);
  }
};

Record.getAll = async (result) => {
  try {
    const [rows] = await db.query("SELECT * FROM records");
    result(null, rows);
  } catch (err) {
    console.error("Error in Record.getAll:", err.stack || err);
    result(err, null);
  }
};

Record.findById = async (id, result) => {
  try {
    const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
    if (rows.length) {
      result(null, rows[0]);
    } else {
      result({ kind: "not_found" }, null);
    }
  } catch (err) {
    console.error("Error in Record.findById:", err.stack || err);
    result(err, null);
  }
};

Record.updateById = async (id, record, result) => {
  try {
    const [res] = await db.query(
      "UPDATE records SET name = ?, email = ?, age = ? WHERE id = ?",
      [record.name, record.email, record.age, id]
    );
    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id, ...record });
  } catch (err) {
    console.error("Error in Record.updateById:", err.stack || err);
    result(err, null);
  }
};

Record.remove = async (id, result) => {
  try {
    const [res] = await db.query("DELETE FROM records WHERE id = ?", [id]);
    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  } catch (err) {
    console.error("Error in Record.remove:", err.stack || err);
    result(err, null);
  }
};

module.exports = Record;
