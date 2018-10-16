const { should, ensuresException } = require("./helpers/utils");
const MintableAirDropper = artifacts.require("./MintableAirDropper.sol");
const KASH = artifacts.require("./KASH.sol");
const { assertRevert } = require("./helpers/utils");

const BigNumber = web3.BigNumber;

contract("MintableAirDropper", ([owner, buyer, buyer2, buyer3]) => {
  let token, airdrop;
  const capOnAirdropReceivers = new BigNumber(100000);
  const tokenAmountPerAirDrop = new BigNumber(1000e18);
  const airdropShare = new BigNumber(100000000e18);

  describe("MintableAirDropper contract", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await MintableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

      capOnAirdropReceivers
        .mul(tokenAmountPerAirDrop)
        .should.be.bignumber.eq(airdropShare);
      await token.transferOwnership(airdrop.address);
    });

    it("must not deploy when the air drop cap is null", async () => {
      try {
        airdrop = await MintableAirDropper.new(
          0,
          tokenAmountPerAirDrop,
          token.address
        );
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }
    });

    it("must be called only by owner", async () => {
      try {
        await airdrop.triggerAirDrop(buyer, {
          from: buyer
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      let buyerBalance = await token.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(0);

      const buyer2Balance = await token.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(0);

      // allow when owner uses it
      await airdrop.triggerAirDrop(buyer, {
        from: owner
      });

      buyerBalance = await token.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);
    });

    it("does not give airdrop tokens twice to same user", async () => {
      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });

      let buyer2Balance = await token.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(tokenAmountPerAirDrop);

      try {
        // cannot get airdrop tokens twice. See that it has the same address twice in the array
        await airdrop.triggerAirDrop(buyer2, {
          from: owner
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      buyer2Balance = await token.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(tokenAmountPerAirDrop); // amount does not change
    });

    it("sends tokens to recipients", async () => {
      await airdrop.triggerAirDrop(buyer, {
        from: owner
      });
      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });

      const buyerBalance = await token.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);

      const buyer2Balance = await token.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(tokenAmountPerAirDrop);
    });

    it("logs TokenDrop event", async () => {
      const { logs } = await airdrop.triggerAirDrop(buyer, {
        from: owner
      });

      const event = logs.find(e => e.event === "TokenDrop");

      expect(event).to.exist;
    });

    it("cant airdrop when limit is reached", async () => {
      const oneEth = new BigNumber(1e18);
      const twoEth = new BigNumber(2e18);
      const tokenTmp = await KASH.new();
      const airdropTmp = await MintableAirDropper.new(
        2,
        oneEth,
        tokenTmp.address
      );

      await tokenTmp.transferOwnership(airdropTmp.address);
      await airdropTmp.triggerAirDrop(buyer, {
        from: owner
      });
      await airdropTmp.triggerAirDrop(buyer2, {
        from: owner
      });
      const buyerBalance = await tokenTmp.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(oneEth);

      const buyer2Balance = await tokenTmp.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(oneEth);

      await assertRevert(
        airdropTmp.triggerAirDrop(buyer3, {
          from: owner
        })
      );
    });
  });

  describe("#triggerAirDrops", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await MintableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );
      await token.transferOwnership(airdrop.address);
    });

    it("sends tokens to recipients", async () => {
      const buyers = [buyer, buyer2, buyer3];
      await airdrop.triggerAirDrops(buyers, {
        from: owner
      });
      let buyerBalance;
      for (index = 0; index < buyers.length; ++index) {
        buyerBalance = await token.balanceOf(buyers[index]);
        buyerBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);
      }
    });

    it("should NOT work with recipient that already received airdrop", async () => {
      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });
      const buyers = [buyer, buyer2, buyer3];
      await assertRevert(
        airdrop.triggerAirDrops(buyers, {
          from: owner
        })
      );
    });

    it("should NOT work with same recipient twice in recipients list", async () => {
      const buyers = [buyer, buyer2, buyer3, buyer];
      await assertRevert(
        airdrop.triggerAirDrops(buyers, {
          from: owner
        })
      );
    });

    it("must be called only by owner", async () => {
      const buyers = [buyer, buyer2, buyer3];
      await assertRevert(
        airdrop.triggerAirDrops(buyers, {
          from: buyer
        })
      );
    });

    it("cant airdrop when limit is reached", async () => {
      const buyers = [buyer, buyer2, buyer3];

      const oneEth = new BigNumber(1e18);
      const twoEth = new BigNumber(2e18);
      const tokenTmp = await KASH.new();
      const airdropTmp = await MintableAirDropper.new(
        2,
        oneEth,
        tokenTmp.address
      );

      await tokenTmp.transferOwnership(airdropTmp.address);

      await assertRevert(
        airdropTmp.triggerAirDrops(buyers, {
          from: owner
        })
      );
      const buyers2 = [buyer, buyer2];
      await airdropTmp.triggerAirDrops(buyers2, {
        from: owner
      });
      await assertRevert(
        airdropTmp.triggerAirDrop(buyer3, {
          from: owner
        })
      );
    });
  });

  describe("#kill", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await MintableAirDropper.new(
        2,
        tokenAmountPerAirDrop,
        token.address
      );

      await token.transferOwnership(airdrop.address);
    });

    it("must be called only by owner", async () => {
      await airdrop.triggerAirDrop(buyer, {
        from: owner
      });
      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });

      try {
        await airdrop.kill(owner, {
          from: buyer
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      let airdropOwner = await token.owner();
      airdropOwner.should.be.equal(airdrop.address);

      let isTokenPaused = await token.paused();
      isTokenPaused.should.be.true;

      // allow when owner calls function
      await airdrop.kill(owner, {
        from: owner
      });

      airdropOwner = await token.owner();
      airdropOwner.should.be.equal(owner);

      isTokenPaused = await token.paused();
      isTokenPaused.should.be.false;
    });

    it("is callable when cap on airdrop receivers is reached", async () => {
      await airdrop.triggerAirDrop(buyer, { from: owner });

      try {
        await airdrop.kill(owner, {
          from: owner
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      let airdropOwner = await token.owner();
      airdropOwner.should.be.equal(airdrop.address);

      let isTokenPaused = await token.paused();
      isTokenPaused.should.be.true;

      await airdrop.triggerAirDrop(buyer2, { from: owner });

      // allow when owner calls function
      await airdrop.kill(owner, {
        from: owner
      });

      airdropOwner = await token.owner();
      airdropOwner.should.be.equal(owner);

      isTokenPaused = await token.paused();
      isTokenPaused.should.be.false;
    });
  });
});
