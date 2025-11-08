// backend/controllers/record.controller.js

const Record = require("../models/record.model.js");

// Create and Save a new Record
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const record = new Record({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    Record.create(record, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the record."
            });
        } else {
            // send back the inserted record information
            res.status(201).json({
                id: data.id,
                name: data.name,
                email: data.email,
                age: data.age
            });
        }
    });
};

// Retrieve all Records from the database.
exports.findAll = (req, res) => {
    Record.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving records."
            });
        } else {
            res.send(data);
        }
    });
};

// Find a single Record with an id
exports.findOne = (req, res) => {
    Record.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found record with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving record with id " + req.params.id
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Update a Record identified by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Record.updateById(
        req.params.id,
        new Record(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found record with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating record with id " + req.params.id
                    });
                }
            } else {
                res.send(data);
            }
        }
    );
};

// Delete a Record with the specified id in the request
exports.delete = (req, res) => {
    Record.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found record with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete record with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `Record was deleted successfully!` });
        }
    });
};
