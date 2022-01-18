const { toBN,toNumber } = web3.utils;

const parseEventValue = (receipt,eventName) => {
    logs = receipt.receipt.logs
    result = logs.filter(log => log.event=== eventName  )
    return result[0].args["0"]

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
 module.exports = {parseEventValue,getContractBalance,getAddressBalance,getGasSpent,createAndAccept}