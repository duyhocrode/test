const Round = require("../../models/round-model.js");
const lib = require("../../helper/lib.js");
const calculateRsi = require("../../helper/price.js");
require("dotenv").config();
// Create and Save a new round
// Validate request
// Create a round
// Save round in the database

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

lib.contract.on("EndRound", onEndRound);

async function onEndRound(epoch, roundId, price) {
    // Get the round data from the library
    let roundData = await lib.getRoundData(epoch);
    let rsi = await calculateRsi("BNBBUSD", "5m", 30, 14)

    // Create a new round object using the round data
    let round = new Round({
        close: unixToTime(roundData.close),
        closePrice: roundData.closePrice,
        rsiClose: rsi.rsiValue[rsi.rsiValue.length - 1],
        realPriceClose: rsi.closePrice,
        winner: roundData.winner
    });

    // Save the round data using the provided update function
    Round.update(roundData.round, round, (err, result) => {
        if (err) {
            console.log("Controller: update err")
        } else {
            console.log(`Close Round ${roundData.round} winner ${result.winner}`);

            // Do something with the result of the update function
            let message = `Round ${roundData.round} has been updated to the database. The winner was: ${result.winner ? 'bull' : 'bear'}`;
            console.log(message);
        }
    });
}


// Watch new round
lib.contract.on("LockRound", async (epoch, roundId, price) => {
    let roundData = await lib.getRoundData(epoch);
    let rsi = await calculateRsi("BNBBUSD", "5m", 30, 14)

    // Create a new round object using the round data
    let round = new Round({
        roundId: roundData.round,
        start: unixToTime(roundData.start),
        lockPrice: roundData.lockPrice,
        bullAmount: roundData.bullAmount,
        bearAmount: roundData.bearAmount,
        bullPayout: roundData.bullPayout,
        bearPayout: roundData.bearPayout,
        rsi: rsi.rsiValue[rsi.rsiValue.length - 1],
        realPrice: rsi.closePrice,
    });

    // Save the round data using the provided create function
    Round.create(round, (err, result) => {
        if (err) {
            console.log("Controller: create err")
        } else {
            // Do something with the result of the create function
            let message = `Round ${roundData.round} has been saved to the database. Waiting to result`;
            console.log(message);
        }
    });

    await  onEndRound
})




//
// mysql --host=localhost --user=myname --password=password mydb
// mysql -h localhost -u myname -ppassword mydb