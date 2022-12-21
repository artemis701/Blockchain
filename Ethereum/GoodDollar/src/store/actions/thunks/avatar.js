import * as actions from '..';

export const fetchProfileAvatar = (file_url) => async (dispatch) => {
  try {
    dispatch(actions.profileAvatar.success(file_url));
  } catch (err) {
    console.log(err);
    dispatch(actions.profileAvatar.failure(err));
  }
};

export const fetchProfileLoading = (loading) => async (dispatch) => {
  try {
    dispatch(actions.profileLoading.success(loading));
  } catch (err) {
    console.log(err);
    dispatch(actions.profileLoading.failure(err));
  }
};