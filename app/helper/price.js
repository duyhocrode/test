const technicalindicators = require('technicalindicators');
const axios = require("axios");

// Define the function that calculates the RSI value
async function calculateRsi(symbol, interval, limit, rsiPeriod) {
    // Construct the API endpoint URL
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    try {
        // Make a GET request to the API endpoint using axios
        const response = await axios.get(url);

        // Parse the response body to extract the closing prices
        const data = response.data;
        const closingPrices = data.map(datapoint => datapoint[4]);

        // Calculate the RSI value using technicalindicators
        const rsi = new technicalindicators.RSI({
            values : closingPrices,
            period : rsiPeriod
        });
        const rsiValues = rsi.getResult();
        // Return the RSI value
        return {
            rsiValue: rsiValues,
            closePrice: closingPrices[closingPrices.length - 1]
        };
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}

module.exports = calculateRsi;