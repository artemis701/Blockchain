import express from 'express';
import cors from 'cors';
import Web3 from 'web3';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

var app = express();
app.use(cors());

let rawdata = fs.readFileSync('abi.json');
let astroABI = JSON.parse(rawdata);

// create signer
var defaultWeb3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
let signer = defaultWeb3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
var web3 = new Web3(process.env.WSS_URL);

// create astro contract
var astroContract = new defaultWeb3.eth.Contract(astroABI, process.env.LOTTERY_ADDRESS);

// default gas price for sending transactions
const DEFAULT_GAS_PRICE = 100000000000;

// interval function has to be locked when other transaction occured
var LOCK_FUNCTION = false;

var interval_index = 0;
setInterval(async () => {
    if (LOCK_FUNCTION)
        return;

    LOCK_FUNCTION = true;

    try {
        let shRebase = astroContract.methods.shouldRebase().call();
        let atRebase = astroContract.methods.autoRebase().call();
        if (shRebase && atRebase) {
            var tx = await lotteryContract.methods.manualRebase();
            await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);
        }
    }
    catch (e) {
        console.log(e);
        web3 = new Web3(process.env.WSS_URL);
    }

    interval_index ++;
    LOCK_FUNCTION = false;
}, 30000);

const sendTx = async (account, tx, gasPrice, value) => {
    var gas = 21000000;
    const data = tx.encodeABI();
    let gasFee = await tx.estimateGas({ from: signer.address });
    var nonce = await web3.eth.getTransactionCount(signer.address);
    nonce = web3.utils.toHex(nonce);

    const option = {
        from: account.address,
        to: tx._parent._address,
        data: data,
        nonce,
        gas: web3.utils.toHex(parseInt(gasFee * 1.5)),
        gasPrice: web3.utils.toHex(gasPrice),
        chain: await web3.eth.getChainId(),
        hardfork: 'berlin',
        value
    };

    const signedTx = await web3.eth.accounts.signTransaction(option, account.privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// node server running
app.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});