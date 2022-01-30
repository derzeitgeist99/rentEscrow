pragma solidity ^0.8.10;
import "./rentEscrow.sol";

contract resolver is rentEscrow {
    ///@dev events for production
    event sendDisputeId(bytes32);
    //event sendTenant (uint _id);
    ///@dev events for development
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
        bytes32 disputeId;
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
        bytes32 disputeId;
    } 
    CaseWaitingForJudge caseWaitingForJudge;
    
    function UpdateCaseWaitingForJudge  (bool _waiting, bytes32 _disputeId) internal {
        caseWaitingForJudge.waiting = _waiting;
        caseWaitingForJudge.disputeId = _disputeId;
    }

    uint disputeIdNonce = 0;

    ///@dev Number of judges needed for this contract
    uint numberOfJudges = 3;
    ///@dev update number of judges.
    ///@custom:later should be admin only...
    function updateNumberOfJudges (uint _numberOfJudges) external {
        numberOfJudges = _numberOfJudges;
    }


    mapping(bytes32 =>DisputeCase) public DisputeCaseMapping;

    function getDisputeCase (bytes32 _disputeId) public view returns (DisputeCase memory _disputeCase) {
        return DisputeCaseMapping[_disputeId];
    }

    ///@dev to establish connection to other contract
    ///@custom:later  this works fine for single contract. I need this to be modular and can connect multiple contract on the fly
    
    function setRentEscrowAddress (address _rentEscrowAddress) public  {
        rentEscrowAddress = _rentEscrowAddress;
         emit sendAddress(rentEscrowAddress);
    }

    ///@notice requests new new dispute case from external contract. It is external contract job to send valid dispute case
    function getNewContractToResolve () public {

        rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
        RentContract memory rentContract = re.getContractToResolve();
             
        ///@dev I will create unique hash for every dispute case. This contract doesn't care if it resolves same rentCotnract multiple times. It is up to the rentContract to manage this
        ///@dev I have no special motivation to hash the id, other than to a) try it b) make it impossible to view
        bytes32 disputeId = keccak256(abi.encodePacked(rentContract.rentId + disputeIdNonce));
        disputeIdNonce++;
        
        ///@custom:later if I get this right, newDisputeCase is a pointer to a place in storage. If this function is called multiple times on same rentID (mapping key) data will be overwritten
        DisputeCase storage newDisputeCase = DisputeCaseMapping[disputeId];
        newDisputeCase.disputeId = disputeId;
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

        ///@dev updates flag for nex runs. Now we have a open case, but not enough judges. Therefore we dont need to ask for new disputes
        UpdateCaseWaitingForJudge(true,disputeId );

    }

    ///@notice Entry point for contract. Dispute lifecycle starts here by assigning judge to existing dispute or requesting new dispute from external contract
    function assignJudge() public {
        ///@dev decide if I am missing judges in existing dispute. If yes, this gets skipped, otherwise will ask for new resolution case
        if (caseWaitingForJudge.waiting == false) {
            getNewContractToResolve();
            }
        ///@custom:later I am shutting this off now for development reasons
        require(testJudgeEligibility(DisputeCaseMapping[caseWaitingForJudge.disputeId]), "This address cannot be judge");
        

        ///@dev emitting disputeId for future reference in front end
        emit sendDisputeId(DisputeCaseMapping[caseWaitingForJudge.disputeId].disputeId);
        
        //@dev adding msg sender as a new judge
        DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.push(msg.sender);
                
        ///@dev decide whether we have enough judges. if yes, nex assign judge will call getNewContractToResolve
        if (DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length >= numberOfJudges) {
            UpdateCaseWaitingForJudge(false, 0);
        }
    }
    ///@custom:later is this a case for modifier?
    ///@dev multiple tests to control who can be judge
    ///@dev we are on the conservative side and starting with default False. 
    ///@dev this seems extremely verbose, please shill me something more elegant
    function testJudgeEligibility (DisputeCase storage _disputeCase) internal view returns (bool _eligible) {
        uint judgeCount;
        uint disputePartyCount;

        ///@dev test if address is already judge. 
        for(uint i=0; i<_disputeCase.judges.length; i++){
            judgeCount = msg.sender == _disputeCase.judges[i] ? judgeCount+1:judgeCount;
            }
        ///@dev test if address is on the restricted list
        for(uint i=0; i<_disputeCase.disputeParty.length; i++){
            disputePartyCount = msg.sender == _disputeCase.disputeParty[i].disputePartyAddress ? disputePartyCount+1:disputePartyCount+0;
            }
        
        _eligible = judgeCount+disputePartyCount==0 ? true:false;

        }

    //function castVote (uint _disputeId)


    }

