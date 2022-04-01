import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import RentEscrow from "./contracts/rentEscrow.json"

export const getWeb3 = () =>

    new Promise( async (resolve, reject) => {
        // detectEthereumProvider: makes sure that MetaMask is loaded
        let provider = await detectEthereumProvider();
        if(provider) {
            // ask user to connect Metamask
            await provider.request({ method: 'eth_requestAccounts' });
            try {
                const web3 = new Web3(window.ethereum);
                resolve(web3);
            } catch(error) {
                reject(error);
            }
        } reject('Install Metamask');

});

export const getRentContract = async web3 => {
    const networkId = await web3.eth.net.getId();

    const contractDeployment = RentEscrow.networks[networkId]
    return new web3.eth.Contract(
        RentEscrow.abi, contractDeployment && contractDeployment.address
    )

}

export const defaultActiveContract = {
    "landlord": "Search for valid contract", 
    "escrowValue":"Search for valid contract",
    "contractDetail":"Search for valid contract",
    "status":"Search for valid contract",
    "redeemProposal": {
      "tenantShare":"Search for valid contract",
      "landlordShare":"Search for valid contract",
      "feeShare":"Search for valid contract",
      "feeAddress":"Search for valid contract",
      
    }}