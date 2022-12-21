const technicalindicators = require("technicalindicators");
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
            values: closingPrices,
            period: rsiPeriod
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


function calculatePivotValues(highPrices, lowPrices, closingPrices, pivotLookbackRight, pivotLookbackLeft) {
    const pivotValues = [];
    for (let i = pivotLookbackLeft; i < closingPrices.length - pivotLookbackRight; i++) {
        const high = Math.max(...highPrices.slice(i - pivotLookbackLeft, i + pivotLookbackRight + 1));
        const low = Math.min(...lowPrices.slice(i - pivotLookbackLeft, i + pivotLookbackRight + 1));
        const close = closingPrices[i];
        const pivot = (high + low + close) / 3;
        pivotValues.push(pivot);
    }
    return pivotValues;
}



async function calculateDivergenceIndicator(symbol, interval, limit, rsiPeriod, pivotLookbackRight, pivotLookbackLeft, minLookbackRange, maxLookbackRange) {
    // Construct the API endpoint URL
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    try {
        // Make a GET request to the API endpoint using axios
        const response = await axios.get(url);

        // Parse the response body to extract the closing prices and high/low values
        const data = response.data;
        const closingPrices = data.map(datapoint => datapoint[4]);
        const highPrices = data.map(datapoint => datapoint[2]);
        const lowPrices = data.map(datapoint => datapoint[3]);

        // Calculate the RSI values using technicalindicators
        const rsi = new technicalindicators.RSI({
            values: closingPrices,
            period: rsiPeriod
        });
        const rsiValues = rsi.getResult();

        const pivotValues = calculatePivotValues(highPrices, lowPrices, closingPrices, pivotLookbackRight, pivotLookbackLeft);

        // Initialize variables to track divergence
        let divergenceExists = false;
        let divergenceType = '';

        // Loop through the RSI and pivot values to check for divergence
        for (let i = 0; i < rsiValues.length; i++) {
            // Check that the lookback range is within the specified limits
            const lookbackRange = i + 1;
            if (lookbackRange < minLookbackRange || lookbackRange > maxLookbackRange) {
                continue;
            }

            const currentRsi = rsiValues[i];
            const previousRsi = rsiValues[i - 1];
            const currentPivot = pivotValues[i];
            const previousPivot = pivotValues[i - 1];
            if (currentRsi < previousRsi) {
                // Bullish divergence
                if (currentPivot > previousPivot) {
                    divergenceExists = true;
                    divergenceType = 'bullish';
                    break;
                }
            } else if (currentRsi > previousRsi) {
                // Bearish divergence
                if (currentPivot < previousPivot) {
                    divergenceExists = true;
                    divergenceType = 'bearish';
                    break;
                }
            }
        }

        // Return the results
        return {
            exists: divergenceExists,
            type: divergenceType
        };
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}


module.exports = {
    calculateRsi,
    calculateDivergenceIndicator,
};