import React from "react"
import {disputeRedeemProposal} from "../Utils/ContractCalls.js"

const DisputeRedeemProposal = ({activeContract,rEsc,currentAccount}) => {

    // Only tenant at status 300 can dispute redeem proposal

    let isTenant = (activeContract.tenant === currentAccount) ? true:false
    let isStatusCorrect = (activeContract.status === "300") ? true:false
    let buttonVisible = (isTenant && isStatusCorrect ) ? true:false

    const handleDisputeRedeemProposal = (event) => {
        event.preventDefault()
        disputeRedeemProposal(activeContract.rentId,rEsc,currentAccount)
    }



    return(
        buttonVisible && <button 
            className="btn btn-dark m-3"
            type="button"
             onClick={(event) => handleDisputeRedeemProposal(event)}
            // disabled = {activeContract.rentId ? false:true}
            > 
            <i className="bi bi-arrow-right"></i>Dispute Redeem Proposal
        </button>

    )

}

export default DisputeRedeemProposal