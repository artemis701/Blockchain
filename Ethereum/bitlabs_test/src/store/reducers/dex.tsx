import { 
  ACTION_TYPE_EXCHANGE_SUCCESS, 
  ACTION_TYPE_EXCHANGE_FAILUR,
} from "../actions/types"

const initState = {
  sourceCurrency: "",
  targetAmount: "0.0",
  networkFee: "0.0",
  c14Fee: "0.0",
  totalFee: "0.0",
};

export default function Dex(state = initState, action: any) {
  switch(action.type) {
      case ACTION_TYPE_EXCHANGE_SUCCESS:
          return {
              ...state, ...action.payload
          }
      case ACTION_TYPE_EXCHANGE_FAILUR:
          return {
              ...state, ...action.payload
          }
      default:
          return {...state};
  }
}

export const sourceCurrencySelector  = (state:any) => {
  return state.dex.sourceCurrency;
}

export const targetAmountSelector  = (state:any) => {
  return state.dex.targetAmount;
}

export const networkFeeSelector  = (state:any) => {
  return state.dex.networkFee;
}

export const c14FeeSelector  = (state:any) => {
  return state.dex.c14Fee;
}

export const totalFeeSelector  = (state:any) => {
  return state.dex.totalFee;
}
