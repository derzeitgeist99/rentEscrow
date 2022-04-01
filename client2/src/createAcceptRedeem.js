import React,{useEffect, useState} from "react";

import CreateRedeemButton from"./createRedeemProposalButtons/CreateRedeemProposalButton.js"
import RejectRedeemProposalButton from"./createRedeemProposalButtons/RejectRedeemProposalButton.js"
import AcceptRedeemProposalButton from"./createRedeemProposalButtons/AcceptRedeemProposalButton.js"
import DisputeRedeemProposal from"./createRedeemProposalButtons/DisputeRedeemProposalButton.js"


function CreateAcceptRedeem ({flowStep,activeContract,currentAccount,rEsc,setListContracts}) {
    const [escrowDistributionPct, setEscrowDistributionPct] = useState({"landlord":0,"tenant":100})
    const [escrowDistributionAbs, setEscrowDistributionAbs] = useState({"landlord":0,"tenant":0})
    const [isSliderDisabled, setIsSliderDisabled] = useState(true)

    useEffect(() => {
        activeContract.redeemProposal.tenantShare === "" ? setEscrowDistributionPct(escrowDistributionPct):setEscrowDistributionPct({
            "landlord": 100 - activeContract.redeemProposal.tenantShare,
            "tenant": activeContract.redeemProposal.tenantShare
        
        })
        // only case when you can manipulate with slider is when you are landlord and status is 200. 
        setIsSliderDisabled(true)
        if (activeContract.landlord === currentAccount && activeContract.status === "200") {
            setIsSliderDisabled(false)
        }
        
    },[activeContract,currentAccount])
    
    const handleSliderChange = (event) =>{
        event.preventDefault()
        setEscrowDistributionPct({"landlord":event.target.value, "tenant": 100-event.target.value})
        let escrowValue = Number(activeContract.escrowValue)
        escrowValue !== "NaN" && setEscrowDistributionAbs({"landlord":event.target.value * escrowValue/100, "tenant": (100-event.target.value) * escrowValue/100 })

    }





    return(
        <div className="">
        <h4 className="">Create / Edit Redeem Proposal as Landlord / Tenant</h4>

        <div className="d-md-flex mb-3">
            <label htmlFor="escrowDistributionSlider" className="form-label">How do you want to split the Escrow</label>
           
            <input  type="range"
                    id="escrowDistributionSlider"
                    className="form-range"
                    min="0" max="100"
                    value = {escrowDistributionPct.landlord} step="1"
                    onChange={(event) => handleSliderChange(event)}
                    disabled = {isSliderDisabled}></input>
            
        </div>
        <p>Landlord gets {escrowDistributionPct.landlord}% which is {escrowDistributionAbs.landlord}Wei</p>
        <p>Tenant gets {escrowDistributionPct.tenant}% which is {escrowDistributionAbs.tenant}Wei</p>

        <CreateRedeemButton
            activeContract = {activeContract}
            escrowDistributionPct = {escrowDistributionPct}
            rEsc = {rEsc}
            currentAccount = {currentAccount}
            setListContracts = {setListContracts}
            >
            </CreateRedeemButton>
        <AcceptRedeemProposalButton
            activeContract = {activeContract}
            rEsc = {rEsc}
            currentAccount = {currentAccount}
            setListContracts = {setListContracts}
            >
            </AcceptRedeemProposalButton>

        <RejectRedeemProposalButton
            activeContract = {activeContract}
            rEsc = {rEsc}
            currentAccount = {currentAccount}
            setListContracts = {setListContracts}
            >
            </RejectRedeemProposalButton>
        <DisputeRedeemProposal
        activeContract = {activeContract}
        rEsc = {rEsc}
        currentAccount = {currentAccount}
        setListContracts = {setListContracts}
        >
        </DisputeRedeemProposal>


    </div>

    )

    }

export default CreateAcceptRedeem