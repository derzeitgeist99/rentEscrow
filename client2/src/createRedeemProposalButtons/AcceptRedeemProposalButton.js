import React from "react"
import {acceptRedeemProposal} from "../Utils/ContractCalls.js"

const AcceptRedeemProposalButton = ({activeContract,rEsc,currentAccount}) => {

// Only tenant at status 300 can accept redeem proposal

let isTenant = (activeContract.tenant === currentAccount) ? true:false
    let isStatusCorrect = (activeContract.status === "300") ? true:false
    let buttonVisible = (isTenant && isStatusCorrect ) ? true:false

    const handleAcceptRedeemProposal = (event) =>{
        event.preventDefault()
        acceptRedeemProposal(activeContract.rentId,rEsc,currentAccount)

    }
    return(
        buttonVisible && <button 
            className="btn btn-dark m-3"
            type="button"
            onClick={(event) => handleAcceptRedeemProposal(event)}
            // disabled = {activeContract.rentId ? false:true}
            > 
            <i className="bi bi-arrow-right"></i>Accept Redeem Proposal
        </button>

    )

}

export default AcceptRedeemProposalButton