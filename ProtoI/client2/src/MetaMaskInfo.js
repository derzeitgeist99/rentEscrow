
import React from "react";

const MetaMaskInfo = ({currentAccount, setCurrentAccount}) => {

    const handleAccountsChange = (accounts) => {
         if (accounts[0] !== currentAccount){
            setCurrentAccount(accounts[0])
        }
        
    }

    window.ethereum.request({ method: 'eth_accounts' })
    .then(handleAccountsChange)

    window.ethereum.on('accountsChanged', handleAccountsChange)

    if (typeof currentAccount === "undefined") {
        return(
        <span>Connect Metamask</span>)
    }

    


    return(
        <span className = "text-light"><span role="img" aria-label="Fox">🦊</span> Connected Account: {currentAccount.substr(0,5) + "..."}</span>
        )
}
export default MetaMaskInfo