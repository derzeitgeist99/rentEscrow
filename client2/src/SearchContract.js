import React from "react";

function SearchContract ({getContractDetail,setActiveContractId,activeContractId}) {


    const handleSearchContract = (event) => {
        event.preventDefault()
        getContractDetail(activeContractId)
    }

    const handleChange = (event) => {
        event.preventDefault()
        setActiveContractId(event.target.value)
    } 

    return(
    <form  className=""
    onSubmit={event => handleSearchContract(event)}>
<div className="d-md-flex mb-3">
    <label className="form-label w-100" id="rentId">RentId</label>
    <input className = "form-control" id="rentId" onChange={event => handleChange(event)} />
    <button className="btn btn-secondary"
    type="submit">Search Contract</button>
</div>
</form>
    )
}

export default SearchContract