const sql = require("./db.js");

// constructor
const Order = function(order) {
    this.assetToSell = order.assetToSell;
    this.currentMarketPrice = order.currentMarketPrice;
    this.stopLossPrice = order.stopLossPrice;
    this.takeProfitPrice = order.takeProfitPrice;
    this.status = order.status;
    this.start = order.start;
    this.close = order.close
};

Order.create = (order, result) => {
    sql.query("INSERT INTO Round SET ?", order, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created order: ", { id: res.insertId, ...order });
        result(null, { id: res.insertId, ...order });
    });
};


module.exports = Order;