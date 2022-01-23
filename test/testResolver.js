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
        let message = parseEventValue(receipt, "sendMessage")
        console.log(message);
        console.log(await rEsc.address);


    ///@dev deploying several rentContract, so we have somethong to chew on

    for (let i = 0; i < 5; i++){
        receipts = await createAndAccept(rEsc,accounts[i],accounts[i+1], 1000+(i*100), `Contract No ${i}`)
    }


    })


    // central address to collect fees
    // Later: should be managed in a better way in the contract
    const feeAddress = accounts[9]

    it("should create 2 dispute cases", async () => {
        receipt = await resolver.assignJudge()
        console.log(receipt);
        let disputeCase = await disputeCaseMapping(0)
        console.log(disputeCase);


    })
        
})