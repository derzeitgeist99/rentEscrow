const RentEscrow = artifacts.require("rentEscrow");

module.exports = async function (deployer, _network) {
  //Needs edit, if I decide to use constructor
    await deployer.deploy(RentEscrow);
    //@custom:later for dev reasons I can add some dummy Rent contracts
};
