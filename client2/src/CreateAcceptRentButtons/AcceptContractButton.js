import React from 'react';
import {acceptNewContract,getContractsByAddress} from "../Utils/ContractCalls.js"

function AcceptContractButton ({flowStep,activeContract,rEsc,currentAccount,setListContracts}) {

    let isTenant = (activeContract.landlord !== currentAccount) ? true:false
    let isStatusCorrect = (activeContract.status === "100") ? true:false
    let buttonDisabled = (isTenant && isStatusCorrect ) ? false:true

    const handleAcceptRentContract = async (event) => {
        event.preventDefault()
        await acceptNewContract(activeContract,rEsc, currentAccount)
        setListContracts( await getContractsByAddress(rEsc,currentAccount))
        
    }

    return (
            <button 
                className="btn btn-dark"
                type="button"
                onClick={(e) => handleAcceptRentContract(e)}
                disabled = {buttonDisabled}
                > 
                <i className="bi bi-arrow-right"></i>Accept Rent Contract: {activeContract.rentId} and deposit {activeContract.escrowValue} wei
            </button>
            
    )

}
export default AcceptContractButton