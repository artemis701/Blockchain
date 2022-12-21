var BettingContract = artifacts.require("./betting_contract.sol");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(BettingContract, 123456, "seedstring", "0x64Fa48f3e1e58D072834cA341aC296cf2FA354C7");
    const inst = await BettingContract.deployed();
};