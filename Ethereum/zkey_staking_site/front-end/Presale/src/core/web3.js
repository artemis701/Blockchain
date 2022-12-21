import Web3 from 'web3';
import { Toast, toWei } from '../utils';
const contract_abi = require("./abi/contract-abi.json");

export const CONFIG = {
    MAIN: {
        CONTRACT: "0x64c690f718e3B2FbdF7e70F9A4C31B4fc8457C3C",
        ABI: contract_abi,
        NETWORK: {
            NAME: "BSC Network",
            SYMBOL: "BNB",
            ID: 43114
        },
    },
    TEST: {
        CONTRACT: "0x1359ABfe5abd56B14b7A0362AD504852A49aeCb3",
        ABI: contract_abi,
        NETWORK: {
            NAME: "Ropsten Test Network",
            SYMBOL: "ETH",
            ID: 3
        }
    }
}

export const loadWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        window.web3 = new Web3("https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        // window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
    }
    try {
        window.contract = await new window.web3.eth.Contract(CONFIG.TEST.ABI, CONFIG.TEST.CONTRACT);
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
    if (window.web3.utils.toHex(chainId) !== window.web3.utils.toHex(CONFIG.TEST.NETWORK.ID)) {
        Toast.fire({
            icon: 'warning',
            title: 'Please change network to BSC Network!'
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
    if (compareWalllet(CONFIG.TEST.CONTRACT, addr)) {
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

export const getZKEYprice = async () => {
    if (!window.contract) {
        window.contract = await new window.web3.eth.Contract(CONFIG.TEST.ABI, CONFIG.TEST.CONTRACT);
    }
    try {
        const price = await window.contract.methods.getOneTokenPrice().call();
        return {
            success: true,
            price
        }
    } catch (error) {
        return {
            success: false
        }
    }
}

export const buyZkeyTokens = async (tokenAmount, bnbPrice) => {
    let accounts = await window.web3.eth.getAccounts();
    if (accounts.length <= 0) {
        return {
            success: false,
            status: "Getting account has been failed."
        }
    }
   
    try {
        const value = toWei(bnbPrice);
        const tx_val = await window.contract.methods.buyTokens(tokenAmount).send({ from: accounts[0], value: value });
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