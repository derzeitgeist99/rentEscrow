import React, {useState} from "react";

function ListContracts ({listContracts}) {
    
    if (typeof listContracts == "undefined" || listContracts.length == 0) {
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
        

    }{console.log("tadaFalse")
    return(
        
        <ul className="list-group-flush">
            {listContracts.map(contractId => 
        <li className="list-group-item d-md-flex justify-content-between align-items-center">
          <span className="badge bg-primary rounded-pill">Redeem Proposal Waiting</span>
          <p className="text-left m-3">{"tada"}</p>
          <a href="#" className="btn btn-small btn-secondary text left">Accept</a>
        </li>
         )} 
      </ul>
    )
            }

}

export default ListContracts