const assert = require("chai").assert
const {pinFile,testAuth,pinList} = require("../Utils/IPFS.js")
const mypath = "/Users/andy/my_repos/rentEscrow/ProtoI/client2/src/Utils/testpicture.jpeg"
const metadata = require("../Utils/metadataTest.json")


describe("Pinata Test", () =>{

it("should authenticate", async () => {
    result = await testAuth()
    assert.equal(result.authenticated,true)
})

it("Successfully pinned", async () => {

    result = await pinFile(mypath)
    console.log(result.PinSize);
    console.log(result.IpfsHash);
    assert(result.PinSize > 0)
    
})

it("resutrns pinList", async () => {
result = await pinList()
console.log(result)
})
})