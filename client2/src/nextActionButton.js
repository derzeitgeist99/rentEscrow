import React,{useEffect, useState} from "react";
import data from "./rentContractStatusII.json"



function NextActionButton ({contractDetail,currentAccount}) {
    const [buttonMessage,setButtonMessage] = useState(undefined)

    useEffect(() =>{
        //setButtonMessage(data["100"].status)
       
        if (currentAccount === contractDetail.landlord) {
            console.log(data["100"]["landlord"][1]);
        } else
        {
            console.log(data["100"]["tenant"][1]);
        }   
        
    }
    )
    

    return (
        <a href="#" className="btn btn-small btn-secondary">{data[contractDetail.status][2]}</a>
    )


}

export default NextActionButton