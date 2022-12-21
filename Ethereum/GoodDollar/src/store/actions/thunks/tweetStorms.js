import api from '../../../core/api';
const { GraphQLClient, gql } = require('graphql-request');

export const fetchTweetStorms = async (page, sort = "camp_param_campaignId", filter = "") => {
  if (sort === null)
    sort = 'camp_param_campaignId';
  try {
    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    const query = gql`
      {
        addCampaigns (orderBy: ${sort}, orderDirection: desc, first: 12, skip: ${page * 12}, where: { camp_param_name_contains: "${filter}" }) 
        {
          id
          camp_param_campaignId
          camp_param_name
          camp_param_tweetUrl
          camp_param_shareText
          camp_param_via
          camp_param_hashtag
          camp_param_bountyAmount
          camp_param_maxBounty
          camp_param_startTimeStamp
          camp_param_duration
          camp_claimedBounty
          camp_avatarUri
          camp_campaignUri
          camp_promoter
        }
      }
    `
    const data = await graphQLClient.request(query);
    return data.addCampaigns;
  } catch (err) {
    console.log(err);
  }
};

export const fetchClaimedAmount = async (id) => {
  try {
    const graphQLClient = new GraphQLClient(api.graphUrl, {})
    const query = gql`
      {
        submitTweets (where: {campaignId: "${id}"}) {
          id
          campaignId
        }
      }
    `
    const data = await graphQLClient.request(query);
    return data.submitTweets.length;
  } catch (err) {
    console.log(err);
  }
};

export const fetchTopPromoters = async () => {
  try {
    const userInfos = [];
    const graphQLClient = new GraphQLClient(api.graphUrl, {})

    const query = gql`
      {
        addCampaigns(orderBy: camp_param_campaignId, orderDirection: asc) {
          camp_param_bountyAmount
          camp_param_maxBounty
          camp_avatarUri
          camp_promoter
        }
      }`

    const data = await graphQLClient.request(query);
    for (var i = 0; i < data.addCampaigns.length; i++) {
      var campaign = data.addCampaigns[i];
      var isExist = false;
      var amount = Number(campaign.camp_param_bountyAmount * campaign.camp_param_maxBounty / 100);
      for (var j = 0; j < userInfos.length; j ++) {
        if (userInfos[j].promoter === campaign.camp_promoter) {
            userInfos[j].amount += amount;
            isExist = true;
            break;
        }
      }

      if (!isExist) {
        userInfos.push ({promoter: campaign.camp_promoter, avatarUri: campaign.camp_avatarUri, amount: amount});
      }
    }
    // sort user infos by amount
    await userInfos.sort(function (a, b) {
      return b.amount - a.amount;
    });
    return userInfos.slice(0, 12);
  } catch (err) {
    console.log(err);
  }
}