const Round = require("../models/round.model.js");

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

    Round.paginate(page, size, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving rounds."
            });
        } else {
            res.send(data);
        }
    });
};
