import React,{useState} from "react";

function CreateAcceptRedeem ({flowStep,activeContract,currentAccount,createRedeemProposal}) {
    const [escrowDistributionPct, setEscrowDistributionPct] = useState({"landlord":0,"tenant":100})
    const [escrowDistributionAbs, setEscrowDistributionAbs] = useState({"landlord":0,"tenant":0})

    const handleSliderChange = (event) =>{
        event.preventDefault()
        setEscrowDistributionPct({"landlord":event.target.value, "tenant": 100-event.target.value})
        let escrowValue = Number(activeContract.escrowValue)
        escrowValue != "NaN" && setEscrowDistributionAbs({"landlord":event.target.value * escrowValue/100, "tenant": (100-event.target.value) * escrowValue/100 })

    }

    const handleCreateRedeemProposal = (event) => {
        event.preventDefault()
        createRedeemProposal(activeContract.rentId,escrowDistributionPct.tenant,escrowDistributionPct.landlord,0) 

    }


    return(
        <div className="">
        <h4 className="">Create / Edit Redeem Proposal as Landlord / Tenant</h4>

        <div className="d-md-flex mb-3">
            <label htmlFor="escrowDistributionSlider" className="form-label">How do you want to split the Escrow</label>
           
            <input type="range" className="form-range" min="0" max="100" step="1" id="escrowDistributionSlider"
                    onChange={(event) => handleSliderChange(event)}></input>
            
        </div>
        <p>Landlord gets {escrowDistributionPct.landlord}% which is {escrowDistributionAbs.landlord}Wei</p>
        <p>Tenant gets {escrowDistributionPct.tenant}% which is {escrowDistributionAbs.tenant}Wei</p>
        <button 
            className="btn btn-dark"
            type="button"
            onClick={(event) => handleCreateRedeemProposal(event)}
            disabled = {activeContract.rentId ? false:true}
            > 
            <i className="bi bi-arrow-right"></i>Create Redeem Proposal
            </button>

    </div>




    )


    }

export default CreateAcceptRedeem