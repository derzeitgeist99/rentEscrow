import React, {useState} from "react";

function CreateRentContract ({submitRentContract,isUserLandlord,activeContract,currentAccount, acceptRentContract}) {
    const [newContract, setNewContract] = useState({escrowValue:1000, contractDetail:"yada"})

    const handleCreateRentContract = (event) => {
        event.preventDefault()
        submitRentContract(newContract) 
    }

    const handleAcceptRentContract = (event) => {
        event.preventDefault()
        acceptRentContract(activeContract.rentId)
        
    }

    const newContractUpdate = (event, field) => {
        let value = event.target.value
        setNewContract({...newContract, [field]: value})

    }

    return (

            <form>
            <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="landlord">Landlord</label>
                    <input type="number" className="form-control" id="landlord"
                            placeholder={isUserLandlord ? currentAccount:activeContract.landlord}
                            disabled/>
                </div>
            
                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="tenant">Tenant</label>
                    <input type="number" className="form-control" id="tenant"
                            placeholder={isUserLandlord ? "TBD":currentAccount}
                            disabled/>
                </div>
                {/* Bug: when user inputs something in the Landlord form, it remains visible. Should be overrriden by activeContract */}
                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="escrowvalue">Escrow Value (wei)</label>
                    <input type="number" 
                    className="form-control"
                    id="escrowvalue"
                    placeholder = {isUserLandlord ? "10000":activeContract.escrowValue}
                    disabled = {isUserLandlord ? false:true}
                    onChange={event => newContractUpdate(event, "escrowValue")}/>
                </div>

                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="contractdetail">Link to Contract Detail</label>
                    <input type="http"
                    className="form-control"
                    id="contractdetail"
                    placeholder={isUserLandlord ? "yada":activeContract.contractDetail}
                    disabled = {isUserLandlord ? false:true}
                    onChange={event => newContractUpdate(event, "contractDetail")} />
                </div>

                <div className="d-flex flex-row-reverse align-items-center">
                    
                    {isUserLandlord &&
                    <button 
                        className="btn btn-dark"
                        type="button"
                        onClick={(e) => handleCreateRentContract(e)}
                        > 
                        <i className="bi bi-arrow-right"></i>Create Rent Contract
                    </button>
                    }

                    {!isUserLandlord &&
                    <button 
                        className="btn btn-dark"
                        type="button"
                        onClick={(e) => handleAcceptRentContract(e)}
                        disabled = {activeContract.rentId ? false:true}
                        > 
                        <i className="bi bi-arrow-right"></i>Accept Rent Contract: {activeContract.rentId}
                    </button>
                    }
                    
                </div>
            </form>
    )
}
export default CreateRentContract;