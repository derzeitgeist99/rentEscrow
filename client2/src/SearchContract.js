import React,{useState} from "react";
import {defaultActiveContract} from "./utils.js"

function SearchContract ({setFlowStep,setActiveContract,rEsc}) {
 const [searchContractId, setSearchContractId] = useState(undefined)


    const handleSearchContract = async (event) => {
        event.preventDefault()
        setFlowStep(1)
        let result = await rEsc.methods.rentContractsMapping(searchContractId).call() 
        result.landlord === "0x0000000000000000000000000000000000000000" ?  setActiveContract(defaultActiveContract): setActiveContract(result)
    }

    const handleChange = (event) => {
        event.preventDefault()
        setSearchContractId(event.target.value)
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