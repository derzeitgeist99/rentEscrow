import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import RentEscrow from "./contracts/rentEscrow.json"

const getWeb3 = () =>

    new Promise( async (resolve, reject) => {
        // detectEthereumProvider: makes sure that MetaMask is loaded
        let provider = await detectEthereumProvider();
        if(provider) {
            // ask user to connect Metamask
            await provider.request({ method: 'eth_requestAccounts' });
            try {
                const web3 = new Web3(window.ethereum);
                console.log(web3)
                resolve(web3);
            } catch(error) {
                reject(error);
            }
        } reject('Install Metamask');

});

const getRentContract = async web3 => {
    const networkId = await web3.eth.net.getId();

    const contractDeployment = RentEscrow.networks[networkId]
    return new web3.eth.Contract(
        RentEscrow.abi, contractDeployment && contractDeployment.address
    )

}


export {getWeb3, getRentContract}   