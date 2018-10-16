pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "../KASHInterface.sol";


/**
 * @title AirDropperCore
 * @author Shadman Hossain - <shadman.hossain@protonmail.com>
 * @dev Contract for the KASH airdrop
 */
contract AirDropperCore is Ownable {
    using SafeMath for uint256;

    mapping (address => bool) public claimedAirdropTokens;

    uint256 public numOfCitizensWhoReceivedDrops;
    uint256 public tokenAmountPerUser;
    uint256 public airdropReceiversLimit;

    KASH Interface public kash;

    event TokenDrop(address indexed receiver, uint256 amount);

    /**
     * @dev Constructor for the airdrop contract
     * @param _airdropReceiversLimit Cap of airdrop receivers
     * @param _tokenAmountPerUser Number of tokens done per user
     * @param _kash KASH contract address
     */
    constructor(uint256 _airdropReceiversLimit, uint256 _tokenAmountPerUser, KASHInterface _kash) public {
        require(
            _airdropReceiversLimit != 0 &&
            _tokenAmountPerUser != 0 &&
            _kash != address(0),
            "constructor params cannot be empty"
        );
        airdropReceiversLimit = _airdropReceiversLimit;
        tokenAmountPerUser = _tokenAmountPerUser;
        kash = KASHInterface(_kash);
    }

    function triggerAirDrops(address[] recipients)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < recipients.length; i++) {
            triggerAirDrop(recipients[i]);
        }
    }

    /**
     * @dev Distributes tokens to recipient addresses
     * @param recipient address to receive airdropped token
     */
    function triggerAirDrop(address recipient)
        public
        onlyOwner
    {
        numOfCitizensWhoReceivedDrops = numOfCitizensWhoReceivedDrops.add(1);

        require(
            numOfCitizensWhoReceivedDrops <= airdropReceiversLimit &&
            !claimedAirdropTokens[recipient],
            "Cannot give more tokens than airdropShare and cannot airdrop to an address that already receive tokens"
        );

        claimedAirdropTokens[recipient] = true;

        // eligible citizens for airdrop receive tokenAmountPerUser in KASH
        sendTokensToUser(recipient, tokenAmountPerUser);
        emit TokenDrop(recipient, tokenAmountPerUser);
    }

    /**
     * @dev Can be overridden to add sendTokensToUser logic. The overriding function
     * should call super.sendTokensToUser() to ensure the chain is
     * executed entirely.
     * @param recipient Address to receive airdropped tokens
     * @param tokenAmount Number of rokens to receive
     */
    function sendTokensToUser(address recipient, uint256 tokenAmount) internal {
    }
}
