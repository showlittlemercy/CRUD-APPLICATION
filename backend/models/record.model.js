const sql = require('../config/db.config.js');

const Record = function (record) {
    this.name = record.name;
    this.email = record.email;
    this.age = record.age;
};

Record.create = (newRecord, result) => {
    sql.query("INSERT INTO records SET ?", newRecord, (err, res) => {
        if (err) {
            console.error("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newRecord });
    });
};

Record.getAll = result => {
    sql.query("SELECT * FROM records", (err, res) => {
        if (err) {
            console.error("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Record.findById = (id, result) => {
    sql.query(`SELECT * FROM records WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.error("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Record.updateById = (id, record, result) => {
    sql.query(
        "UPDATE records SET name = ?, email = ?, age = ? WHERE id = ?",
        [record.name, record.email, record.age, id],
        (err, res) => {
            if (err) {
                console.error("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { id: id, ...record });
        }
    );
};

Record.remove = (id, result) => {
    sql.query("DELETE FROM records WHERE id = ?", id, (err, res) => {
        if (err) {
            console.error("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Record;
