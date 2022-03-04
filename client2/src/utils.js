import Web3 from "web3"
import RentEscrow from "./contracts/rentEscrow.json"

const getWeb3 = () => {
    return new Web3("HTTP://127.0.0.1:7545")
    console.log("I am here");
}

const getRentContract = async web3 => {
    const networkId = await web3.eth.net.getId();

    const contractDeployment = RentEscrow.networks[networkId]
    return new web3.eth.Contract(
        RentEscrow.abi, contractDeployment && contractDeployment.address
    )

}


export {getWeb3, getRentContract}   