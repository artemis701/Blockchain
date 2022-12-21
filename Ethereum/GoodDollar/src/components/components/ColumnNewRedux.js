import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Button from '@mui/material/Button';
import * as actions from '../../store/actions/thunks';
import TweetStormCard from './TweetStormCard';
import { toast } from 'react-toastify';

const CustomButton = styled(Button)(({ theme }) => ({
    margin: 'auto',
    color: 'white',
    background: '#2c94c9',
    borderRadius: '30px',
    border: 'none',
    padding: '7px 30px',
    "&:hover": {
        background: '#499ec9',
    }
}));

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, authorId = null }) => {
    const [tweetStorms, setTweetStorms] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
    
    useEffect(() => {
        const loadTweetStorms = async () => {
            try {
                setIsLoading(true);
                const response = await actions.fetchTweetStorms(page);
                setTweetStorms([...tweetStorms, ...response]);
            } catch (err) {
                toast.error("Error while loading data. Try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTweetStorms();
    }, [page]);

    const loadMore = () => {
        setPage((page) => page + 1);
    }

    return (
        <div className='row'>
            {tweetStorms && tweetStorms.map( (ts, index) => (
                <TweetStormCard tweetStorm={ts} key={index} onImgLoad={onImgLoad} height={height} />
            ))}
            {showLoadMore && (
                <div className="load-more col-lg-12" align="center">
                    <CustomButton onClick={loadMore} className="">
                    {isLoading ? 'Loading...' : 'Load More'}
                    </CustomButton>
                    <div className="spacer-single"></div>
                </div>
            )}
        </div>              
    );
};

export default ColumnNewRedux;