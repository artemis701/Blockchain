import { 
    createAction as action, 
    createAsyncAction as asyncAction 
} from 'typesafe-actions';

export const getAuthorList = asyncAction(
    'nft/GET_AUTHOR_LIST',
    'nft/GET_AUTHOR_LIST_SUCCESS',
    'nft/GET_AUTHOR_LIST_FAIL'
)();

export const profileAvatar = asyncAction(
    'nft/GET_PROFILE_AVATAR',
    'nft/GET_PROFILE_AVATAR_SUCCESS',
    'nft/GET_PROFILE_AVATAR_FAIL'
)();

export const profileLoading = asyncAction(
    'nft/GET_PROFILE_LOADING',
    'nft/GET_PROFILE_LOADING_SUCCESS',
    'nft/GET_PROFILE_LOADING_FAIL'
)();

export const walletState = asyncAction(
    'nft/GET_CONNECT_WALLET',
    'nft/GET_CONNECT_WALLET_SUCCESS',
    'nft/GET_CONNECT_WALLET_FAIL'
)();

export const filterCategories = action('nft/FILTER_CATEGORIES')();
export const filterStatus = action('nft/FILTER_STATUS')();