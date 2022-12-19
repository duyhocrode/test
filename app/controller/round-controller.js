const Round = require("../models/round-model");

exports.findAll = (req, res) => {
    Round.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving rounds."
            });
        } else {
            res.send(data);
        }
    });
};


exports.paginate = (req, res) => {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const sort = req.query.sort || 'start desc';

    Round.paginate(page, size, sort, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving rounds."
            });
        } else {
            res.send(data);
        }
    });
};



exports.delete = (req, res) => {
    Round.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Round with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Round with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `Round was deleted successfully!` });
        }
    });
};
