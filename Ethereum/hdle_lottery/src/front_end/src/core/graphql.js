import { getLastWeeklyLotteryId, getLastDailyLotteryId } from "./web3";
import api from "./api";
import { CONFIG } from "./web3";
const { GraphQLClient, gql } = require("graphql-request");

export const fetchLotteryTicket = async (lottery_type, lottery_id, account = false) => {
  const web3 = window.web3;
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length <= 0) {
      return {
        success: false,
      }
    }

    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    let query = gql`
        {
            buyTickets(orderBy: startNo, orderDirection: asc, where:{lottery_type: ${lottery_type}, lottery_id: "${lottery_id}"`;
    if (account) {
      query += `, addr: "${accounts[0]}"`;
    }
    query += ` }) {
                id
                addr
                lottery_type
                lottery_id
                startNo
                count
                time
            }
        }
      `
    const data = await graphQLClient.request(query);
    return {
      success: true,
      data: data.buyTickets
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      data: err
    }
  }
};

export const getTopWinner = async (lottery_type, show_contract = false) => {
  let lottery_id;
  if (lottery_type === 0) {
    const data = await getLastWeeklyLotteryId();
    if (data.success) {
      lottery_id = data.last_weekly_lottery_id - 1;
      if (lottery_id < 0) {
        return [];
      }
    }
  } else {
    const data = await getLastDailyLotteryId();
    if (data.success) {
      lottery_id = data.last_daily_lottery_id - 1;
      if (lottery_id < 0) {
        return [];
      }
    }
  }
  try {
    const graphQLClient = new GraphQLClient(api.graphUrl, {});
    let query = gql`
      {
        selectWinners (orderBy: price, orderDirection: desc, 
          where: { lottery_type: ${lottery_type}, lottery_id: "${lottery_id}"`;
    if (!show_contract) {
      query += `, addr_not: "${CONFIG.MAIN.CONTRACT}"`;
    }
    query += `}) {
          id
          addr
          lottery_type
          lottery_id
          time
          ticketID
          price
        }
      }
    `
    const data = await graphQLClient.request(query);
    return data.selectWinners;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getBiggestWinner = async () => {
  try {
    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    let query = gql`
      {
        givePriceToWinners (orderBy: amount, orderDirection: desc, where: { lottery_type: 0 }) 
        {
          id
          addr
          time
          amount
          ticketID
        }
      }`

    const weeklyQuery = await graphQLClient.request(query);
    const weekly_data = weeklyQuery.givePriceToWinners;
    query = gql`
    {
      givePriceToWinners (orderBy: amount, orderDirection: desc, where: { lottery_type: 1 }) 
      {
        id
        addr
        time
        amount
        ticketID
      }
    }`

    const dailyQuery = await graphQLClient.request(query);
    const daily_data = dailyQuery.givePriceToWinners;

    let result_data = [];
    if (weekly_data.length > 0 && daily_data.length > 0) {
      if (weekly_data[0].amount > daily_data[0].amount) {
        result_data = weekly_data[0];
      } else {
        result_data = daily_data[0];
      }
    } else if (weekly_data.length > 0) {
      result_data = weekly_data[0];
    } else if (daily_data.length > 0) {
      result_data = daily_data[0];
    }
    return result_data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchNFThistory = async (lottery_type) => {
  const web3 = window.web3;
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length <= 0) {
      return {
        success: false,
      }
    }
    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    let query = gql`
      {
        selectWinners (orderBy: time, orderDirection: desc, where: { lottery_type: ${lottery_type}, addr: "${accounts[0]}" }) 
        {
          id
          addr
          lottery_type
          lottery_id
          time
          ticketID
          price
        }
      }`

    const selectQuery = await graphQLClient.request(query);

    return {
      success: true,
      data: selectQuery.selectWinners,
    }
  } catch (err) {
    console.log(err);
    return {
      success: false
    };
  }
}

export const getCongratulationType = async () => {
  const result1 = await fetchNFThistory(0);
  if (result1.success && result1.isNew) {
    return 1;
  }
  const result2 = await fetchNFThistory(1);
  if (result2.success && result2.isNew) {
    return 2;
  }
  return 0;
}

export const getWinnerState = async () => {
  try {
    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    let query = gql`
    {
      selectWinners (
        orderBy: time, 
        orderDirection: desc,
        first: 1)    
      {
        id
        addr
        lottery_type
        lottery_id
        time
        ticketID
        price
      }
    }`

    const selectQuery = await graphQLClient.request(query);
    return selectQuery.selectWinners;
  } catch (error) {
    console.log(error);
    return [];
  }
}