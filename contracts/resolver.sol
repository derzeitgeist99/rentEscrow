pragma solidity ^0.8.10;
import "./rentEscrow.sol";

contract resolver is rentEscrow {
    //event sendTenant (uint _id);
    event sendMessage (string _message);
    event sendAddress (address _message);
    event sendId (uint _message);
    event sendStruct (rentEscrow _rentEscrow);
    event sendBool (bool _bool);

    address rentEscrowAddress;

    ///@param id case identifier. Currently same as rentContract. 
    ///@param status status of the case. 100: waiting for judge 200: waiting for resolution 300: resolved
    ///@param judges addreses that are assigned to resolve the dispute
    ///@param restrictedJudges addresses that cannot be assigned as judge (among others: tenant, landlord)
    ///@param disputeDetail  bears details about the case. Currenly a placeholder aim is to link this to some IPFS file
    ///@param partialResult contains voting of each judge
    ///@param finalResult contains final result after each judge casted their vote
    
    struct DisputeCase {
        uint disputeId;
        uint status;
        address [] judges;
        address [] restrictedJudges;
        DisputeParty [2] disputeParty;
        string disputeDetail;
    }

    struct DisputeParty {
        address disputePartyAddress;
        string documentation;
        uint [] judgeVotes;
    }


    ///@dev this is a flag to see if I need to reach for new DisputeCase or I just fill new address into existing one
    struct CaseWaitingForJudge {
        bool waiting;
        uint disputeId;
    } 
    CaseWaitingForJudge caseWaitingForJudge;
    
    function UpdateCaseWaitingForJudge  (bool _waiting, uint _disputeId) internal {
        caseWaitingForJudge.waiting = _waiting;
        caseWaitingForJudge.disputeId = _disputeId;
    }

    ///@dev Number of judges needed for this contract
    uint numberOfJudges = 3;
    ///@dev update number of judges.
    ///@custom:later should be admin only...
    function updateNumberOfJudges (uint _numberOfJudges) external {
        numberOfJudges = _numberOfJudges;
    }


    mapping(uint =>DisputeCase) public DisputeCaseMapping;

    function getDisputeCase (uint _disputeId) public view returns (DisputeCase memory _disputeCase) {
        return DisputeCaseMapping[_disputeId];
    }

    ///@dev to establish connection to other contract
    ///@custom:later  this works fine for single contract. I need this to be modular and can connect multiple contract on the fly
    
    function setRentEscrowAddress (address _rentEscrowAddress) public  {
        rentEscrowAddress = _rentEscrowAddress;
         emit sendAddress(rentEscrowAddress);
    }

    function getNewContractToResolve () public {
         emit sendMessage("Starting NewContractToResolve");
        rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
        
        RentContract memory rentContract = re.getContractToResolve();
        
        ///@dev what if that particular rent Id already exists?
        ///@custom:later if I get this right, newDisputeCase is a pointer to a place in storage. If this function is called multiple times on same rentID (mapping key) data will be overwritten
        DisputeCase storage newDisputeCase = DisputeCaseMapping[rentContract.rentId];
        newDisputeCase.disputeId = rentContract.rentId;
        newDisputeCase.status = 100;
        newDisputeCase.disputeDetail = "Hello";

        ///@custom:later Seems ugly...
        DisputeParty memory disputeParty1 = DisputeParty({
            disputePartyAddress: rentContract.landlord,
            documentation: "",
            judgeVotes: new uint [](numberOfJudges)
        });

        DisputeParty memory disputeParty2 = DisputeParty({
            disputePartyAddress: rentContract.tenant,
            documentation: "",
            judgeVotes: new uint [](numberOfJudges)
        });

        newDisputeCase.disputeParty[0] = disputeParty1;
        newDisputeCase.disputeParty[1] = disputeParty2;

        UpdateCaseWaitingForJudge(true,rentContract.rentId );

    }

    function assignJudge() public {
        emit sendMessage("Starting Assign Judge");
        //emit sendBool(caseWaitingForJudge.waiting);
        //emit sendBool(waiting);
       
        if (caseWaitingForJudge.waiting == false) {
            emit sendMessage("Nothing is waiting");
            getNewContractToResolve();
        }
        ///@custom:later I am shutting this off now for development reasons
        //require(testJudgeEligibility(DisputeCaseMapping[caseWaitingForJudge.disputeId]), "This address cannot be judge");
         emit sendMessage("Will asign judge now");
        DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.push(msg.sender);
        emit sendId(DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length);
        
        for (uint i = 0; i< DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length; i++ )
            {emit sendAddress(DisputeCaseMapping[caseWaitingForJudge.disputeId].judges[i]);}
        
        

        if (DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length >= numberOfJudges) {
            emit sendMessage("enough judges");
            emit sendId(DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length);
            UpdateCaseWaitingForJudge(false, 0);
        }
    }
    ///@custom:later is this a case for modifier?
    function testJudgeEligibility (DisputeCase storage _disputeCase) internal view returns (bool _eligible) {
         _eligible == true;

        ///@dev test if address is already judge
        ///@custom:later this wasn't tested
        for(uint i=0; i<_disputeCase.judges.length; i++){
                if(msg.sender == _disputeCase.judges[i]) {_eligible = false;}
            }
        ///@dev test if address is on the restricted list
        for(uint i=0; i<_disputeCase.disputeParty.length; i++){
                if(msg.sender == _disputeCase.disputeParty[i].disputePartyAddress) {_eligible = false;}
            }

        }

    //function castVote (uint _disputeId)


    }

