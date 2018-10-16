const KASH = artifacts.require('./KASH.sol');

const { should, ensuresException } = require('./helpers/utils');

contract('KASH', ([_, acct1]) => {
    let token;

    beforeEach(async () => {
        token = await KASH.new();
    });

    it('has a name', async () => {
        const name = await token.name();
        name.should.be.equal('Kash Token');
    });

    it('possesses a symbol', async () => {
        const symbol = await token.symbol();
        symbol.should.be.equal('KASH');
    });

    it('contains 18 decimals', async () => {
        const decimals = await token.decimals();
        decimals.should.be.bignumber.equal(18);
    });

    it('ztx transfer is paused', async () => {
        const paused = await token.paused();
        paused.should.be.true;

        try {
            await token.transfer(acct1, 1e18);
            assert.fail();
        } catch (error) {
            ensuresException(error);
        }
    });
});
