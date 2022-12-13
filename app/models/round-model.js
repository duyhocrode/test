const sql = require("./db.js");

// uint256 epoch;
// uint256 start Timestamp;
// uint256 lock Timestamp;
// uint256 close Timestamp;
// int256 lockPrice;
// int256 closePrice;
// uint256 lockOracleId;
// uint256 closeOracleId;
// uint256 totalAmount;
// uint256 bullAmount;
// uint256 bearAmount;
// uint256 rewardBaseCalAmount;
// uint256 rewardAmount;
// bool oracleCalled;

// constructor
const Round = function(tutorial) {
    this.epoch = tutorial.epoch;
    this.start = tutorial.start;
    this.close = tutorial.close;
    this.lockPrice = tutorial.lockPrice;
    this.closePrice = tutorial.closePrice;
    this.totalAmount = tutorial.totalAmount;
    this.bullAmount = tutorial.bullAmount;
    this.bearAmount = tutorial.bearAmount;
    this.winner = tutorial.winner
};

Round.create = (newRound, result) => {
    sql.query("INSERT INTO Round SET ?", newRound, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created tutorial: ", { id: res.insertId, ...newRound });
        result(null, { id: res.insertId, ...newRound });
    });
};


Round.getAllWinner = result => {
    sql.query("SELECT * FROM tutorials WHERE winner = true", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tutorials: ", res);
        result(null, res);
    });
};


Round.findById = (id, result) => {
    sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found tutorial: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Round with the id
        result({ kind: "not_found" }, null);
    });
};

Round.getAll = (title, result) => {
    let query = "SELECT * FROM tutorials";

    if (title) {
        query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tutorials: ", res);
        result(null, res);
    });
};


Round.updateById = (id, tutorial, result) => {
    sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
        [tutorial.title, tutorial.description, tutorial.published, id],
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

            console.log("updated tutorial: ", { id: id, ...tutorial });
            result(null, { id: id, ...tutorial });
        }
    );
};

Round.remove = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
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

        console.log("deleted tutorial with id: ", id);
        result(null, res);
    });
};

Round.removeAll = result => {
    sql.query("DELETE FROM tutorials", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} tutorials`);
        result(null, res);
    });
};

module.exports = Round;