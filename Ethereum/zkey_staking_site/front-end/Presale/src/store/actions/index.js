import { 
    createAsyncAction as asyncAction 
} from 'typesafe-actions';

export const setWalletState = asyncAction(
    'nft/SET_WALLETSTATE',
    'nft/SET_WALLETSTATE_SUCCESS',
    'nft/SET_WALLETSTATE_FAIL'
)();

export const setRefreshState = asyncAction(
    'nft/SET_REFRESHSTATE',
    'nft/SET_REFRESHSTATE_SUCCESS',
    'nft/SET_REFRESHSTATE_FAIL'
)();

export const setLotteryState = asyncAction(
    'nft/SET_LOTTERYSTATE',
    'nft/SET_LOTTERYSTATE_SUCCESS',
    'nft/SET_LOTTERYSTATE_FAIL'
)();