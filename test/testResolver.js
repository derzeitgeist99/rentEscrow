const rentEscrow = artifacts.require("rentEscrow");
const resolverContract = artifacts.require("resolver");
const rentEscrowInterface = artifacts.require("rentEscrowInterface");
const { toBN,toNumber } = web3.utils;
const {expectRevert} = require("@openzeppelin/test-helpers");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
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
        ///@dev Judge number 1
        
        receipt = await resolver.assignJudge({from: accounts[6]})
        disputeId = parseEventValue(receipt,"sendDisputeId")
        disputeCase1 = await resolver.getDisputeCase(disputeId[0]);

        assert.equal(disputeCase1.judges[0], accounts[6])
        assert.equal(disputeCase1.judges.length,1)
        assert.equal(disputeCase1.status,100)
        assert.equal(disputeCase1.disputeParty.length,2)
        
        ///@dev Judge number 2
        receipt = await resolver.assignJudge({from: accounts[7]})
        disputeId = parseEventValue(receipt,"sendDisputeId")
        disputeCase2 = await resolver.getDisputeCase(disputeId[0]);
       
        assert.equal(disputeCase1.disputeId,disputeCase2.disputeId)
        assert.equal(disputeCase2.judges[0], accounts[6])
        assert.equal(disputeCase2.judges[1], accounts[7])
        assert.equal(disputeCase2.judges.length,2)
        assert.equal(disputeCase2.status,100)
        assert.equal(disputeCase2.disputeParty.length,2)

        ///@dev Judge number 3
        receipt = await resolver.assignJudge({from: accounts[8]})
        disputeId = parseEventValue(receipt,"sendDisputeId")
        disputeCase3 = await resolver.getDisputeCase(disputeId[0]);
        
        assert.equal(disputeCase1.disputeId,disputeCase3.disputeId)
        assert.equal(disputeCase3.judges[0], accounts[6])
        assert.equal(disputeCase3.judges[1], accounts[7])
        assert.equal(disputeCase3.judges[2], accounts[8])
        assert.equal(disputeCase3.judges.length,3)
        assert.equal(disputeCase3.status,100)
        assert.equal(disputeCase3.disputeParty.length,2)

    })

    it("judge number 4 should create new dispute", async () => {
        receipt = await resolver.assignJudge({from: accounts[9]})
        disputeId = parseEventValue(receipt,"sendDisputeId")
        disputeCase4 = await resolver.getDisputeCase(disputeId[0]);

        assert.equal(disputeCase4.judges[0], accounts[9])
        assert.equal(disputeCase4.judges.length,1)
        assert.equal(disputeCase4.status,100)
        assert.equal(disputeCase4.disputeParty.length,2)
        assert.notEqual(disputeCase1.disputeId,disputeCase4.disputeId)

    })

    it("should not assign judge as the address is disputeParty or judge already",async () => {
        await expectRevert(resolver.assignJudge({from: accounts[9]}),"This address cannot be judge")
        await expectRevert(resolver.assignJudge({from: disputeCase4.disputeParty[0].disputePartyAddress}),"This address cannot be judge")
        await expectRevert(resolver.assignJudge({from: disputeCase4.disputeParty[1].disputePartyAddress}),"This address cannot be judge")
        
    })
        
})