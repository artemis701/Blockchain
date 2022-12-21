
export const initEntityState = (initialValue, loading = true) => ({
    loading,
    data: initialValue,
    loadFailed: false,
    canceler: null
  });
  
  export const entityLoadingStarted = (state, canceler) => ({
    ...state,
    canceler,
    loading: true,
    loadFailed: false
  });
  
  export const entityLoadingSucceeded = (state, data) => ({
    ...state,
    data,
    loading: false,
    loadFailed: false,
    canceler: null
  });
  
  export const entityLoadingFailed = (state) => ({
    ...state,
    loading: false,
    loadFailed: true,
    canceler: null
  });