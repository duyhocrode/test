const Big = require("big.js");
const {utils, ethers} = require("ethers");
require("dotenv").config();
const abi = require("../../abi.json");

urlRPC = process.env.BSC_RPC
contractAddress = process.env.PCS_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(urlRPC)

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

const contract = new ethers.Contract(contractAddress, JSON.parse(abi), provider)

const getRoundData = async (round) => {
    try {
        // Get the data for the specified round
        const data = await contract.functions.rounds(round);

        // Extract the necessary values from the data
        const closePrice = data.closePrice;
        const lockPrice = data.lockPrice;
        const bullAmount = data.bullAmount;
        const bearAmount = data.bearAmount;
        const totalAmount = new Big(data.totalAmount);
        const bullPayout = totalAmount.div(bullAmount).round(3).toString();
        const bearPayout = totalAmount.div(bearAmount).round(3).toString();
        const start = data.lockTimestamp;
        const close = data.closeTimestamp;

        // Return the parsed round data as an object
        return {
            round: round.toString(),
            start: start.toString(),
            close: close.toString(),
            lockPrice: utils.formatUnits(data.lockPrice, "8"),
            closePrice: utils.formatUnits(data.closePrice, "8"),
            bullAmount: utils.formatUnits(data.bullAmount, "18"),
            bearAmount: utils.formatUnits(data.bearAmount, "18"),
            bullPayout: bullPayout,
            bearPayout: bearPayout,
            winner: closePrice.gt(lockPrice) ? "bull" : "bear",
        };
    } catch (e) {
        console.log(e);
        return null;
    }
};


module.exports = {
    getRoundData,
    contract
};