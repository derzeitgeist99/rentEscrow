const { toBN,toNumber,BN } = web3.utils;
//var BigNumber = require('big-number');

const parseEventValue = (receipt,eventName,print = false) => {
    logs = receipt.receipt.logs
    result = logs.filter(log => log.event=== eventName  )
    
    let parsedResult = []
    for (i = 0; i< result.length; i++)
        {parsedResult.push(result[i].args["0"])
        if (print){console.log("===>  " + result[i].args["0"])}}
        
    return parsedResult

};

const getContractBalance = async (contract) => {
    contractAddress = await contract.address
    const balance = await web3.eth.getBalance(contractAddress)
    return balance
}

const getAddressBalance = async (_addressBalance) => {
    const balance = await web3.eth.getBalance(_addressBalance)
    return balance
}

const getGasSpent = async (_receipt) => {
    const gasUsed = toBN(_receipt.receipt.gasUsed)
    
    const tx = await web3.eth.getTransaction(_receipt.tx);
    const gasPrice = toBN(tx.gasPrice);

    const gasSpent = gasUsed*gasPrice
    
    //console.log(`GasUsed: ${gasUsed}`)
    //console.log(`GasPrice: ${gasPrice}`)
    //console.log(`GasSpent: ${gasSpent}`)

    return gasSpent

}


/// @custom: later It makes no sense to specify the contract, should be baked in by default. 

const createAndAccept = async (contract,landlord,tenant, escrow,detail) =>{
      
    let receiptPropose = await contract.proposeNewContract (escrow, detail, {from: landlord})
    rentId = parseEventValue(receiptPropose,"rentContractId")

    receiptAccept = await contract.acceptNewContract(rentId, {from: tenant, value: escrow})
    return [toNumber(rentId),receiptPropose, receiptAccept]

}

const saveInitialBalance = async (_rentId,resolverContractAddress,rEsc) => {
    rentContract = await rEsc.rentContractsMapping([_rentId])
    
        partyArr = [[rentContract.tenant,undefined,undefined,undefined,undefined],
                    [rentContract.landlord,undefined,undefined,undefined,undefined ],
                    [resolverContractAddress,undefined,undefined,undefined,undefined]]
        
        for (let party of partyArr) {
            party[1] = BigInt(await web3.eth.getBalance(party[0]))
        }
        return partyArr
}

const saveTerminalBalance = async (partyArr) => {
        
        for (let party of partyArr) {
            party[2] = BigInt(await web3.eth.getBalance(party[0]))
            party[3] = party[2] - party[1]
        }
        
        return partyArr
}

 module.exports = {parseEventValue,getContractBalance,getAddressBalance,getGasSpent,createAndAccept,saveInitialBalance,saveTerminalBalance}