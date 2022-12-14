const axios = require("axios");
const API_URL = "https://fapi.binance.com/fapi/v1/klines?symbol=BNBBUSD&interval=5m&limit=100";

// Calculate the RSI for the given array of closing prices
function calculateRsi(data, period) {
    // Initialize variables for the calculation
    let sumGains = 0;
    let sumLosses = 0;
    let previousClose;
    // Loop through the data to calculate the sum of gains and losses
    for (let i = 0; i < data.length; i++) {
        // Get the current close price and the previous close price
        const currentClose = data[i][4];
        if (previousClose) {
            // Calculate the difference between the current and previous close prices
            const change = currentClose - previousClose;

            // Update the sum of gains or losses based on the change
            if (change > 0) {
                sumGains += change;
            } else {
                sumLosses -= change;
            }
        }

        // Set the previous close price for the next iteration
        previousClose = currentClose;
    }

    // Calculate the average gain and loss over the specified period
    const averageGain = sumGains / period;
    const averageLoss = sumLosses / period;

    // Calculate the relative strength
    const relativeStrength = averageGain / averageLoss;

    // Calculate and return the RSI
    return 100 - (100 / (1 + relativeStrength));
}


function getDataAndCalculateRsi() {
    // Use axios to request data from the API
    axios.get(API_URL, {
        params: {
            symbol: 'BNBBUSD',
            interval: '5m',
            limit: 100
        }
    })
        .then(response => {
            // Extract the necessary data from the response
            const data = response.data;

            // Calculate RSI with a period of 14
            const rsi = calculateRsi(data, 14);

            // Do something with the calculated RSI value
            console.log(rsi);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

// Call the getDataAndCalculateRsi function every 5 seconds
setInterval(getDataAndCalculateRsi, 5000);
