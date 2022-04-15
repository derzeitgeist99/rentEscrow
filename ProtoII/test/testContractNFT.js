const contractNFT = artifacts.require("contractNFT")
const { toBN,toNumber } = web3.utils;
const URIJSON = require("./metadataTest.json")
const {expectRevert} = require("@openzeppelin/test-helpers");

URIString = JSON.stringify(URIJSON)

// mint NFT function is internal. this test is in publoc mode
// contract("mintNFT", async accounts => {
//     let cNFT
    
//     before ( async () => {
//         cNFT = await contractNFT.new()
//     })

//     it("tokenCounter is 0", async () =>{
//         tokenCounter = toNumber(await cNFT.tokenCounter())
//         assert(tokenCounter === 0, "")
//     })

//     it("token Name is RentEscrowContractDefinition", async () =>{
//         tokenName = await cNFT.name()
//         assert(tokenName === "RentEscrowContractDefinition")
//     })

//     it("Sender has 1 token", async() => {
       
//         await cNFT.mintNFT(accounts[0],URIString)
//         owner = await cNFT.ownerOf(0)
//         assert(owner === accounts[0])
//         balance = toNumber(await cNFT.balanceOf(accounts[0]))
//         assert(balance === 1)

//     })

//     it("TokenURI is good", async() => {
//         result = JSON.parse(await cNFT.tokenURI(0))
//         assert(result.name === "Hello")
//     })

// }) 

contract("createContractNFT", async accounts => {
    let cNFT
    
    before ( async () => {
        cNFT = await contractNFT.new()
    })

    it("there is no token", async () =>{
        await expectRevert(cNFT.tokenURI(0),"VM Exception while processing transaction: revert ERC721URIStorage: URI query for nonexistent token")
    })

    it("creates 2 tokens", async () => {
        await cNFT.createContractTokens(accounts[0], accounts[1],URIString )

        balance = toNumber(await cNFT.balanceOf(accounts[0]))
        assert(balance === 1)

        balance = toNumber(await cNFT.balanceOf(accounts[1]))
        assert(balance === 1)

    })
}) 