var erc20Token = artifacts.require("./erc20Token.sol");
// var SupplyChain = artifacts.require("./SupplyChain.sol");
var TweetStorm = artifacts.require("./TweetStorm.sol");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(erc20Token, 10000, "MGS Token", 2, "MGS");
    const inst = await erc20Token.deployed();
    // console.log("token: ", inst.address);

    await deployer.deploy(TweetStorm, inst.address, accounts[8]);
    const inst2 = await TweetStorm.deployed();
    // console.log("tweet storm", inst2.address);
};