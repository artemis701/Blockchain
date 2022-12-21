import Web3 from 'web3';
import { toast } from 'react-toastify';
const ts_contract_abi = require("./nft/contract-abi.json");

const CONFIG = {
    MAIN: {
        TS_CONTRACT: "0x3D9Fa04a2Df849b7189E04aF515C0ce2d09Bd9d7",
        TS_ABI: ts_contract_abi,
        NETWORK: {
            NAME: "FUSE Network",
            SYMBOL: "FUSE",
            ID: 122
        },
    },
    TEST: {
        TS_CONTRACT: "0x6dF1dBa9C26c37fD820EEEE3a5F091aF514a9315",
        TS_ABI: ts_contract_abi,
        NETWORK: {
            NAME: "Rinkeby Test Network",
            SYMBOL: "ETH",
            ID: 4
        }
    }

}

export const loadWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
    }
    try {
        window.contract = await new window.web3.eth.Contract(CONFIG.TEST.TS_ABI, CONFIG.TEST.TS_CONTRACT);
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
        toast.error("Please change network to Rinkeby Network!");
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

export const bettingNow = async (coin_type, amount) => {
    try {
        const web3 = window.web3;
        const amountBalance = web3.utils.toWei(amount);
        const accounts = await web3.eth.getAccounts();
        console.log('Coin Type = ', coin_type, typeof coin_type);
        const transaction = await window.contract.methods.bettingNow(Number(coin_type)).send({from: accounts[0], value: amountBalance});
        const ret_val = transaction.events.BettngNow.returnValues[2];
        console.log('Ret = ', ret_val);
        return {
            success: true,
            status: ret_val
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: "Transaction has been failed.",
        };
    }
}