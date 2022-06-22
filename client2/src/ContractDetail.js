import React,{useEffect, useState} from 'react';
import statusMapping from "./rentContractStatus.json"
import LoadContractDocumentation from "./LoadContractDocumentation";

function ContractDetail ({flowStep,activeContract,currentAccount,setNewContract,newContract}) {
    const [visibleTenantAddress,setVisibleTenantAddress] = useState(undefined)
    

    const newContractUpdate = (event, field) => {
        let value = event.target.value
        setNewContract({...newContract, [field]: value})

    }
useEffect(() => {
    const switchTenantAddress = () => {
    switch(flowStep) {

        case 0: setVisibleTenantAddress("TBD")
        break;
        case 1: setVisibleTenantAddress(currentAccount)
        break;
        case 2: setVisibleTenantAddress(activeContract.tenant)
        break;
        case 3: setVisibleTenantAddress(activeContract.tenant)
        break;
        
    }}
switchTenantAddress()},[activeContract])
    

    return (
        <div className="">
        <h4 className="">Create / Edit Rent Contract as Landlord / Tenant</h4>

            <form>
            <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="contractId">Contract Id</label>
                    <input type="text" className="form-control" id="contractId"
                            placeholder={flowStep === 0 ? "TBD":activeContract.rentId}
                            disabled/>
                </div>
            <div className="d-md-flex mb-3">
                <label className="form-label w-100" id="contractStatus">Contract Status</label>
                <input type="text" className="form-control" id="contractStatus"
                        placeholder={flowStep === 0 ? "TBD":statusMapping[activeContract.status].status}
                        disabled/>
            </div>
            
            <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="landlord">Landlord</label>
                    <input type="number" className="form-control" id="landlord"
                            placeholder={flowStep === 0 ? currentAccount:activeContract.landlord}
                            disabled/>
                </div>
            
                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="tenant">Tenant</label>
                    <input type="number" className="form-control" id="tenant"
                            placeholder= {visibleTenantAddress}
                            disabled/>
                </div>
                {/* Bug: when user inputs something in the Landlord form, it remains visible. Should be overrriden by activeContract */}
                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="escrowvalue">Escrow Value (wei)</label>
                    <input type="number" 
                    className="form-control"
                    id="escrowvalue"
                    placeholder = {flowStep === 0 ? "Enter":activeContract.escrowValue}
                    disabled = {flowStep === 0 ? false:true}
                    onChange={event => newContractUpdate(event, "escrowValue")}/>
                </div>

                <div className="d-md-flex mb-3">
                    <label className="form-label w-100" id="contractdetail">Link to Contract Detail</label>

                    <input type="http"
                    className="form-control"
                    id="contractdetail"
                    placeholder={flowStep === 0 ? "Enter":activeContract.contractDetail}
                    disabled = {flowStep === 0 ? false:true}
                    onChange={event => newContractUpdate(event, "contractDetail")} />
                </div>


               
            </form>

            {/* <LoadContractDocumentation>
</LoadContractDocumentation> */}
         </div>
    )

}

export default ContractDetail