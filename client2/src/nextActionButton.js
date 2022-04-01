import React,{useEffect, useState} from "react";
import allMessages from "./rentContractStatus.json"
import {defaultActiveContract} from "./utils.js"



function NextActionButton ({contractDetail,currentAccount,setFlowStep,setActiveContract,rEsc}) {
    const [buttonTarget,setButtonTarget] = useState(0)
    const [buttonMessage,setButtonMessage] = useState("...")
    // seems to fix my issue, but is it the correct approach? Initially I had the await rentContractsMapping(contractDetail.rentId).call()
    // in onClick function. however it tried to render other elements before the setActiveContract properly mounted...
    // so now I am preloading this already in the useEffect
    const [preloadedActiveContract,setPreloadedActiveContract] = useState(defaultActiveContract)

    useEffect( () => {
        const init = async () => {
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
    
            let result = await rEsc.methods.rentContractsMapping(contractDetail.rentId).call()
            result.landlord === "0x0000000000000000000000000000000000000000" ?  setPreloadedActiveContract(defaultActiveContract): setPreloadedActiveContract(result) 

        }
        init()}, [[contractDetail,currentAccount]]
    )



    const onClick = async (event) =>  {
        event.preventDefault()
        setFlowStep(buttonTarget)
        setActiveContract(preloadedActiveContract)
        
    }

    return (
        <button className="btn btn-small btn-secondary" onClick = {(event) => onClick(event)}>{buttonMessage}</button>
    )


}

export default NextActionButton