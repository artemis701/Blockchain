import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;