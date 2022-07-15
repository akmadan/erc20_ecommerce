// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract PaymentProcessor{

    address public admin;
    IERC20 public dai; // 1 dai is always 1usd

    event PaymentDone (
        address payer,
        uint amount,
        uint date,
        uint paymentID
    );

    constructor(address adminaddress, address daiaddress) public {

        admin = adminaddress;
        dai = IERC20(daiaddress);
    }

    function pay(uint amount, uint paymentID) external {
        dai.transferFrom(msg.sender, admin, amount);
        emit PaymentDone(msg.sender, amount, block.timestamp, paymentID);
    }



}