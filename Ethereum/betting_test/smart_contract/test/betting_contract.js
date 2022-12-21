const BettingContract = artifacts.require("BettingContract");
const fs = require('fs');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('BettingContract', async accounts => {
  it("multiple betting", async () => {
    // token contract deploy
    let deployed_betting_contract = await BettingContract.deployed();

    // betting 10 times
    for (var i = 0; i < 10; i ++) {
      var ret = await deployed_betting_contract.bettngNow(i % 2, {from: accounts[0], value: 10 * 10 ** 15});
      console.log (ret);
    }
  });
});
