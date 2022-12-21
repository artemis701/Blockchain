import axios from 'axios';
import api from './api';

export const Axios = axios.create();
export const Canceler = axios.CancelToken.source();

export const postSubmitTweet = async (id, tweetUrl) => {
    const resp = await Axios.post(`${api.baseUrl}submit_tweet`,
        {   tweetUrl: tweetUrl,
            campaignID: id }, 
        {
            params: {},
        });
    return resp;
}

export const fetchTopPromoters = async () => {
    const resp = await Axios.get(`${api.baseUrl}get_top_promoters`,
        {
            params: {},
        });
    return resp;
}