//short
const Order = require("../../models/order.model.js")
const getPrice = require("../../helper/price.js")

function simulateShortOrder(busdPerOrder, leverage) {
    // Create date instance
    let currentTime = new Date();

    // Calculate the total value of the order
    let totalOrderValue = busdPerOrder * leverage;
    const currentMarketPrice = getPrice('BNBBUSD');

    if (currentMarketPrice > limitPrice) {
        // Calculate the number of units of the asset to sell
        let assetToSell = totalOrderValue / currentMarketPrice;
        let stopLostPrice = currentMarketPrice + (1 / 100);
        let takeProfitPrice = currentMarketPrice - (0.5 / 100);
        // Create order object
        const order = new Order(
            this.assetToSell = assetToSell,
            this.currentMarketPrice = currentMarketPrice,
            this.stopLossPrice = stopLostPrice,
            this.takeProfitPrice = takeProfitPrice,
            this.status = false,
            this.start = currentTime.getFullYear() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getDate() + " " + currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds(),
        )
        // Submit the order to mysql
        Order.create(order);
    }
}





