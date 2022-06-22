const keys = require("../gitignore/pinataKeys.json")
const fs = require("fs")
const pinataSDK = require('@pinata/sdk')
const pinata = pinataSDK(keys.APIKey,keys.APISecret);


export const testAuth = async () => {
    const result = await pinata.testAuthentication()
    return result
}



export const pinFile = async (filePath) => {
    
    const result = await pinata.pinFileToIPFS(filePath)
    return result

}

export const pinList = async () => {
    const result = pinata.pinList()
    return result
}


//module.exports = {pinFile,testAuth,pinList}