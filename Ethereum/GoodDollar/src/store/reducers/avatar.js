import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  profileAvatar: initEntityState(null),
  profileLoading: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.profileAvatar.request):
      return { ...state, profileAvatar: entityLoadingStarted(state.profileAvatar, action.payload) };
    case getType(actions.profileAvatar.success):
      return { ...state, profileAvatar: entityLoadingSucceeded(state.profileAvatar, action.payload) };
    case getType(actions.profileAvatar.failure):
      return { ...state, profileAvatar: entityLoadingFailed(state.profileAvatar) };
    case getType(actions.profileLoading.request):
      return { ...state, profileLoading: entityLoadingStarted(state.profileLoading, action.payload) };
    case getType(actions.profileLoading.success):
      return { ...state, profileLoading: entityLoadingSucceeded(state.profileLoading, action.payload) };
    case getType(actions.profileLoading.failure):
      return { ...state, profileLoading: entityLoadingFailed(state.profileLoading) };

      default:
      return state;
  }
};

export default states;
