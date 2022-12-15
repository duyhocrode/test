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
    sql.query("INSERT INTO Round SET ?", newRound, (err, res) => {

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
    sql.query("UPDATE Round SET close = ?, closePrice = ?, rsiClose = ?, realPriceClose = ?, winner = ? WHERE roundid = ?",
        [updatedRound.close, updatedRound.closePrice, updatedRound.rsiClose, updatedRound.realPriceClose, updatedRound.winner, id],
        (err, res) => {
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

            console.log("updated round: ", { id: id, ...updatedRound });
            result(null, { id: id, ...updatedRound});
        });
};


module.exports = Round;