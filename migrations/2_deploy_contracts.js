var KashToken = artifacts.require('./KashToken.sol');
var KashDistribution = artifacts.require('./KashDistribution.sol');
module.exports = async (deployer, network) => {
  let _now = Date.now();
  let _fromNow = 60 * 5 * 1000; // Start distribution in 1 hour
  let _startTime = (_now + _fromNow) / 1000;
  await deployer.deploy(KashDistribution, _startTime);
  console.log(`
    ---------------------------------------------------------------
    --------- KOINSTREET (KASH) TOKEN SUCCESSFULLY DEPLOYED ---------
    ---------------------------------------------------------------
    - Contract address: ${KashDistribution.address}
    - Distribution starts in: ${_fromNow/1000/60} minutes
    - Local Time: ${new Date(_now + _fromNow)}
    ---------------------------------------------------------------
  `);
};