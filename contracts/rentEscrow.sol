pragma solidity ^0.8.10;

contract rentEscrow{

    struct rentContract {
        address tenant;
        address landlord;
        uint256 escrowValue;
        string contractDetail;
        string status;
    }

    mapping(uint => rentContract) public rentContractsMapping;
    // will use this to search contracts by address
    mapping(address => uint[]) public addressMapping;
    uint public nextRentId = 0;

    // Should go to some utils contract

    function updateAddressMapping (uint _rentId) internal {
        addressMapping[msg.sender].push(_rentId);
    }

    function getContractsByAddress () external view returns ( uint[] memory ){
    return addressMapping[msg.sender];

    }

    function proposeNewContract (uint256 _escrowValue, string memory _contractDetail) external {
        rentContract memory myRentContract;
     
        myRentContract.landlord = msg.sender;
        myRentContract.escrowValue = _escrowValue;
        myRentContract.contractDetail = _contractDetail;
        
        rentContractsMapping[nextRentId] = myRentContract; //Later: Change to nextId to hashed ID
        updateAddressMapping(nextRentId);
        nextRentId += 1;

    }

    function acceptNewContract (uint _rentId) external payable{
        require(msg.value == rentContractsMapping[_rentId].escrowValue, "Eth sent is not same as escrowValue");
        
        rentContractsMapping[_rentId].tenant = msg.sender;

        updateAddressMapping(_rentId);

    }
 

    function devGetBalance () external view returns(uint){
        return(address(this).balance);
    }
}