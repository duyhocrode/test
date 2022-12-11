const {ethers} = require("ethers");
require("dotenv").config();
const abi = require("./abi.json");
const {GetEndRound, GetRoundData} = require("./lib");

urlRPC = process.env.BSC_RPC
contractAddress = process.env.PCS_ADDRESS
const provider = new ethers.providers.JsonRpcProvider(urlRPC)
//contract
const contract = new ethers.Contract(contractAddress, JSON.parse(abi), provider)
//abi
const GetRound = async () => {
  let info = await contract.on("EndRound", (epoch, roundId, price) => {
        let info = {
            epoch: epoch,
            roundId: roundId,
            price: price
        }
      console.log(info)
    })
}

GetRound()
