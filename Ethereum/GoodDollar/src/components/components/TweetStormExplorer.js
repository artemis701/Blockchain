import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Select from 'react-select';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import * as actions from '../../store/actions/thunks';
import TweetStormCard from './TweetStormCard';

const CustomLoadingButton = styled(LoadingButton)(({ theme }) => ({
  color: 'white !important',
  background: '#2c94c9',
  borderRadius: '30px',
  border: 'none',
  padding: '8px 26px 8px 42px',
  "&:hover": {
    background: '#499ec9',
  },
  '.MuiLoadingButton-loadingIndicator': {
    left: '25px',
    color: 'white'
  }
}));

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

export const categories = [
  {
    value: 'camp_param_campaignId',
    label: 'Last recently'
  },
  {
    value: 'camp_param_bountyAmount',
    label: 'Bounty Amount'
  },
  {
    value: 'camp_param_maxBounty',
    label: 'Max Number Of Bounties'
  },
  {
    value: 'camp_claimedBounty',
    label: 'Popularity'
  },
  {
    value: 'camp_param_duration',
    label: 'Expiration Date'
  },
];

//react functional component
const TweetStormExplorer = ({ showLoadMore = true }) => {
  const [tweetStorms, setTweetStorms] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const [sort, setSort] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('');
  const [reload, setReload] = useState(false);
  const defaultValue = {
    value: null,
    label: 'Select Filter'
  };

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  const loadTweetStorms = async (refresh = false) => {
    try {
      setIsLoading(true);
      const response = await actions.fetchTweetStorms(page, sort, filter);
      if (refresh) {
        setTweetStorms([...response]);
      } else {
        setTweetStorms([...tweetStorms, ...response]);
      }
    } catch (err) {
      toast.error("Error while loading data. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTweetStorms();
  }, [page, sort, filter]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      loadTweetStorms(true);
      setReload(false);
    }
  }, [reload]);

  const loadMore = () => {
    setPage((page) => page + 1);
  }

  const handleCategory = (option) => {
    const { value } = option;
    setSort(value);
    setTweetStorms([]);
    setPage(0);
  };

  const filterTweetStorm = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleFilter = () => {
    setFilter(inputValue);
    setTweetStorms([]);
    setPage(0);
  }

  const customStyles = {
    option: (base, state) => ({
      ...base,
      background: "transparent",
      color: "#fff",
      borderRadius: "30px",
      "&:hover": {
        background: "#3a3c40",
      }
    }),
    menu: base => ({
      ...base,
      background: "transparent",
      borderRadius: 0,
      marginTop: 0
    }),
    menuList: base => ({
      ...base,
      background: "#212428",
      padding: 0
    }),
    control: (base, state) => ({
      ...base,
      padding: 2,
      background: 'transparent',
      borderColor: '#005c8b',
      borderRadius: "30px",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.1)"
      }
    }),
    singleValue: base => ({
      ...base,
      color: "#fff",
    })
  };

  return (
    <>
      <div className='row'>
        <div className='col-lg-12'>
          <div className="items_filter">
            <div className="row">
              <div className="col-md-3">
                <div className='dropdownSelect one'>
                  <Select
                    styles={customStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={[defaultValue, ...categories]}
                    onChange={handleCategory}
                  />
                </div>
              </div>
              <div className="col-md-9">
                <div className="form-dark" id="form_quick_search" name="form_quick_search">
                  <input
                    className="form-control"
                    id="filter"
                    name="filter"
                    placeholder="Search TweetStorm here..."
                    type="text"
                    onKeyUp={(event) => { 
                      if (event.keyCode === 13) {
                        handleFilter();
                      }
                    }} 
                    onChange={filterTweetStorm}
                  />
                  <button id="btn-submit">
                    <i className="fa fa-search bg-color-secondary" onClick={handleFilter}></i>
                  </button>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        {tweetStorms && tweetStorms.map((ts, index) => (
          <TweetStormCard tweetStorm={ts} key={index} onImgLoad={onImgLoad} height={height} onReload={() => setReload(true)} />
        ))}
        {showLoadMore && (
          <div className="load-more col-lg-12" align="center">
            {isLoading ? (
              <CustomLoadingButton 
              loading 
            >
              Loading...
            </CustomLoadingButton>
            ) : (
              <CustomButton onClick={loadMore} className="">Load More</CustomButton>
            )}
            <div className="spacer-single"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default TweetStormExplorer;