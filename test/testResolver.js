const rentEscrow = artifacts.require("rentEscrow");
const resolverContract = artifacts.require("resolver");
const rentEscrowInterface = artifacts.require("rentEscrowInterface");
const { toBN,toNumber } = web3.utils;
const {expectRevert} = require("@openzeppelin/test-helpers");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const {parseEventValue,getContractBalance,getAddressBalance,getGasSpent,createAndAccept} = require("./testUtils.js")



//Later: need to make this ready for BigNumbers


contract("rentEscrow", async accounts => {
    let rEsc;
    let resolver;

    before (async () =>{
        rEsc = await rentEscrow.new();
        resolver = await resolverContract.new();
       
        contractAddress = await rEsc.address
        receipt = await resolver.setRentEscrowAddress(contractAddress)
        let message = parseEventValue(receipt, "sendAddress")

    ///@dev deploying several rentContract, so we have somethong to chew on

    for (let i = 0; i < 5; i++){
        receipts = await createAndAccept(rEsc,accounts[i],accounts[i+1], 1000+(i*100), `Contract No ${i}`)
    }

    })


    // central address to collect fees
    // Later: should be managed in a better way in the contract
    const feeAddress = accounts[9]

    it("should create first dispute case", async () => {
        ///@dev 3judges jumping on a case
        console.log(`Account 6: ${accounts[6]}`);
        receipt = await resolver.assignJudge({from: accounts[6]})
        parseEventValue(receipt, "sendMessage", true)
        parseEventValue(receipt, "sendId", true)
        parseEventValue(receipt, "sendAddress", true)
        parseEventValue(receipt, "sendBool", true)
        console.log(`Account 7: ${accounts[7]}`);
        receipt = await resolver.assignJudge({from: accounts[7]})
        parseEventValue(receipt, "sendMessage", true)
        parseEventValue(receipt, "sendId", true)
        parseEventValue(receipt, "sendAddress", true)
        parseEventValue(receipt, "sendBool", true)

        console.log(`Account 8: ${accounts[8]}`);
        receipt = await resolver.assignJudge({from: accounts[8]})
        parseEventValue(receipt, "sendMessage", true)
        parseEventValue(receipt, "sendId", true)
        parseEventValue(receipt, "sendAddress", true)
        parseEventValue(receipt, "sendBool", true)

        console.log(`Account 9: ${accounts[9]}`);
        receipt = await resolver.assignJudge({from: accounts[9]})
        parseEventValue(receipt, "sendMessage", true)
        parseEventValue(receipt, "sendId", true)
        parseEventValue(receipt, "sendAddress", true)
        parseEventValue(receipt, "sendBool", true)
        

        disputeCase = await resolver.getDisputeCase(1);

        console.log(disputeCase);

    })
        
})