const sql = require("./db.js");

// constructor
const Round = function(tutorial) {
    this.roundId = tutorial.roundId
    this.start = tutorial.start;
    this.close = tutorial.close;
    this.lockPrice = tutorial.lockPrice;
    this.closePrice = tutorial.closePrice;
    this.bullAmount = tutorial.bullAmount;
    this.bearAmount = tutorial.bearAmount;
    this.bullPayout = tutorial.bullPayout;
    this.bearPayout= tutorial.bearPayout;
    this.rsi = tutorial.rsi;
    this.realPrice = tutorial.realPrice;
    this.realPriceClose = tutorial.realPriceClose;
    this.rsiClose = tutorial.rsiClose;
    this.winner = tutorial.winner
};

Round.create = (newRound, result) => {
    sql.query("INSERT INTO round SET ?", newRound, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created round: ", { id: res.insertId, ...newRound });
        result(null, { id: res.insertId, ...newRound });
    });
};

Round.update = (id, updatedRound, result) => {
    sql.query("UPDATE round SET close = ?, closePrice = ?, rsiClose = ?, realPriceClose = ?, winner = ? WHERE roundid = ?",
        [updatedRound.close, updatedRound.closePrice, updatedRound.rsiClose, updatedRound.realPriceClose, updatedRound.winner, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found round with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated round: ", { id: id, ...updatedRound });
            result(null, { id: id, ...updatedRound});
        });
};


Round.getAll = result => {
    sql.query("SELECT * FROM round", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Round.paginate = (page, size, sort, result) => {
    let limit = size;
    let offset = (page - 1) * size;

    sql.query(
        `SELECT * FROM round ORDER BY ${sort} LIMIT ${limit} OFFSET ${offset}`,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log("rounds: ", res);
            result(null, res);
        }
    );
};

Round.delete = (id, result) => {
    sql.query("DELETE FROM round WHERE roundid = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Round with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted round with id: ", id);
        result(null, res);
    });
};





module.exports = Round;