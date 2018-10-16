const { should, ensuresException } = require("./helpers/utils");
const TransferableAirDropper = artifacts.require(
  "./TransferableAirDropper.sol"
);
const KASH = artifacts.require("./KASH.sol");
const { assertRevert } = require("./helpers/utils");

const BigNumber = web3.BigNumber;

contract("TransferableAirDropper", ([owner, buyer, buyer2, buyer3]) => {
  let token, airdrop;
  const capOnAirdropReceivers = new BigNumber(100000);
  const airdropShare = new BigNumber(100000000e18);
  const tokenAmountPerAirDrop = new BigNumber(1000e18);

  describe("TransferableAirDropper contract", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await TransferableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

      await token.mint(airdrop.address, airdropShare);
      await token.unpause();
    });

    it("must not deploy when the air drop cap is null", async () => {
      try {
        airdrop = await TransferableAirDropper.new(
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

    it("cannot be triggered when contract has no token balance", async () => {
      airdrop = await TransferableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

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
      const tokenTmp = await KASH.new();
      const airdropTmp = await TransferableAirDropper.new(
        2,
        tokenAmountPerAirDrop,
        tokenTmp.address
      );
      await tokenTmp.mint(airdropTmp.address, tokenAmountPerAirDrop.mul(2));
      await tokenTmp.unpause();

      await airdropTmp.triggerAirDrop(buyer, {
        from: owner
      });
      await airdropTmp.triggerAirDrop(buyer2, {
        from: owner
      });
      const buyerBalance = await tokenTmp.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);

      const buyer2Balance = await tokenTmp.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(tokenAmountPerAirDrop);

      await assertRevert(
        airdropTmp.triggerAirDrop(buyer3, {
          from: owner
        })
      );
    });

    it("stops airdrop when uneven token amount was given", async () => {
      const tokenTmp = await KASH.new();
      const airdropTmp = await TransferableAirDropper.new(
        2,
        tokenAmountPerAirDrop,
        tokenTmp.address
      );
      await tokenTmp.mint(airdropTmp.address, tokenAmountPerAirDrop.mul(1.5));
      await tokenTmp.unpause();

      await airdropTmp.triggerAirDrop(buyer, {
        from: owner
      });
      await assertRevert(
        airdropTmp.triggerAirDrop(buyer2, {
          from: owner
        })
      );
      const buyerBalance = await tokenTmp.balanceOf(buyer);
      buyerBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);

      let buyer2Balance = await tokenTmp.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(0);
      await tokenTmp.mint(airdropTmp.address, tokenAmountPerAirDrop.mul(0.5));

      await airdropTmp.triggerAirDrop(buyer2, {
        from: owner
      });
      buyer2Balance = await tokenTmp.balanceOf(buyer2);
      buyer2Balance.should.be.bignumber.equal(tokenAmountPerAirDrop);
    });
  });

  describe("#triggerAirDrops", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await TransferableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

      await token.mint(airdrop.address, airdropShare);
      await token.unpause();
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

      const tokenTmp = await KASH.new();
      const airdropTmp = await TransferableAirDropper.new(
        2,
        tokenAmountPerAirDrop,
        tokenTmp.address
      );
      await tokenTmp.mint(airdropTmp.address, tokenAmountPerAirDrop.mul(2));
      await tokenTmp.unpause();

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

  describe("#emergencyDrainAirdrop", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await TransferableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

      await token.mint(airdrop.address, airdropShare);
      await token.unpause();
    });

    it("must be called only by owner", async () => {
      try {
        await airdrop.emergencyDrainAirdrop(10e18, {
          from: buyer
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }
      let ownerBalance = await token.balanceOf(owner);
      ownerBalance.should.be.bignumber.equal(0);
      // allow when owner calls function
      await airdrop.emergencyDrainAirdrop(10e18, {
        from: owner
      });
      ownerBalance = await token.balanceOf(owner);
      ownerBalance.should.be.bignumber.equal(10e18);
    });

    it("is callable when contract has token balance", async () => {
      airdrop = await TransferableAirDropper.new(
        capOnAirdropReceivers,
        tokenAmountPerAirDrop,
        token.address
      );

      try {
        await airdrop.emergencyDrainAirdrop(8e18, {
          from: owner
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }
      let ownerBalance = await token.balanceOf(owner);
      ownerBalance.should.be.bignumber.equal(0);
      // airdrop contract has tokens now
      await token.mint(airdrop.address, 8e18);
      await airdrop.emergencyDrainAirdrop(8e18, {
        from: owner
      });
      ownerBalance = await token.balanceOf(owner);
      ownerBalance.should.be.bignumber.equal(8e18);
    });
  });

  describe("#kill", () => {
    beforeEach(async () => {
      token = await KASH.new();
      airdrop = await TransferableAirDropper.new(
        2,
        tokenAmountPerAirDrop,
        token.address
      );

      await token.mint(airdrop.address, tokenAmountPerAirDrop.mul(3));
      await token.unpause();
    });

    it("must be called only by owner", async () => {
      await airdrop.triggerAirDrop(buyer, {
        from: owner
      });
      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });

      try {
        await airdrop.kill({
          from: buyer
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      let ownerTokenBalance = await token.balanceOf(owner);
      ownerTokenBalance.should.be.bignumber.equal(0);

      // allow when owner calls function
      await airdrop.kill({
        from: owner
      });

      ownerTokenBalance = await token.balanceOf(owner);
      ownerTokenBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);
    });

    it("is callable when cap on airdrop receivers is reached", async () => {
      await airdrop.triggerAirDrop(buyer, {
        from: owner
      });

      try {
        await airdrop.kill({
          from: owner
        });
        assert.fail();
      } catch (e) {
        ensuresException(e);
      }

      let ownerTokenBalance = await token.balanceOf(owner);
      ownerTokenBalance.should.be.bignumber.equal(0);

      await airdrop.triggerAirDrop(buyer2, {
        from: owner
      });

      // allow when owner calls function
      await airdrop.kill({
        from: owner
      });

      ownerTokenBalance = await token.balanceOf(owner);
      // ownerTokenBalance is airdropShare minus two airdrops of 3 eth
      ownerTokenBalance.should.be.bignumber.equal(tokenAmountPerAirDrop);
    });
  });
});
