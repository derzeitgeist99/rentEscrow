import React from "react"
import {rejectRedeemProposal} from "../Utils/ContractCalls.js"

const RejectRedeemProposalButton = ({activeContract,rEsc,currentAccount}) => {

    // Only tenant at status 300 can reject redeem proposal

    let isTenant = (activeContract.tenant === currentAccount) ? true:false
    let isStatusCorrect = (activeContract.status === "300") ? true:false
    let buttonVisible = (isTenant && isStatusCorrect ) ? true:false

    const handleRejectRedeemProposal = (event) => {
        event.preventDefault()
        rejectRedeemProposal(activeContract.rentId,rEsc,currentAccount)
    }



    return(
        buttonVisible && <button
            className="btn btn-dark m-3"
            type="button"
             onClick={(event) => handleRejectRedeemProposal(event)}
            // disabled = {activeContract.rentId ? false:true}
            > 
            <i className="bi bi-arrow-right"></i>Reject Redeem Proposal
        </button>

    )

}

export default RejectRedeemProposalButton