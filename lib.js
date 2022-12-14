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


