import { combineReducers } from 'redux';
import dexReducer from './dex';

export const reducers = combineReducers({
  dex: dexReducer
});

// const reducers = (state: any, action: any) => rootReducer(state, action);

export default reducers;
