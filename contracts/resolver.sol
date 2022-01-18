pragma solidity ^0.8.10;
import "./rentEscrow.sol";

contract resolver is rentEscrow {
    event sendTenant (address _tenant);
    event sendMessage (string _message);

    function getContractToResolve (uint _rentId) public {
        address tenant;
        tenant = rentContractsMapping[_rentId].tenant;

        emit sendTenant (tenant);
        emit sendMessage ("Hallo");

    }
}