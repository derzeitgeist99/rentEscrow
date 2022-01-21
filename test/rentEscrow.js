const rentEscrow = artifacts.require("rentEscrow");
const resolverContract = artifacts.require("resolver");
const { toBN,toNumber } = web3.utils;
const {expectRevert} = require("@openzeppelin/test-helpers");
const {parseEventValue,getContractBalance,getAddressBalance,getGasSpent,createAndAccept} = require("./testUtils.js")



//Later: need to make this ready for BigNumbers


contract("rentEscrow", async accounts => {
    let rEsc;
    let resolver;

    before (async () =>{
        rEsc = await rentEscrow.new();
        resolver = await resolverContract.new();
        contractAddress = await resolver.address
        receipt = await resolver.setRentEscrowAddress(contractAddress)
        

    })
    // let contractAddress = await rEsc.address
    // console.log(contractAddress)

    // central address to collect fees
    // Later: should be managed in a better way in the contract
    const feeAddress = accounts[9]

    it("should create rentContract from account 0", async () =>{
        
        let receipt= await rEsc.proposeNewContract (1000, "HelloWorld")
        
        const rentContracts = await rEsc.rentContractsMapping(0)
        assert.equal(rentContracts.escrowValue, 1000)
        assert.equal(rentContracts.landlord, accounts[0])


    })

    it("should create second rentContract from account 1", async () =>{
        
        await rEsc.proposeNewContract (1000, "HelloWorld" ,{from: accounts[1]})
        const rentContracts = await rEsc.rentContractsMapping(1)
        assert.equal(rentContracts.escrowValue, 1000)
        assert.equal(rentContracts.landlord, accounts[1])

    })

    it ("should accept first contract", async() => {
        // Need to get initial balance
        initialContractBalance = await getContractBalance(rEsc)
        initialTenantBalance = await getAddressBalance(accounts[1])
        
        let contract
        contract = await rEsc.rentContractsMapping(0)
        escrowValue = contract.escrowValue.toNumber()
        receipt = await rEsc.acceptNewContract(0, {from: accounts[1], value: escrowValue})
        contract = await rEsc.rentContractsMapping(1)
        assert(contract.tenant,accounts[1])

        terminalContractBalance = await getContractBalance(rEsc)
        terminalTenantBalance = await getAddressBalance(accounts[1])
        gasSpent = await getGasSpent(receipt)

        assert(initialContractBalance + escrowValue,terminalContractBalance)
        assert(initialTenantBalance - escrowValue - gasSpent,terminalTenantBalance)

        // console.log(`Initial Balance: ${initialTenantBalance}`)
        // console.log(`GasSpent: ${gasSpent}`)
        // console.log(`escrowValue: ${escrowValue}`)
        // console.log(`Terminal Balance: ${terminalTenantBalance}`)

    }) 
    //Later: we need a proper matrix of sitations. Failed sums, non existent addresses, contracts, etc
    //Later: we need to load this from external file
    //Later: test name should be part of iterable?

        let situationList = []
        let path = "Happy" 
        let [...situationInput] = [rentId = 0, tenantShare = 50,landlordShare= 40,feeShare= 10,feeAddress]
        let situationOutput = feeAddress
        let fromAddress = accounts[0]
        situationList.push([path, situationInput,situationOutput,fromAddress])

        path = "Unhappy" 
        situationInput = [rentId = 0, tenantShare = 51,landlordShare= 40,feeShare= 10,feeAddress]
        situationOutput = "TenantShare + Landlord Share + Fee Share is not 100%"
        fromAddress = accounts[0]
        situationList.push([path, situationInput,situationOutput,fromAddress])

        path = "Unhappy" 
        situationInput = [rentId = 0, tenantShare = 50,landlordShare= 40,feeShare= 10,feeAddress]
        situationOutput = "Only Landlord can create redeem proposal"
        fromAddress = accounts[1]
        situationList.push([path, situationInput,situationOutput,fromAddress])


    // Loops through situations and for each creates special test
    // Happy and unhappy paths have different logic. 
    for (const i of situationList) {
        switch(i[0]){
            case "Happy": 
                it(`Should create redeemProposal`, async() =>{
                    receipt = await rEsc.createRedeemProposal(...i[1],{from:i[3]})
                    const rentContracts = await rEsc.rentContractsMapping(i[1][0])
                    assert(rentContracts.redeemProposal.feeAddress = i[2])

                })
                break
            case "Unhappy": 
                it(`Should not create redeemProposal`, async() =>{
                    await expectRevert(rEsc.createRedeemProposal(...i[1],{from:i[3]}), i[2])
                })
                break

        }    
        
        }

        //Happy path of acceptRedeemProposal
        let i = situationList[0]
    
        it(`Should acceptRedeemProposal`, async() =>{
            //resetting the rentContract
            await rEsc.createRedeemProposal(...i[1],{from:i[3]})
            //getting the tenantAddress
            const rentContracts = await rEsc.rentContractsMapping(i[1][0])
            tenantAddress = rentContracts.tenant

            //getting Balance
            initialContractBalance = await getContractBalance(rEsc)
            initialTenantBalance = await getAddressBalance(tenantAddress)

            receipt = await rEsc.acceptRedeemProposal(i[1][0],{from:tenantAddress})
            
            terminalContractBalance = await getContractBalance(rEsc)
            terminalTenantBalance = await getAddressBalance(tenantAddress)
            gasSpent = await getGasSpent(receipt)

     
            assert(terminalContractBalance,0)
            assert(initialTenantBalance + 500  - gasSpent,terminalTenantBalance)

            })

    // Unhappy path with non-tenant
    it("Should not acceptRedeemProposal", async() => {
         //resetting the rentContract
         await rEsc.createRedeemProposal(...i[1],{from:i[3]})
         // calling from random adress

         await expectRevert(rEsc.acceptRedeemProposal(i[1][0],{from: accounts[9]}),"Only tenant can accept redeem proposal")
         await expectRevert(rEsc.acceptRedeemProposal(i[1][0],{from: accounts[0]}),"Only tenant can accept redeem proposal")

    } )

    // happy path to reject proposal by landlord
    it("Should reject redeem proposal by landlord", async () => {
        receipts = await createAndAccept(rEsc,accounts[0],accounts[1], 1000, "Hallo Welt")
        rentId = receipts[0]
        await rEsc.rejectRedeemProposal(rentId, {from: accounts[0]})
        contract = await rEsc.rentContractsMapping(rentId)
        assert(contract.redeemProposal.proposalStatus == 301)
        

    } )

    // happy path to reject proposal by tenant
    it("Should reject redeem proposal by tenant", async () => {
        receipts = await createAndAccept(rEsc,accounts[0],accounts[1], 1000, "Hallo Welt")
        rentId = receipts[0]
        await rEsc.rejectRedeemProposal(rentId, {from: accounts[1]})
        contract = await rEsc.rentContractsMapping(rentId)
        assert(contract.redeemProposal.proposalStatus == 302)
        

    } )

    // unhappy path to reject proposal by random address
    it("Should refuse to reject redeem proposal by landlord", async () => {
        receipts = await createAndAccept(rEsc,accounts[0],accounts[1], 1000, "Hallo Welt")
        rentId = receipts[0]
        await expectRevert(rEsc.rejectRedeemProposal(rentId, {from: accounts[3]}),"Only tenant or landlord can accept redeem proposal")
   
    } )

    // testing resolver
    it("Should return contractId", async () => {
        receipts = await createAndAccept(rEsc,accounts[0],accounts[1], 999, "Bonjour Le Mond")
        
        rentId = receipts[0]
        console.log(rentId)
        receipt = await resolver.getNewContractToResolve()
        console.log(receipt.logs[0])
        rentId = parseEventValue(receipt, "sendTenant")
        console.log("Here should be Number");
        console.log(rentId);
        assert(rentId == 0)
        
    })

})