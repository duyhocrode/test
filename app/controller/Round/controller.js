const Round = require("../../models/round-model.js");
const lib = require("../../helper/lib.js");
const {ethers, utils} = require("ethers");
const abi = require("../../../abi.json");
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

contract.on("EndRound", async (epoch, roundId, price) => {
    // Get the round data from the library
    let roundData = await lib.getRoundData(epoch);

    // Create a new Round object using the round data
    let round = new Round({
        epoch: roundData.round,
        start: unixToTime(roundData.start),
        close: unixToTime(roundData.close),
        lockPrice: roundData.lockPrice,
        closePrice: roundData.closePrice,
        bullAmount: roundData.bullAmount,
        bearAmount: roundData.bearAmount,
        bullPayout: roundData.bullPayout,
        bearPayout: roundData.bearPayout,
        winner: roundData.winner == "bull" ? true : false
    });

    // Save the round data using the provided create function
    Round.create(round, (err, result) => {
        if (err) {
            console.log("Controller: create err")
        } else {
            console.log(`Close Round ${epoch} winner ${result.winner}`);

            // Do something with the result of the create function
            let message = `Round ${epoch} has been saved to the database. The winner was: ${result.winner ? 'bull' : 'bear'}`;
            console.log(message);
        }
    });

    if (round.bearPayout < 1.5) {
        let busdPerOrder = 5
        let leverage = 20
        order.simulateShortOrder(busdPerOrder, leverage )
    }

    if (round.bullPayout < 1.5) {
        let busdPerOrder = 5
        let leverage = 20
        order.simulateLongOrder(busdPerOrder, leverage )
    }
});



// Watch new round
contract.on("LockRound", async (epoch, roundId, price) => {
    console.log("LockRound ", epoch + " " + roundId + " " + price)
})



