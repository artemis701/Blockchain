import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  walletState: initEntityState(null),
  refreshState: false,
  lotteryState: 0
};

const states = (state = defaultState, action) => {
  switch (action.type) {

    case getType(actions.setWalletState.request):
      return { ...state, walletState: entityLoadingStarted(state.walletState, action.payload) };
    case getType(actions.setWalletState.success):
      return { ...state, walletState: entityLoadingSucceeded(state.walletState, action.payload) };
    case getType(actions.setWalletState.failure):
      return { ...state, walletState: entityLoadingFailed(state.walletState) };

    case getType(actions.setRefreshState.request):
      return { ...state, refreshState: action.payload };
    case getType(actions.setRefreshState.success):
      return { ...state, refreshState: action.payload };
    case getType(actions.setRefreshState.failure):
      return { ...state, refreshState: entityLoadingFailed(state.refreshState) };

    case getType(actions.setLotteryState.request):
      return { ...state, lotteryState: action.payload };
    case getType(actions.setLotteryState.success):
      return { ...state, lotteryState: action.payload };
    case getType(actions.setLotteryState.failure):
      return { ...state, lotteryState: entityLoadingFailed(state.lotteryState) };

    default:
      return state;
  }
};

export default states;
