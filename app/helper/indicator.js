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

//right

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


async function getHistoricalData(symbol, interval, limit) {
    // Construct the API endpoint URL
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    try {
        // Make a GET request to the API endpoint using axios
        const response = await axios.get(url);
        // Return the data
        return response.data;
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}


function parseData(data) {
    // Parse the data to extract the closing prices, high/low values, and pivot values
    const closingPrices = data.map(datapoint => datapoint[4]);
    const highPrices = data.map(datapoint => datapoint[2]);
    const lowPrices = data.map(datapoint => datapoint[3]);
    const pivotValues = calculatePivotValues(highPrices, lowPrices, closingPrices, pivotLookbackRight, pivotLookbackLeft);
    return { closingPrices, highPrices, lowPrices, pivotValues };
}


function calculateRsiLib(closingPrices, rsiPeriod) {
    // Calculate the RSI values using technicalindicators
    const rsi = new technicalindicators.RSI({
        values: closingPrices,
        period: rsiPeriod
    });
    return rsi.getResult();
}



function checkForDivergence(rsiValues, pivotValues, minLookbackRange, maxLookbackRange) {
    let divergenceExists = false;
    let divergenceType = '';
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
        if (currentRsi < previousRsi && currentPivot > previousPivot) {
            // Bullish divergence
            divergenceExists = true;
            divergenceType = 'bullish';
            break;
        } else if (currentRsi > previousRsi && currentPivot < previousPivot) {
            // Bearish divergence
            divergenceExists = true;
            divergenceType = 'bearish';
            break;
        }
    }
    return {
        exists: divergenceExists,
        type: divergenceType,
    };
}

async function detectDivergence(symbol, interval, limit, rsiPeriod, pivotLookbackRight, pivotLookbackLeft, minLookbackRange, maxLookbackRange) {
    // Get the historical data for the symbol
    const data = await getHistoricalData(symbol, interval, limit);
    // Parse the data to extract the closing prices, high/low values, and pivot values
    const { closingPrices, highPrices, lowPrices, pivotValues } = parseData(data);
    // Calculate the RSI values
    const rsiValues = calculateRsiLib(closingPrices, rsiPeriod);
    // Check for divergence between the RSI and pivot values
    const { exists, type } = checkForDivergence(rsiValues, pivotValues, minLookbackRange, maxLookbackRange);
    if (exists) {
        console.log(`Divergence detected! Type: ${type}`);
    } else {
        console.log('No divergence detected');
    }
}


module.exports = {
    calculateRsi,
    checkForDivergence,
    calculatePivotValues,
    detectDivergence,
    calculateRsiLib,
};


