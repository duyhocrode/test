const axios = require("axios");
const API_URL = "https://fapi.binance.com/fapi/v1/klines?symbol=BNBBUSD&interval=5m&limit=100";

// Import the technicalindicators library
const technicalindicators = require('technicalindicators');

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
        console.log(rsiValues)
        // Return the RSI value
        return rsiValues;
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}

setInterval(() => calculateRsi('BNBBUSD', '5m', 27, 14), 1000);


