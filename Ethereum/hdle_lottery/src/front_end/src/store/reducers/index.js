import { combineReducers } from 'redux';
import walletReducer from './wallet'

export const rootReducer = combineReducers({
  wallet: walletReducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;