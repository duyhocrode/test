const Round = require("../models/round-model.js");
const lib = require("./lib.js");
const {ethers, utils} = require("ethers");
const abi = require("../../abi.json");
require("dotenv").config();


urlRPC = process.env.BSC_RPC
contractAddress = process.env.PCS_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(urlRPC)
//contract
const contract = new ethers.Contract(contractAddress, JSON.parse(abi), provider)

// Create and Save a new Round
// Validate request
// Create a Round
// Save Round in the database

const unixToTime = (unix_timestamp) => {
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let time = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    return time
}

// Create
contract.on("EndRound", async (epoch, roundId, price) => {
    let a = await lib.getRoundData(epoch);
    let round = new Round({
        epoch: a.round,
        start: unixToTime(a.start),
        close: unixToTime(a.close),
        openPrice: a.openPrice,
        closePrice: a.closePrice,
        bullAmount: a.bullAmount,
        bearAmount: a.bearAmount,
        bullPayout: a.bullPayout,
        bearPayout: a.bearPayout,
        winner: a.winner = "bull" ? true : false
    });

    Round.create(round, (err, result) => {
        if (err)
            console.log("Controller: create err")
        else console.log("Close Round " + epoch + " winner" + result.winner)
    })
})

// Watch new round
contract.on("LockRound", async (epoch, roundId, price) => {
    console.log("LockRound ", epoch + " " + roundId + " " + price)
})
