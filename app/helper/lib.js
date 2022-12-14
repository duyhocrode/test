const Big = require("big.js");
const {utils, ethers} = require("ethers");
require("dotenv").config();
const abi = require("../../abi.json");
urlRPC = process.env.BSC_RPC
contractAddress = process.env.PCS_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(urlRPC)
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