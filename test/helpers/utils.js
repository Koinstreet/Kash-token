const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

function isException(error) {
  let strError = error.toString();
  return (
    strError.includes("invalid opcode") ||
    strError.includes("invalid JUMP") ||
    strError.includes("revert")
  );
}

function ensuresException(error) {
  assert(isException(error), error.toString());
}

async function assertRevert(promise) {
  try {
    await promise;
    assert.fail("Expected revert not received");
  } catch (error) {
    const revertFound = error.message.search("revert") >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
}

module.exports = {
  should,
  ensuresException,
  assertRevert
};
