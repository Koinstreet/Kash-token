pragma solidity 0.4.24;

import "./AirDropperCore.sol";


/**
 * @title TransferableAirDropper
 * @author Shadman Hossain - <shadman.hossain@protonmail.com>
 * @dev Airdrop contract that transfer KASH tokens
 */
contract TransferableAirDropper is AirDropperCore {
    /**
     * @dev Constructor for the airdrop contract
     * @param _airdropReceiversLimit Cap of airdrop receivers
     * @param _tokenAmountPerUser Number of tokens done per user
     * @param _kash KASH contract address
     */
    constructor
        (
            uint256 _airdropReceiversLimit,
            uint256 _tokenAmountPerUser,
            KASHInterface _kash
        )
        public
        AirDropperCore(_airdropReceiversLimit, _tokenAmountPerUser, _kash)
    {}

    modifier hasBalance() {
        uint256 balance = kash.balanceOf(this);
        require(balance > 0, "contract must have a KASH balance");
        _;
    }

    /**
     * @dev override sendTokensToUser logic
     * @param recipient Address to receive airdropped tokens
     * @param tokenAmount Number of rokens to receive
     */
    function sendTokensToUser(address recipient, uint256 tokenAmount) internal {
        kash.transfer(recipient, tokenAmount);
        super.sendTokensToUser(recipient, tokenAmount);
    }

    /**
     * @dev Emergency transfer tokens to contract owner
     * @param amount Number of tokens to transfer
     */
    function emergencyDrainAirdrop(uint256 amount) external onlyOwner hasBalance {
        kash.transfer(owner, amount);
    }

    /**
     * @dev Self-destructs contract
     */
    function kill() external onlyOwner {
        require(
            numOfCitizensWhoReceivedDrops >= airdropReceiversLimit,
            "only able to kill contract when numOfCitizensWhoReceivedDrops equals or is higher than airdropReceiversLimit"
        );

        kash.transfer(owner, kash.balanceOf(this));
        selfdestruct(owner);
    }
}
