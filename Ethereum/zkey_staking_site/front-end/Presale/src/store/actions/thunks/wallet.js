import * as actions from '..';

export const setWalletState = (walletInfo) => async (dispatch) => {
  try {
    dispatch(actions.setWalletState.success(walletInfo));
  } catch (err) {
    dispatch(actions.setWalletState.failure(err));
  }
};

export const setRefreshState = (flag) => async (dispatch) => {
  try {
    dispatch(actions.setRefreshState.success(flag));
  } catch (err) {
    dispatch(actions.setRefreshState.failure(err));
  } 
}

export const setLotteryState = (value) => async (dispatch) => {
  try {
    dispatch(actions.setLotteryState.success(value));
  } catch (err) {
    dispatch(actions.setLotteryState.failure(err));
  }  
}