import React from "react"
import {rejectRedeemProposal,getContractsByAddress} from "../Utils/ContractCalls.js"

const RejectRedeemProposalButton = ({activeContract,rEsc,currentAccount,setListContracts}) => {

    // Only tenant at status 300 can reject redeem proposal

    let isTenant = (activeContract.tenant.toLowerCase() === currentAccount.toLowerCase()) ? true:false
    let isLandlord = (activeContract.landlord.toLowerCase() === currentAccount.toLowerCase()) ? true:false
    let isStatusCorrect = (activeContract.status === "300") ? true:false
    let buttonVisible = (isTenant||isLandlord && isStatusCorrect ) ? true:false

    const handleRejectRedeemProposal = async (event) => {
        event.preventDefault()
        await rejectRedeemProposal(activeContract.rentId,rEsc,currentAccount)
        setListContracts( await getContractsByAddress(rEsc,currentAccount))
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