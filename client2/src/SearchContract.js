import React from "react";

function SearchContract ({getContractDetail,setActiveContractId,activeContractId, setFlowStep}) {


    const handleSearchContract = (event) => {
        event.preventDefault()
        getContractDetail(activeContractId)
        setFlowStep(1)
    }

    const handleChange = (event) => {
        event.preventDefault()
        setActiveContractId(event.target.value)
    } 

    return(<div className="d-md-flex mb-3 justify-content-start">

        <button className = "btn btn-small btn-secondary m-3" onClick={()=> setFlowStep(0)}>
        Create New Contract
        </button>
    <form  className="flex-fill m-3"
    onSubmit={event => handleSearchContract(event)}>
<div className="d-md-flex">
   
<button className="btn btn-secondary text-nowrap"
            type="submit"
             >Search Contract to Accept</button>

    <input  className = "form-control"
            id="rentId"
            onChange={event => handleChange(event)}
            />
    
</div>
</form>
</div>
    )
}

export default SearchContract