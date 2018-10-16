pragma solidity 0.4.24;

import "./KASHInterface.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";


/**
 * @title KASH contract - ERC20 token contract.
 * @author Shadman Hossain - <shadman.hossain@protonmail.com>
 */
contract KASH is MintableToken, PausableToken {
    string public constant name = "Kash Token";
    string public constant symbol = "KASH";
    uint8 public constant decimals = 18;

    constructor() public {
        pause();
    }
}
