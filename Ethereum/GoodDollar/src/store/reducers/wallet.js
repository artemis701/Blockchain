import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  walletState: initEntityState(null),
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.walletState.request):
      return { ...state, walletState: entityLoadingStarted(state.walletState, action.payload) };
    case getType(actions.walletState.success):
      return { ...state, walletState: entityLoadingSucceeded(state.walletState, action.payload) };
    case getType(actions.walletState.failure):
      return { ...state, walletState: entityLoadingFailed(state.walletState) };

      default:
      return state;
  }
};

export default states;
