// SPDX-License-Identifier:	CC-BY-4.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract contractNFT is ERC721URIStorage{

    event tokenURI(string);

    uint256 public tokenCounter;

    constructor() ERC721("RentEscrowContractDefinition","RE/CD") {
        tokenCounter = 0;
    }
function mintNFT (address _recipientAddress,string memory _tokenURI) internal {
    uint256 newTokenID = tokenCounter;
    _safeMint(_recipientAddress, newTokenID);
    _setTokenURI(newTokenID, _tokenURI);
    tokenCounter ++;

}

function createContractTokens(address _tenant, address _landlord, string memory _tokenURI) public {
    // I will mint one for tenant
    mintNFT(_tenant,_tokenURI);

    // I will mint one for landlord
    mintNFT(_landlord,_tokenURI);

 }

 function emitURI(uint256 _tokenID) external view {
     array[] storage thisTokenURI;
     thisTokenURI = tokenURI(_tokenID);
     emit tokenURI(thisTokenURI);

 }
}

