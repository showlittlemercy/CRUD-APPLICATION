const Record = require("../models/record.model.js");

// Create and Save a new Record
exports.create = (req, res) => {
  if (!req.body || !req.body.name || !req.body.email || !req.body.age) {
    return res.status(400).send({
      message: "Bad Request: name, email and age fields are required!"
    });
  }

  const record = new Record({
    name  : req.body.name,
    email : req.body.email,
    age   : req.body.age
  });

  Record.create(record, (err, data) => {
    if (err) {
      console.error("Error in Record.create:", err);
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the record."
      });
    } else {
      return res.status(201).json({
        id    : data.id,
        name  : data.name,
        email : data.email,
        age   : data.age
      });
    }
  });
};

// Retrieve all Records from the database.
exports.findAll = (req, res) => {
  Record.getAll((err, data) => {
    if (err) {
      console.error("Error in Record.getAll:", err);
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving records."
      });
    } else {
      return res.json(data);
    }
  });
};

// Find a single Record with an id
exports.findOne = (req, res) => {
  Record.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found record with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Error retrieving record with id " + req.params.id
        });
      }
    } else {
      return res.json(data);
    }
  });
};

// Update a Record identified by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Record.updateById(
    req.params.id,
    new Record(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found record with id ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Error updating record with id " + req.params.id
          });
        }
      } else {
        return res.json(data);
      }
    }
  );
};

// Delete a Record with the specified id in the request
exports.delete = (req, res) => {
  Record.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found record with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Could not delete record with id " + req.params.id
        });
      }
    } else {
      return res.json({ message: `Record was deleted successfully!` });
    }
  });
};
