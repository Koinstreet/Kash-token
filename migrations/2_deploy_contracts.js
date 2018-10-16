const MintableAirDropper = artifacts.require("./MintableAirDropper.sol");
const KASH = artifacts.require("./KASH.sol");

const capOnAirdropReceivers = 100000;
const tokenAmountPerAirDrop = 1000e18;

module.exports = function(deployer) {
  return deployer
    .then(() => {
      return deployer.deploy(KASH);
    })
    .then(() => {
      return deployer.deploy(
        MintableAirDropper,
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        KASH.address
      );
    });
};
