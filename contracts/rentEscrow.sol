// SPDX-License-Identifier:	CC-BY-4.0
pragma solidity ^0.8.10;

interface rentEscrowInterface { 

    struct RentContract {
            uint rentId;
            address tenant;
            address landlord;
            uint256 escrowValue;
            string contractDetail;
            uint status; ///@dev 100 Proposed; 200 Accepted by Tenant; 300 Redeem Proposal created; 310 Dispute Redeem; 400 Escrow Redeemed
            RedeemProposal redeemProposal;
        }

    struct RedeemProposal {
        uint tenantShare;
        uint landlordShare;
        uint feeShare;
        address feeAddress;
    }

    function getContractToResolve () external view returns (RentContract memory);
    function createRedeemProposal (uint _rentId, uint _tenantShare, uint _landlordShare, uint _feeShare ) external;
    function acceptRedeemProposal(uint _rentId) external;
    }

contract rentEscrow is rentEscrowInterface {
///@custom:navigation Events
    event sendAddressRent (address _message); 
    event sendStringRent (string _message); 
    event sendIdRent (uint _message); 
    ///@dev in order to give some feedback that rentcontract was created, we will emit its id. Later maybe be filled with some other
    event rentContractId (uint _rentId);

///@custom:navigation Mappings
    mapping(uint => RentContract) public rentContractsMapping;

    // will use this to search contracts by address
    mapping(address => uint[]) public addressMapping;
    uint public nextRentId = 0;


    ///@dev this contracf address is allowed to trigger redeem proposal creation
    mapping(string => address) public importantAddresses;
    mapping(string => string) public importantStrings;

    ///@dev sets
    function setResolverAddress (address _resolverAddress) public  {
        importantAddresses["ResolverAddress"] = _resolverAddress;
        importantStrings["ResolverAddress"] = "Hello";
    }
///@custom:navigation RentContracts
    function proposeNewContract (uint256 _escrowValue, string memory _contractDetail) external {
        RentContract memory myRentContract;
     
        myRentContract.rentId = nextRentId;
        myRentContract.landlord = msg.sender;
        myRentContract.escrowValue = _escrowValue;
        myRentContract.contractDetail = _contractDetail;
        myRentContract.status = 100;
        
        rentContractsMapping[nextRentId] = myRentContract; //Later: Change to nextId to hashed ID
        updateAddressMapping(nextRentId);
        emit rentContractId(nextRentId);
        
        nextRentId += 1;

    }

    function acceptNewContract (uint _rentId) external payable{
        require(msg.value == rentContractsMapping[_rentId].escrowValue, "Eth sent is not same as escrowValue");
        require(msg.sender != rentContractsMapping[_rentId].landlord, "Tenant and Landlord must not be same addresses");
        require(200 != rentContractsMapping[_rentId].status, "Contract already accepted");
        
        rentContractsMapping[_rentId].tenant = msg.sender;
        rentContractsMapping[_rentId].status = 200;

        updateAddressMapping(_rentId);

    }
///@custom:navigation Redeems
    function createRedeemProposal (uint _rentId, uint _tenantShare, uint _landlordShare, uint _feeShare ) external {
        
        uint shareSum = _tenantShare + _landlordShare + _feeShare;
        require(shareSum == 100, "TenantShare + Landlord Share + Fee Share is not 100%" );

        //only landlord or resolver can create redeemProposal
        // test required
        require(msg.sender ==  rentContractsMapping[_rentId].landlord || msg.sender == importantAddresses["ResolverAddress"] , "Only Landlord or Resolver can create redeem proposal");

        rentContractsMapping[_rentId].redeemProposal.tenantShare = _tenantShare;
        rentContractsMapping[_rentId].redeemProposal.landlordShare = _landlordShare;
        rentContractsMapping[_rentId].redeemProposal.feeShare = _feeShare;
        //Later: fee address must be protected
        rentContractsMapping[_rentId].redeemProposal.feeAddress = importantAddresses["ResolverAddress"];
        rentContractsMapping[_rentId].status = 300;
    
    }

    function acceptRedeemProposal(uint _rentId) external {
        //only tenant can accept redeemProposal
        // test required
        require(msg.sender ==  rentContractsMapping[_rentId].tenant || msg.sender == importantAddresses["ResolverAddress"],"Only tenant can accept redeem proposal");

        
        uint escrowValue = rentContractsMapping[_rentId].escrowValue;
        // send to tenant
        address payable tenantAddress = payable(rentContractsMapping[_rentId].tenant);
        uint escrowTenant = escrowValue * rentContractsMapping[_rentId].redeemProposal.tenantShare / 100;

         // send to landlord
        address payable landlordAddress = payable(rentContractsMapping[_rentId].landlord);
        uint escrowLandlord = escrowValue * rentContractsMapping[_rentId].redeemProposal.landlordShare / 100;

        // send to fee
        address payable feeAddress = payable(rentContractsMapping[_rentId].redeemProposal.feeAddress);
        uint fee = escrowValue * rentContractsMapping[_rentId].redeemProposal.feeShare / 100;

        //values to send must equal to escrowValue
        require((escrowTenant + escrowLandlord + fee) == escrowValue, "TenantShare + Landlord Share + Fee Share does not equal Escrow Value");

        // status must be 300 (proposed), to avoid double dip
        require(rentContractsMapping[_rentId].status == 300, "Escrow status must be 300");
        rentContractsMapping[_rentId].status = 400;

        //Later: would it make sense to stop any redemptions in case sum of individual escrows is below total balance ???
        
        //Sending
        tenantAddress.transfer(escrowTenant);
        landlordAddress.transfer(escrowLandlord);
        feeAddress.transfer(fee);    
    }

    ///@notice Use this function to reject redeem proposal. Will send it to the resolution centre
    ///@param _rentId identifies the contract between tenant and landlord

    function rejectRedeemProposal(uint _rentId) external {
        ///@dev UX has a say here, currently tenant and landlord can reject at any time
        require((msg.sender ==  rentContractsMapping[_rentId].tenant || msg.sender == rentContractsMapping[_rentId].landlord), "Only tenant or landlord can accept redeem proposal");
        
        require(rentContractsMapping[_rentId].status == 300, "Already rejected or accepted");

        rentContractsMapping[_rentId].status = 200;

        }

    function disputeRedeemProposal(uint _rentId) external {
        ///@dev UX has a say here, currently tenant and landlord can dispute at any time
        require((msg.sender ==  rentContractsMapping[_rentId].tenant || msg.sender == rentContractsMapping[_rentId].landlord), "Only tenant or landlord can accept redeem proposal");
        
        require(rentContractsMapping[_rentId].status == 300, "Already rejected or accepted");

        rentContractsMapping[_rentId].status = 310;

        }
 
///@custom:navigation Development Helpers
    function devGetBalance () external view returns(uint){
        return(address(this).balance);
    }
    ///@dev this is used by retrieve mapping by another contract
    ///@custom:later now gives just first contract. Need to add logic to return contract where redeemProposal was rejected
    function getContractToResolve () external view returns (RentContract memory) {
         uint _rentId = 1;
         return rentContractsMapping[_rentId];
        }
    
    ///@dev Should go to some utils contract
    function updateAddressMapping (uint _rentId) internal {
        addressMapping[msg.sender].push(_rentId);
        }

    ///@notice returns all contracts  where sender is involved party
    function getContractsByAddress () external view returns ( uint[] memory ){
    return addressMapping[msg.sender];

        }
    ///@notice returns RentContract
    function getContractDetails (uint _rentId) external view returns (RentContract memory) {
        return rentContractsMapping[_rentId];
    }
}