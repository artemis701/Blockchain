//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BettingContract is Ownable {
    // private seed data for claculating picked number
    uint256 private             pri_seedValue;
    string private              pri_seedString;
    address private             pri_seedAddress;

    // distribution percentage of funds
    uint256                     REWARD_MULTI_VALUE           = 2;                        // goes to user 2 times

    // all events
    event Received (address, uint);
    event Fallback (address, uint);
    event SetFundsMultipleValue (uint256);    
    event LogAllSeedValueChanged (address, uint256, uint256, string, address);
    event BettngNow(address, uint256, bool);

    // contructor
    constructor (
        uint256 _seedValue,
        string memory _seedString,
        address _seedAddress
     )
    {
        pri_seedValue = _seedValue;
        pri_seedString = _seedString;
        pri_seedAddress = _seedAddress;
    }

    // this function is needed for receiving native coin
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable { 
        emit Fallback(msg.sender, msg.value);
    }

    // owner can set times of rewards
    function setFundsMultipleValue (uint256 _value) external onlyOwner {
        REWARD_MULTI_VALUE = _value;
        emit SetFundsMultipleValue (_value);
    }

    function getFundsMultipleValue () external view returns (uint256) {
        return REWARD_MULTI_VALUE;
    }

    // user input expected betting value
    // user has to pay ETH he/she wants.
    // if user win, user can receive 2 times of bet
    // if user failed, user can't receive anything.
    function bettngNow(uint16 _reqBet) external payable returns (bool) {
        // generate result
        uint16 result_bet = randomNumberGenerate();

        // check funds of contract
        require(msg.value > 0, "no input balance");
        require(address(this).balance >= msg.value * REWARD_MULTI_VALUE, "no funds in contract");
        
        // win
        bool ret = false;
        if (result_bet == _reqBet) {
            payable(address(msg.sender)).transfer(msg.value * REWARD_MULTI_VALUE);
            ret = true;
        }

        emit BettngNow (msg.sender, msg.value, ret);
        return ret;
    }
    
    // Generate random number base on seed and timestamp.
    function randomNumberGenerate() private view returns (uint16) {
        // random hash from seed data
        uint randomHash = uint(keccak256(abi.encodePacked(pri_seedValue, pri_seedString, pri_seedAddress, 
                                        block.timestamp, block.difficulty, block.number)));
        return uint16(randomHash % 2);
    }

    // only user can change seed data
    function updateSeeds(uint256 _seedValue, string memory _seedString, address _seedAddress ) external onlyOwner returns(bool) {
        // seed value check
        require(_seedValue != 0 && _seedValue != pri_seedValue, 
            "The seed value can't be 0 value and can't be the same as the previous one.");

        // seed address check
        require(_seedAddress != address(0) && _seedAddress != pri_seedAddress, 
            "The seed Address can't be 0 Address and can't be the same as the previous one.");

        // seed string check
        require(keccak256(abi.encodePacked(_seedString)) != 0 && 
            keccak256(abi.encodePacked(_seedString)) != keccak256(abi.encodePacked(pri_seedString)), 
            "The seed String can't be 0 String and can't be the same as the previous one.");

        emit LogAllSeedValueChanged(msg.sender, block.timestamp, _seedValue, _seedString, _seedAddress);

        // update seed data
        pri_seedValue = _seedValue;
        pri_seedString = _seedString;
        pri_seedAddress = _seedAddress;

        return true;
    }
}