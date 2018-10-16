pragma solidity 0.4.24;

import "./AirDropperCore.sol";


/**
 * @title MintableAirDropper
 * @author Shadman Hossain - <shadman.hossain@protonmail.com>
 * @dev Airdrop contract that mints KASH tokens
 */
contract MintableAirDropper is AirDropperCore {
    /**
     * @dev Constructor for the airdrop contract.
     * NOTE: airdrop must be the token owner in order to mint KASH tokens
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

    /**
     * @dev override sendTokensToUser logic
     * @param recipient Address to receive airdropped tokens
     * @param tokenAmount Number of rokens to receive
     */
    function sendTokensToUser(address recipient, uint256 tokenAmount) internal {
        kash.mint(recipient, tokenAmount);
        super.sendTokensToUser(recipient, tokenAmount);
    }

    /**
     * @dev Self-destructs contract
     */
    function kill(address newKashOwner) external onlyOwner {
        require(
            numOfCitizensWhoReceivedDrops >= airdropReceiversLimit,
            "only able to kill contract when numOfCitizensWhoReceivedDrops equals or is higher than airdropReceiversLimit"
        );

        kash.unpause();
        kash.transferOwnership(newKashOwner);
        selfdestruct(owner);
    }
}
