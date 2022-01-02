const rentEscrow = artifacts.require("rentEscrow");

//Later: need to make this ready for BigNumbers


contract("rentEscrow", async accounts => {
    let rEsc;

    before (async () =>{
        rEsc = await rentEscrow.new();
    })
    // let contractAddress = await rEsc.address
    // console.log(contractAddress)

    const getBalance = async () => {
        contractAddress = await rEsc.address
        const balance = await web3.eth.getBalance(contractAddress)
        return balance
    }

    it("should create rentContract from account 0", async () =>{
        
        await rEsc.proposeNewContract (1000, "HelloWorld")
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
        initialBalance = await getBalance()
        
        let contract
        contract = await rEsc.rentContractsMapping(0)
        escrowValue = contract.escrowValue.toNumber()
        await rEsc.acceptNewContract(0, {from: accounts[1], value: escrowValue})
        contract = await rEsc.rentContractsMapping(1)
        assert(contract.tenant,accounts[1])

        terminalBalance = await getBalance()

        assert(initialBalance + escrowValue,terminalBalance)

    })

    // it("Should create redeemAproval", async() => {
    //     await 
    // })


})