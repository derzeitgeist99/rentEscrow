import React, {useState} from "react";

function CreateRentContract ({submitRentContract,newContractId}) {
    const [newContract, setNewContract] = useState({escrowValue:1000, contractDetail:"yada"})

    const handleSubmit = (event) => {
        event.preventDefault()
        submitRentContract(newContract)
        

    }

    const newContractUpdate = (event, field) => {
        let value = event.target.value
        setNewContract({...newContract, [field]: value})

    }

    return (
        <div className="container bg-light p-5">            
            <h4 className="">Create Rent Contract</h4>
            <form onSubmit={event => handleSubmit(event)}>
            <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="escrowvalue">Landlord</label>
                    <input type="number" className="form-control" id="escrowvalue" placeholder="4d6f73742070656f706c65206" disabled/>
                </div>
                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="escrowvalue">Escrow Value (wei)</label>
                    <input type="number" 
                    className="form-control"
                    id="escrowvalue"
                    placeholder = "10000"
                    onChange={event => newContractUpdate(event, "escrowValue")}/>
                </div>

                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="contractdetail">Link to Contract Detail</label>
                    <input type="http"
                    className="form-control"
                    id="contractdetail"
                    placeholder="yada"
                    onChange={event => newContractUpdate(event, "contractDetail")} />
                </div>

                <div className="d-flex flex-row-reverse align-items-center">
                    
                    <button className="btn btn-dark" type="submit"> <i className="bi bi-arrow-right"></i> Create Rent Contract</button>
                    
                    <div className={`m-3 ${typeof newContractId === "undefined" ? "invisible":"visible"}`}>
                        <p>Your new ContractId is: <mark>{newContractId}</mark></p>
                    </div>
                    
                </div>
            </form>
        </div>
    )
}
export default CreateRentContract;