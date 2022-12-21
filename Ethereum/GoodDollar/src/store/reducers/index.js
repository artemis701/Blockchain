import { combineReducers } from 'redux';
import avatarReducer from './avatar';
import walletReducer from './wallet';

export const rootReducer = combineReducers({
  avatar: avatarReducer,
  wallet: walletReducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;