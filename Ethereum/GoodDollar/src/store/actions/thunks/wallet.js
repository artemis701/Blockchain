import * as actions from '..';

export const fetchWalletState = (state) => async (dispatch) => {
  try {
    dispatch(actions.walletState.success(state));
  } catch (err) {
    console.log(err);
    dispatch(actions.walletState.failure(err));
  }
};