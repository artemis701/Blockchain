import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import { toast } from 'react-toastify';
import { fromWei, toWei } from '../utils';
const ts_contract_abi = require("./nft/contract-abi.json");
const gd_contract_abi = require("./nft/gd_contract-abi.json");

const CONFIG = {
    MAIN: {
        GD_CONTRACT: "0x495d133B938596C9984d462F007B676bDc57eCEC",
        GD_ABI: gd_contract_abi,
        TS_CONTRACT: "0x84618a9D4a4072290B3034449E74893D11D12a8C",
        TS_ABI: ts_contract_abi,
        NETWORK: {
            NAME: "FUSE Network",
            SYMBOL: "FUSE",
            ID: 122
        },
    },
    TEST: {
        GD_CONTRACT: "0x8141E1C89da7Fd9847512924E1d9edF1d49Ed37E",
        GD_ABI: gd_contract_abi,
        TS_CONTRACT: "0x525752B7948fA81F9c6CD9b8b9A7B1EdD393caCe",
        TS_ABI: ts_contract_abi,
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
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
    }
    try {
        window.contract = await new window.web3.eth.Contract(CONFIG.MAIN.TS_ABI, CONFIG.MAIN.TS_CONTRACT);
        window.gd_contract = await new window.web3.eth.Contract(CONFIG.MAIN.GD_ABI, CONFIG.MAIN.GD_CONTRACT);
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
        toast.error("Please change network to Fuse Network!");
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
        // let accounts = await web3.eth.getAccounts();
        // let accountBalance = await web3.eth.getBalance(accounts[0]);
        // accountBalance = web3.utils.fromWei(accountBalance);
        // return {
        //     success: true,
        //     account: accounts[0],
        //     balance: accountBalance
        // }

        let contract = new web3.eth.Contract(CONFIG.MAIN.GD_ABI, CONFIG.MAIN.GD_CONTRACT);
        let accounts = await web3.eth.getAccounts();
        let balance = await contract.methods.balanceOf(accounts[0]).call();
        balance = fromWei(balance);
        return {
            success: true,
            account: accounts[0],
            balance: balance
        }

    } catch (error) {
        return {
            success: false,
            result: "Transaction has been failed."
        }
    }
}

export const getCampaigns = async () => {
    var ret_data = [];
    try {
        var nCount = await window.contract.methods.totalCampaignCount().call();
        for (var i = 0; i < nCount; i++) {
            ret_data.push(await window.contract.methods.campaigns(i).call());
        }
    }
    catch (error) {
        console.log(error);
    }

    return ret_data;
}

export const getTweetStorm = async (id) => {
    try {
        let tweetStormInfo = await window.contract.methods.campaigns(id).call();
        return {
            success: true,
            ret_val: tweetStormInfo
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false
        }
    }
}

export const createTweetStormURI = async (file) => {
    const client = create('https://ipfs.infura.io:5001/api/v0')
    try {

        const added = await client.add(file)
        return {
            success: true,
            token_uri: added.path
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: "Uploading TweetStorm image has been failed."
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

export const approveGD = async (account, total_cost) => {
    let total_wei = toWei(total_cost.toString());
    try {
        await window.gd_contract.methods.approve(CONFIG.MAIN.TS_CONTRACT, total_wei).send({ from: account });
        let ret_allowance = await window.gd_contract.methods.allowance(account, CONFIG.MAIN.TS_CONTRACT).call();
        if (ret_allowance !== total_wei) {
            return {
                success: false,
                status: "Approve has been failed."
            }
        }
        return {
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: "Transaction has been failed."
        }
    }
}

export const addPromoter = async (avatarURI) => {
    try {
        let accounts = await window.web3.eth.getAccounts();
        if (accounts.length > 0) {
            await window.contract.methods.addPromoter(avatarURI).send({from: accounts[0]});
            return {
                success: true
            }
        } else {
            return {
                success:false
            }
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

export const getAvatar = async () => {
    try {
        let accounts = await window.web3.eth.getAccounts();
        if (accounts.length > 0) {
            let avatarUri = await window.contract.methods.promoters(accounts[0]).call();
            return avatarUri;
        }
        return '';
    } catch (error) {
        return '';
    }
}

export const addTweetStorm = async (account, tweetStormInfo, tweetStormURI) => {
    let hash_tags = '';
    if (tweetStormInfo.hash_tags.length > 0) {
        hash_tags = tweetStormInfo.hash_tags.join(',');
    }

    let reward = toWei(tweetStormInfo.reward);
    try {
        let ret_val = await window.contract.methods.addCampaign(tweetStormInfo.name,
            tweetStormInfo.url,
            tweetStormInfo.share_text,
            tweetStormInfo.username,
            hash_tags,
            reward,
            Number(tweetStormInfo.number),
            tweetStormInfo.start_date,
            Number(tweetStormInfo.duration),
            tweetStormURI).send({ from: account });
        return {
            success: true,
            status: ret_val
        };
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            status: "Transaction has been failed.",
        };
    }
}

export const submitTweet = async (tweetStormId, tweetUrl, signedPermit) => {
    try {
        const web3 = window.web3;
        let accounts = await web3.eth.getAccounts();
        let ret_val = await window.contract.methods.submitTweet(Number(tweetStormId), tweetUrl, signedPermit).send({from: accounts[0]});
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