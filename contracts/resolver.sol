pragma solidity ^0.8.10;
import "./rentEscrow.sol";

contract resolver is rentEscrow {
    //event sendTenant (uint _id);
    event sendMessage (string _message);
    event sendAddress (address _message);
    event sendId (uint _message);

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
        string disputeDetail;
    }


    ///@dev this is a flag to see if I need to reach for new DisputeCase or I just fill new address into existing one
    struct CaseWaitingForJudge {
        bool waiting;
        uint disputeId;
    } 

    CaseWaitingForJudge caseWaitingForJudge = CaseWaitingForJudge({waiting: false, disputeId: 0});

    ///@dev Number of judges needed for this contract
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
         emit sendAddress(rentEscrowAddress);
    }

    function getNewContractToResolve () public {
        uint id;
        rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
        id = re.getContractToResolve().rentId;  
        emit sendId(id) ;

        ///@custom:later I am calling the getContractToresolve each time I need a attribute. Which is retarded. Need to fix this.
        DisputeCase memory disputeCase = DisputeCase({
            disputeId: re.getContractToResolve().rentId,
            status: 100,
            judges: new address[](numberOfJudges),
            restrictedJudges: new address[](2),
            disputeDetail: re.getContractToResolve().contractDetail });

        ///@dev updating restricted judges. How can I do this in the intial call?
        disputeCase.restrictedJudges[0] = re.getContractToResolve().tenant;
        disputeCase.restrictedJudges[1] = re.getContractToResolve().landlord;
        
        DisputeCaseMapping[re.getContractToResolve().rentId] = disputeCase;

        caseWaitingForJudge.waiting = true;
        caseWaitingForJudge.disputeId = re.getContractToResolve().rentId;

    }
    /**@custom:later this currently misses couple of requirements. among others:
    - what if landlord should be judge?)
    - each judge must be unique id

     **/
    function assignJudge() public {
       
        if (caseWaitingForJudge.waiting == false) {
            getNewContractToResolve();
        }
        ///@custom:later I am shutting this off now for development reasons
        //require(testJudgeEligibility(DisputeCaseMapping[caseWaitingForJudge.disputeId]), "This address cannot be judge");

        DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.push(msg.sender);

        if (DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.length <= numberOfJudges) {
            caseWaitingForJudge.waiting = false;
        }
    }
    ///@custom:later is this a case for modifier?
    function testJudgeEligibility (DisputeCase memory _disputeCase) internal view returns (bool _eligible) {
        _eligible == true;

    ///@dev test if address is already judge
    for(uint i=0; i<_disputeCase.judges.length; i++){
            if(msg.sender == _disputeCase.judges[i]) {_eligible = false;}
        }
    ///@dev test if address is on the restricted list
    for(uint i=0; i<_disputeCase.restrictedJudges.length; i++){
            if(msg.sender == _disputeCase.restrictedJudges[i]) {_eligible = false;}
        }


    }


    }

    // function test() public {
    //     uint id;
    //     rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
    //     id = re.getContractToResolve().rentId;  
    //     emit sendId(id) ;

    //     ///@custom:later I am calling the getContractToresolve each time I need a attribute. Which is retarded. Need to fix this.
    //     DisputeCase memory disputeCase = DisputeCase({
    //         disputeId: re.getContractToResolve().rentId,
    //         status: 100,
    //         judges: new address[](numberOfJudges),
    //         disputeDetail: re.getContractToResolve().contractDetail });
        
    //     DisputeCaseMapping[re.getContractToResolve().rentId] = disputeCase;

    //     caseWaitingForJudge.waiting = true;
    //     caseWaitingForJudge.disputeId = re.getContractToResolve().rentId;

    // }
    