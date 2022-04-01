import React,{useEffect, useState} from "react";
import allMessages from "./rentContractStatus.json"



function NextActionButton ({contractDetail,currentAccount,setFlowStep,getContractDetail}) {
    const [buttonTarget,setButtonTarget] = useState(0)
    const [buttonMessage,setButtonMessage] = useState("...")
    
    useEffect(() =>{
        
        if (currentAccount.toLowerCase() === contractDetail.landlord.toLowerCase()) {
            setButtonTarget(allMessages[contractDetail.status]["landlord"][0])
            setButtonMessage(allMessages[contractDetail.status]["landlord"][1])
        } else if (currentAccount.toLowerCase() === contractDetail.tenant.toLowerCase())
        {
            setButtonTarget(allMessages[contractDetail.status]["tenant"][0])
            setButtonMessage(allMessages[contractDetail.status]["tenant"][1])
        } 
        else {
            setButtonMessage("This is weird...")
        }
        
    }, [contractDetail]
    )

    const onClick = (event) => {
        event.preventDefault()
        setFlowStep(buttonTarget)
        getContractDetail(contractDetail.rentId)
    }
    

    return (
        <button className="btn btn-small btn-secondary" onClick = {(event) => onClick(event)}>{buttonMessage}</button>
    )


}

export default NextActionButton