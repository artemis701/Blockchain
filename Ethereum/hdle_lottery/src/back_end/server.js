import express from 'express';
import cors from 'cors';
import Web3 from 'web3';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import forever from 'forever'

var app = express();
app.use(cors());

let rawdata = fs.readFileSync('abi.json');
let lotteryabi = JSON.parse(rawdata);

// create signer
var defaultWeb3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
let signer = defaultWeb3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
var web3 = new Web3(process.env.WSS_URL);

// create lottery contract
var lotteryContract = new defaultWeb3.eth.Contract(lotteryabi, process.env.LOTTERY_ADDRESS);

// lottery types
const LOTTERY_TYPE_WEEKLY = 0;
const LOTTERY_TYPE_BI_DAILY = 1;

// lottery status
const LOTTERY_STATUS_NONE = -1;
const LOTTERY_STATUS_START = 0;
const LOTTERY_STATUS_CLOSED = 1;
const LOTTERY_STATUS_PICKED = 2;

// functions has to be called per this times.
const SKIP_REMAIN_TIME = 5;
const SKIP_CREATE_TIME = 30;

// default gas price for sending transactions
const DEFAULT_GAS_PRICE = 100000000000;

// interval function has to be locked when other transaction occured
var LOCK_FUNCTION = false;

// current lottery infos
var weekly_info = { type: LOTTERY_TYPE_WEEKLY, index: 0, status: LOTTERY_STATUS_NONE, remain_time: 1000 * 60 * 60 };
var bi_daily_info = { type: LOTTERY_TYPE_BI_DAILY, index: 0, status: LOTTERY_STATUS_NONE, remain_time: 1000 * 60 * 60 };

var interval_index = 0;
setInterval(async () => {
    if (LOCK_FUNCTION)
        return;

    LOCK_FUNCTION = true;

    try {
        if (interval_index % SKIP_REMAIN_TIME == 0) {
            await get_remain_time(weekly_info);
            await get_remain_time(bi_daily_info);

            await select_winner(weekly_info);
            await select_winner(bi_daily_info);
        }
        if (interval_index % SKIP_CREATE_TIME == 0) {
            await create_lottery(weekly_info);
            await create_lottery(bi_daily_info);
        }
    }
    catch (e) {
        console.log(e);
        web3 = new Web3(process.env.WSS_URL);
    }

    interval_index ++;
    LOCK_FUNCTION = false;
}, 1000);

// get remain time of weekly and bi-daily lottery
const get_remain_time = async (_info) => {
    if (_info.status == LOTTERY_STATUS_START) {
        _info.remain_time = await lotteryContract.methods.getLotteryRemainTime(_info.type, _info.index).call();
    }
}

// when lottery is ended, back-end select winner
const select_winner = async (_info) => {
    if (_info.status == LOTTERY_STATUS_START || _info.status == LOTTERY_STATUS_CLOSED) {
        _info.status = (await lotteryContract.methods.getLotteryStatus(_info.type, _info.index).call())[0];
        if (_info.status == LOTTERY_STATUS_START && _info.remain_time <= 0) {
            console.log(_info.type, ' setLotteryStatus');
            var tx = await lotteryContract.methods.setLotteryStatus(_info.type, _info.index);
            await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);

            _info.status = (await lotteryContract.methods.getLotteryStatus(_info.type, _info.index).call())[0];
        }
        if (_info.status == LOTTERY_STATUS_CLOSED) {
            console.log(_info.type, ' selectWinner');
            var tx = await lotteryContract.methods.selectWinner(_info.type, _info.index);
            await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);

            _info.status = (await lotteryContract.methods.getLotteryStatus(_info.type, _info.index).call())[0];
        }
        // if (_info.status == LOTTERY_STATUS_PICKED) {
        //     console.log(_info.type, ' givePriceToWinner');
        //     var tx = await lotteryContract.methods.givePriceToWinner(_info.type, _info.index);
        //     await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);

        //     _info.status = (await lotteryContract.methods.getLotteryStatus(_info.type, _info.index).call())[0];
        // }
    }
}

// when back-end is running first and previous lottery chosen winner, back-end has to create new lottery
const create_lottery = async (_info) => {
    if (_info.type == LOTTERY_TYPE_WEEKLY) {
        _info.index = await lotteryContract.methods.weeklyLotteryCounter().call() - 1;
    }
    else {
        _info.index = await lotteryContract.methods.biDailyLotteryCounter().call() - 1;
    }

    if (_info.index < 0) {
        console.log(_info.type, ' createNewLotteryInfo');
        var tx = await lotteryContract.methods.createNewLotteryInfo(_info.type);
        await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);
        _info.index++;
        console.log(_info.type, ' createdNewLotteryInfo');
    }

    _info.status = (await lotteryContract.methods.getLotteryStatus(_info.type, _info.index).call())[0];
    if (_info.status >= LOTTERY_STATUS_PICKED) {
        console.log(_info.type, ' createNewLotteryInfo LOTTERY_STATUS_PICKED');
        var tx = await lotteryContract.methods.createNewLotteryInfo(_info.type);
        await sendTx(signer, tx, DEFAULT_GAS_PRICE, 0);
        _info.status = LOTTERY_STATUS_START;
        _info.index++;
    }
}

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