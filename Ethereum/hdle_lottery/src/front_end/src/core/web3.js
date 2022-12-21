import Web3 from 'web3';
import { Toast } from '../utils';
const contract_abi = require("./abi/contract-abi.json");

export const CONFIG = {
    MAIN: {
        CONTRACT: "0x64c690f718e3B2FbdF7e70F9A4C31B4fc8457C3C",
        ABI: contract_abi,
        NETWORK: {
            NAME: "Avalanche Network",
            SYMBOL: "AVAX",
            ID: 43114
        },
    },
    TEST: {
        CONTRACT: "0x77A142b75feFAC0c2a9B84031eB9987544F8A8a6",
        ABI: contract_abi,
        NETWORK: {
            NAME: "Avalanche Test Network",
            SYMBOL: "AVAX",
            ID: 43113
        }
    }
}

export const loadWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        window.web3 = new Web3("https://api.avax.network/ext/bc/C/rpc");
        // window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
    }
    try {
        window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
    } catch (error) {
        console.log(error);
        return;
    }
    window.ethereum.on('chainChanged', function (chainId) {
        checkNetwork(chainId);
    });
    window.web3.eth.getChainId().then((chainId) => {
        checkNetwork(chainId);
    })
};

export const checkNetwork = (chainId) => {
    if (window.web3.utils.toHex(chainId) !== window.web3.utils.toHex(CONFIG.MAIN.NETWORK.ID)) {
        Toast.fire({
            icon: 'warning',
            title: 'Please change network to Avalanche Network!'
        });
        return false;
    }
    return true;
}

export const connectWallet = async () => {
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
        try {
            var accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            var networkId = await ethereum.request({
                method: "net_version",
            });
            if (checkNetwork(networkId)) {
                return {
                    account: accounts[0],
                    status: true
                }
            }
        } catch (err) {
        }
    } else {
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
    return {
        status: false
    };
};

export const compareWalllet = (first, second) => {
    if (!first || !second) {
        return false;
    }
    if (first.toUpperCase() === second.toUpperCase()) {
        return true;
    }
    return false;
}

export const isContract = (addr) => {
    if (compareWalllet(CONFIG.MAIN.CONTRACT, addr)) {
        return true;
    } else {
        return false;
    }
}

