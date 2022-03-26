import React from "react"
import {createRedeemProposal} from "../Utils/ContractCalls.js"



const CreateRedeemProposalButton = ({activeContract,escrowDistributionPct,rEsc,currentAccount}) => {

    
    // Only landlord at status 200 can create redeem proposal
    let isLandlord = (activeContract.landlord === currentAccount) ? true:false
    let isStatusCorrect = (activeContract.status === "200") ? true:false
    let buttonVisible = (isLandlord && isStatusCorrect ) ? true:false


    const handleCreateRedeemProposal = (event) => {
        event.preventDefault()
        createRedeemProposal(activeContract.rentId,escrowDistributionPct.tenant,escrowDistributionPct.landlord,0,rEsc,currentAccount) 
    }

 

    return(

        buttonVisible && <button 
            className="btn btn-dark m-3"
            type="button"
             onClick={(event) => handleCreateRedeemProposal(event)}
            > 
            <i className="bi bi-arrow-right"></i>Create Redeem Proposal
        </button>
    
    )}




export default CreateRedeemProposalButton