import React from 'react';
import {proposeNewContract,getContractsByAddress} from "../Utils/ContractCalls.js"

function CreateContractButton ({newContract,rEsc,currentAccount,setListContracts}) {

    const handleCreateRentContract =  async (event) => {
        event.preventDefault()
        await proposeNewContract(newContract,rEsc,currentAccount)
        setListContracts( await getContractsByAddress(rEsc,currentAccount))
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