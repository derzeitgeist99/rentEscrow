pragma solidity ^0.8.10;

contract rentEscrow{

    struct rentContract {
        address tenant;
        address landlord;
        uint256 escrowValue;
        string contractDetail;
        string status;
        redeemProposal redeemProposal;
    }

    struct redeemProposal {
        uint tenantShare;
        uint landlordShare;
        uint feeShare;
        address feeAddress;
        uint proposalStatus; /// @dev 100 Proposed 200 Redeemed by tenant 202 Redemed via Dispute Resolution 301 rejected by landlord 302 rejected by tenant
    }

    mapping(uint => rentContract) public rentContractsMapping;

    // will use this to search contracts by address
    mapping(address => uint[]) public addressMapping;
    uint public nextRentId = 0;

    ///@dev in order to give some feedback that rentcontract was created, we will emit its id. Later maybe be filled with some other
    event rentContractId (uint _rentId);
    event rentContractId2 (uint _rentId);

    ///@dev Should go to some utils contract

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
        emit rentContractId(nextRentId);
        
        nextRentId += 1;

    }

    function acceptNewContract (uint _rentId) external payable{
        require(msg.value == rentContractsMapping[_rentId].escrowValue, "Eth sent is not same as escrowValue");
        
        rentContractsMapping[_rentId].tenant = msg.sender;

        updateAddressMapping(_rentId);

    }

    function createRedeemProposal (uint _rentId, uint _tenantShare, uint _landlordShare, uint _feeShare, address _feeAddress  ) external {
        
        uint shareSum = _tenantShare + _landlordShare + _feeShare;
        require(shareSum == 100, "TenantShare + Landlord Share + Fee Share is not 100%" );

        //only landlord can create redeemProposal
        // test required
        require(msg.sender ==  rentContractsMapping[_rentId].landlord, "Only Landlord can create redeem proposal");

        rentContractsMapping[_rentId].redeemProposal.tenantShare = _tenantShare;
        rentContractsMapping[_rentId].redeemProposal.landlordShare = _landlordShare;
        rentContractsMapping[_rentId].redeemProposal.feeShare = _feeShare;
        //Later: fee address must be protected
        rentContractsMapping[_rentId].redeemProposal.feeAddress = _feeAddress;
        rentContractsMapping[_rentId].redeemProposal.proposalStatus = 100;
    
    }

    function acceptRedeemProposal(uint _rentId) external {
        //only tenant can accept redeemProposal
        // test required
        require(msg.sender ==  rentContractsMapping[_rentId].tenant,"Only tenant can accept redeem proposal");

        
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

        // status must be 100 (proposed), to avoid double dip
        require(rentContractsMapping[_rentId].redeemProposal.proposalStatus == 100, "Escrow has been alread redeemed.");
        rentContractsMapping[_rentId].redeemProposal.proposalStatus = 200;

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
        
        ///@custom:later probably better to re-write to allowed statuses
        require(
            rentContractsMapping[_rentId].redeemProposal.proposalStatus != 301 &&
            rentContractsMapping[_rentId].redeemProposal.proposalStatus != 302,"Already rejected");
        require(rentContractsMapping[_rentId].redeemProposal.proposalStatus != (200),"Already accepted" );

        if(msg.sender == rentContractsMapping[_rentId].landlord) {
            rentContractsMapping[_rentId].redeemProposal.proposalStatus = 301;
        }
        else if (msg.sender == rentContractsMapping[_rentId].tenant){
             rentContractsMapping[_rentId].redeemProposal.proposalStatus = 302;

        }

    }
 

    function devGetBalance () external view returns(uint){
        return(address(this).balance);
    }
}