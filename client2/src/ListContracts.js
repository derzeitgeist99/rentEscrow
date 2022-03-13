import React, {useEffect, useState} from "react";
import data from "./rentContractStatus.json"
import NextActionButton from "./nextActionButton.js"


function ListContracts ({listContracts, rEsc,currentAccount}) {

    const [listOfContractDetails,setListOfContractDetails] = useState([])

    useEffect(() =>{
        // I dont know why I need the init() function
        const init = async () =>{
        // empty everything
        let listOfContractDetails = []
        setListOfContractDetails([])
        
        for (let id of listContracts) { 
            let contractDetail = await rEsc.methods.rentContractsMapping(id).call()
            listOfContractDetails.push({
                rentId: contractDetail.rentId,
                status: contractDetail.status,
                landlord: contractDetail.landlord,
                tenant: contractDetail.tenant})
        }
        setListOfContractDetails(listOfContractDetails)
    }
    init()
    // This is dependency, I want to update everytime the ListContracts Change
},[listContracts])

    
    if (typeof listOfContractDetails === "undefined" || listOfContractDetails.length === 0) {
        return(
           <div className="container">
               <p className="text-center vh-40">
                   <i className="bi bi-arrow-repeat"/>
                    <i className="bi bi-cart-x-fill"/>
                    Loading or you don't have any active contracts 
                    <i className="bi bi-arrow-repeat"/>
                    <i className="bi bi-cart-x-fill"/>
                    </p>
           </div>
        )
        

    }

       
    return (
        
    
        <ul className="list-group-flush overflow-scroll" style={{height: 300}} >
            {listOfContractDetails.map( contractDetail => 

        <li className="list-group-item d-md-flex justify-content-between align-items-center"
            key = {contractDetail.rentId+contractDetail.landlord}>
          <span className="badge bg-primary rounded-pill">{data[contractDetail.status][0]}</span>
          <p className="text-left">{"Contract Id "+  contractDetail.rentId}</p>
          <NextActionButton
          contractDetail = {contractDetail}
          currentAccount = {currentAccount}>

          </NextActionButton>
        </li>

         )} 
      </ul>

    )
            

}

export default ListContracts