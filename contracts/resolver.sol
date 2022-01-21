pragma solidity ^0.8.10;
import "./rentEscrow.sol";

contract resolver is rentEscrow {
    //event sendTenant (uint _id);
    //event sendMessage (address _message);

    address rentEscrowAddress;

    ///@param id case identifier. Currently same as rentContract. 
    ///@param status status of the case. 100: waiting for judge 200: waiting for resolution 300: resolved
    ///@param judges addreses that are assigned to resolve the dispute
    ///@param disputeDetail  bears details about the case. Currenly a placeholder aim is to link this to some IPFS file
    ///@param partialResult contains voting of each judge
    ///@param finalResult contains final result after each judge casted their vote
    
    struct DisputeCase {
        uint disputeId;
        uint status;
        address [] judges;
        string disputeDetail;
    }


    ///@dev this is a flag to see if I need to reach for new DisputeCase or I just fill new address into existing one
    struct CaseWaitingForJudge {
        bool waiting;
        uint disputeId;
    } 

    CaseWaitingForJudge caseWaitingForJudge = CaseWaitingForJudge({waiting: false, disputeId: 0});

    ///@param Number of judges needed for this contract
    uint numberOfJudges = 3;
    ///@dev update number of judges.
    ///@custom:later should be admin only...
    function updateNumberOfJudges (uint _numberOfJudges) external {
        numberOfJudges = _numberOfJudges;
    }


    mapping(uint =>DisputeCase) DisputeCaseMapping;

    ///@dev to establish connection to other contract
    ///@custom:later  this works fine for single contract. I need this to be modular and can connect multiple contract on the fly
    
    function setRentEscrowAddress (address _rentEscrowAddress) public  {
        rentEscrowAddress = _rentEscrowAddress;
    }

    function getNewContractToResolve () public {
        uint id;
        rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
        id = re.getContractToResolve().rentId;    

        address [] memory _judges;
        _judges[0] = msg.sender;

        ///@custom:later I am calling the getContractToresolve each time I need a attribute. Which is retarded. Need to fix this.
        DisputeCase memory disputeCase = DisputeCase({
            disputeId: re.getContractToResolve().rentId,
            status: 100,
            judges: _judges,
            disputeDetail: re.getContractToResolve().contractDetail });
        
        DisputeCaseMapping[re.getContractToResolve().rentId] = disputeCase;

        caseWaitingForJudge.waiting = true;
        caseWaitingForJudge.disputeId = re.getContractToResolve().rentId;

    }

    function assignJudge() public {
        if (caseWaitingForJudge.waiting == false) {
            getNewContractToResolve();
        }

        DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.push(msg.sender);

        if (DisputeCaseMapping[caseWaitingForJudge.disputeId].judges <= numberOfJudges) {
            caseWaitingForJudge.waiting = false;
        }


    }

}