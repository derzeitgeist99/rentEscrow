import React from 'react';
import {proposeNewContract} from "../Utils/ContractCalls.js"

function CreateContractButton ({flowStep,newContract,rEsc,currentAccount}) {

    const handleCreateRentContract = (event) => {
        event.preventDefault()
        proposeNewContract(newContract,rEsc,currentAccount) 
    }

    return (
            <button 
                className="btn btn-dark"
                type="button"
                onClick={(e) => handleCreateRentContract(e)}
                > 
                <i className="bi bi-arrow-right"></i>Create Rent Contract
            </button>
            
    )

}
export default CreateContractButton