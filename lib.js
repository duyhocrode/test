const Big = require("big.js");
const {utils, ethers} = require("ethers");
const abi = require("./abi.json")
require("dotenv").config();

urlRPC = process.env.BSC_RPC
contractAddress = process.env.PCS_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(urlRPC)
//contract
const contract = new ethers.Contract(contractAddress, JSON.parse(abi), provider)

const GetLockRound = async () => {
    await contract.on("LockRound", (epoch, roundId, price) => {
        let info = {
            epoch: epoch,
            roundId: roundId,
            price: price
        }
        return info
    })
}

const GetEndRound = async () => {
   await contract.on("EndRound", (epoch, roundId, price) => {
       let info = {
            epoch: epoch,
            roundId: roundId,
            price: price
        }
        return info
    })
}

const GetRoundData = async (round) => {
    try {
        const data = await contract.rounds(round);
        const closePrice = data.closePrice;
        const lockPrice = data.lockPrice;
        const bullAmount = data.bullAmount;
        const bearAmount = data.bearAmount;
        const totalAmount = new Big(data.totalAmount);
        const bullPayout = totalAmount.div(bullAmount).round(3).toString();
        const bearPayout = totalAmount.div(bearAmount).round(3).toString();

        const parsedRound = [
            {
                round: round.toString(),
                openPrice: utils.formatUnits(data.lockPrice, "8"),
                closePrice: utils.formatUnits(data.closePrice, "8"),
                bullAmount: utils.formatUnits(data.bullAmount, "18"),
                bearAmount: utils.formatUnits(data.bearAmount, "18"),
                bullPayout: bullPayout,
                bearPayout: bearPayout,
                winner: closePrice.gt(lockPrice) ? "bull" : "bear",
            },
        ];
        return parsedRound;
    } catch (e) {
        console.log(e);
        return null;
    }
};

