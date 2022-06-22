// SPDX-License-Identifier:	CC-BY-4.0
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
        uint rentId;
        uint status;
        address [] judges;
        address [] judgesWhoVoted;
        address [] restrictedJudges;
        DisputeParty [2] disputeParty;
        string disputeDetail;
    }

    struct DisputeParty {
        address disputePartyAddress;
        string documentation;
        uint [] judgeVotes;
    }

    uint feePct = 10;

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
    mapping(address => bytes32 []) public AddressToCaseMapping;

    function getDisputeCase (bytes32 _disputeId) public view returns (DisputeCase memory) {

        return DisputeCaseMapping[_disputeId];
    }
    ///@notice Use this to get list of all your cases
    ///@dev One user can have multiple dispute cases. Therefore I need to coerce from storage to list. I don't know if there is more 
    //elegant way to do this
     function getMyDisputeCase () public view returns (DisputeCase [] memory) {
         bytes32 [] memory disputeCaseIds  = getMyDisputeCaseId();
        ///@custom:later I don't know exactly what I am doing here 
         DisputeCase [] memory disputeCaseList = new DisputeCase[](disputeCaseIds.length);
        
         for (uint i = 0; i < disputeCaseIds.length; i++) {
             disputeCaseList[i] = getDisputeCase(disputeCaseIds[i]);
         }
         return disputeCaseList;
     }

    ///@notice use this to get Ids for further query
    function getMyDisputeCaseId () public view returns (bytes32 [] memory _disputeCaseId) {
        return AddressToCaseMapping[msg.sender];
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
        newDisputeCase.rentId = rentContract.rentId;
        newDisputeCase.status = 100;
        newDisputeCase.disputeDetail = "Hello";

        ///@custom:later Seems ugly...
        DisputeParty memory disputeParty1 = DisputeParty({
            disputePartyAddress: rentContract.landlord,
            documentation: "",
            judgeVotes: new uint [](0)
        });

        DisputeParty memory disputeParty2 = DisputeParty({
            disputePartyAddress: rentContract.tenant,
            documentation: "",
            judgeVotes: new uint [](0)
        });

        newDisputeCase.disputeParty[0] = disputeParty1;
        newDisputeCase.disputeParty[1] = disputeParty2;

        ///@dev update mappping, so dispute parties can track their own dispute cases
        AddressToCaseMapping[rentContract.landlord].push(disputeId);
        AddressToCaseMapping[rentContract.tenant].push(disputeId);

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
        
        //@dev adding msg sender as a new judge and updating the mapping
        DisputeCaseMapping[caseWaitingForJudge.disputeId].judges.push(msg.sender);
        AddressToCaseMapping[msg.sender].push(DisputeCaseMapping[caseWaitingForJudge.disputeId].disputeId);
                
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

    ///@dev test to see if address can vote or if already voted
    function testJudgeEligibilityToVote (DisputeCase storage _disputeCase) internal view {

        ///@dev test if address is judge
        uint judgeCounter;
        for(uint i=0; i<_disputeCase.judges.length; i++){
            judgeCounter = msg.sender == _disputeCase.judges[i] ? judgeCounter+1:judgeCounter;
            }
        require(judgeCounter >0 ,"Address not a judge");

        //test if address already voted
        for(uint i=0; i<_disputeCase.judgesWhoVoted.length; i++){
            require(msg.sender!=_disputeCase.judgesWhoVoted[i], "Judge Already voted");
            }

    }

    function castVote(uint [2] memory _judgeVote, bytes32 _disputeId) external {
        require(_judgeVote[0] + _judgeVote[1] == 100, "Votes not 100");
        DisputeCase storage disputeCase = DisputeCaseMapping[_disputeId];
        testJudgeEligibilityToVote(disputeCase);

        ///@dev this is suboptimal as it relies on order of votes within array. Should be linked to disputeParty address
        
        disputeCase.disputeParty[0].judgeVotes.push(_judgeVote[0]);
        disputeCase.disputeParty[1].judgeVotes.push(_judgeVote[1]);
        disputeCase.judgesWhoVoted.push(msg.sender);

        ///@dev Test if all judges voted. If yes, trigger createRedeem proposal and release funds 
        if (disputeCase.disputeParty[0].judgeVotes.length == numberOfJudges &&
        disputeCase.disputeParty[1].judgeVotes.length == numberOfJudges) {
            triggerCreateRedeemProposal(_disputeId);
        }
    }

    
    
    function triggerCreateRedeemProposal(bytes32 _disputeId) public {
        uint [] memory result;
        ///@custom:later Which is better? This?
        result = aggregateJudgeVotes(_disputeId);
        result = rebaseVotesIncludeFee(feePct, result);
        //or this: result = rebaseVotesIncludeFee(feePct, aggregateJudgeVotes(_disputeId));

        
        rentEscrowInterface re = rentEscrowInterface(rentEscrowAddress);
        re.createRedeemProposal(
            DisputeCaseMapping[_disputeId].rentId,
            result[0],
            result[1],
            result[2]
        );
        re.acceptRedeemProposal(DisputeCaseMapping[_disputeId].rentId);
    }

    function aggregateJudgeVotes (bytes32 _disputeId) private view returns (uint [] memory) {
        DisputeCase storage disputeCase = DisputeCaseMapping[_disputeId];
        uint [] memory result = new uint[](disputeCase.disputeParty.length);
    

        for (uint i = 0; i<disputeCase.disputeParty.length; i++){
            uint cummulVotes = 0;
            for (uint j = 0; j < disputeCase.disputeParty[i].judgeVotes.length; j++){
                cummulVotes += disputeCase.disputeParty[i].judgeVotes[j];
            }
            result[i] = cummulVotes/disputeCase.disputeParty[i].judgeVotes.length;
            
        }
        return result;

    }
    ///@dev This rebases Votes to include share of fee, that get into Resolver contract
    ///@dev In case of 2 parties should return 3 values. 1 and 2, is share of dispute parties. 3 is fee share.
    function rebaseVotesIncludeFee (uint _feeShare, uint [] memory votes) private pure returns (uint [] memory) {
        uint [] memory result = new uint[](votes.length + 1);
        
        for (uint i = 0; i < votes.length; i++ ){
            result[i] = (votes[i]*(100-_feeShare))/100;
            
        }
        ///@custom:later This is dirty, but I dont know how to round properly and need the sum of result elements to be 100
        result[result.length - 1] = 100 - result[0] - result[1];
        return result;
    }

    receive() external payable {

    }

    }