export const getBalance = async () => {
    const web3 = window.web3;
    try {
        let accounts = await web3.eth.getAccounts();
        let accountBalance = await web3.eth.getBalance(accounts[0]);
        accountBalance = web3.utils.fromWei(accountBalance);
        return {
            success: true,
            account: accounts[0],
            balance: accountBalance
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const isOwner = async () => {
    if (!window.contract) {
        try {
            window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
        } catch (error) {
            console.log(error);
        }
    }
    const accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
       return false;
    }
    try {
        const owner = await window.contract.methods.owner().call();
        if (compareWalllet(accounts[0], owner)) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getWeeklyTicketPrice = async () => {
    if (!window.contract) {
        try {
            window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
        } catch (error) {
            console.log(error);
        }
    }
    try {
        const price = await window.contract.methods.getWeeklyTicketPrice().call();
        return {
            success: true,
            price,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const setWeeklyTicketPrice = async (nft_price) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    try {
        const amount = window.web3.utils.toWei(nft_price);
        const price = await window.contract.methods.setWeeklyTicketPrice(amount).send({ from: accounts[0] });
        return {
            success: true,
            price,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: error
        }
    }
}

export const getBiDailyTicketPrice = async () => {
    try {
        const price = await window.contract.methods.getBiDailyTicketPrice().call();
        return {
            success: true,
            price,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const setBiDailyTicketPrice = async (nft_price) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    try {
        const amount = window.web3.utils.toWei(nft_price);
        const price = await window.contract.methods.setBiDailyTicketPrice(amount).send({ from: accounts[0] });
        return {
            success: true,
            price,
        }
    } catch (error) {
        return {
            success: false,
            status: error
        }
    }
}

export const buyTicket = async (type, count, amount) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    let ticketID = 0;
    if (type === 0) {
        const result = await getLastWeeklyLotteryId();
        ticketID = result.last_weekly_lottery_id;
    } else {
        const result = await getLastDailyLotteryId();
        ticketID = result.last_daily_lottery_id;
    }
    try {
        const tx_val = await window.contract.methods.buyTicket(type, ticketID, count).send({ from: accounts[0], value: amount });
        return {
            success: true,
            result: tx_val
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: "Transaction has been failed."
        }
    }
}

export const getAccount = async () => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length > 0) {
        return {
            success: true,
            account: accounts[0]
        }
    } else {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
}

export const getLastWeeklyLotteryId = async () => {
    if (!window.contract) {
        try {
            window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
        } catch (error) {
            console.log(error);
        }
    }
    try {
        const weekly_lottery_counter = await window.contract.methods.weeklyLotteryCounter().call();
        let last_weekly_lottery_id = weekly_lottery_counter - 1;
        if (last_weekly_lottery_id < 0) last_weekly_lottery_id = 0;
        return {
            success: true,
            last_weekly_lottery_id,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getLastDailyLotteryId = async () => {
    try {
        const daily_lottery_counter = await window.contract.methods.biDailyLotteryCounter().call();
        let last_daily_lottery_id = daily_lottery_counter - 1;
        if (last_daily_lottery_id < 0) last_daily_lottery_id = 0;
        return {
            success: true,
            last_daily_lottery_id,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getMarketCap = async () => {
    if (!window.contract) {
        try {
            window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
        } catch (error) {
            console.log(error);
        }
    }
    try {
        const marketcap = await window.contract.methods.totalMarketcap().call();
        return {
            success: true,
            marketcap,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getTotalInvestment = async () => {
    try {
        const investment = await window.contract.methods.getTotalInvestment().call();
        return {
            success: true,
            investment,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getLotteryStatus = async (_ticketType) => {
    let _ticketID = 0;
    if (_ticketType === 0) {
        const result = await getLastWeeklyLotteryId();
        _ticketID = result.last_weekly_lottery_id;
    } else {
        const result = await getLastDailyLotteryId();
        _ticketID = result.last_daily_lottery_id;
    }
    try {
        const lotteryStatus = await window.contract.methods.getLotteryStatus(_ticketType, _ticketID).call();
        return {
            success: true,
            lotteryStatus,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getLotteryRemainTime = async (_ticketType) => {
    let _ticketID = 0;
    if (_ticketType === 0) {
        const result = await getLastWeeklyLotteryId();
        _ticketID = result.last_weekly_lottery_id;
    } else {
        const result = await getLastDailyLotteryId();
        _ticketID = result.last_daily_lottery_id;
    }
    try {
        const deadline = await window.contract.methods.getLotteryRemainTime(_ticketType, _ticketID).call();
        return {
            success: true,
            deadline,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const changeLotteryInfo = async (_type, _id, _status, _date) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    console.log('[Type] = ', _type, _id, _status, _date);
    try {
        const result = await window.contract.methods.changeLotteryInfo(_type, _id, _status, _date).send({ from: accounts[0]});
        return {
            success: true,
            result,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getLotteryWinners = async (_type) => {
    if (!window.contract) {
        try {
            window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.ABI, CONFIG.MAIN.CONTRACT);
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const result = await window.contract.methods.getAllLotteryWinners(_type).call();
        return {
            success: true,
            result,
        }
    } catch (error) {
        console.log (error);
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const givePriceToWinners = async (lotto_type, lotto_id) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    try {
        const result = await window.contract.methods.givePriceToWinner(Number(lotto_type), Number(lotto_id)).send({from: accounts[0]});
        return {
            success: true,
            result,
        }
    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const setTeamFundsAddress = async (addr) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
    try {
        const result = await window.contract.methods.setTeamFundsAddress(addr).send({from: accounts[0]});
        return {
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            success: false
        }
    }
}