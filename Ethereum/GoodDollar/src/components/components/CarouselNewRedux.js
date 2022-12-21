import React, { memo, useEffect, useState } from "react";
import Slider from "react-slick";
import { toast } from 'react-toastify';
import styled from "styled-components";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from "./Clock";
import api from "../../core/api";
import { isEmpty, fromWei } from "../../utils";
import * as actions from '../../store/actions/thunks';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const carouselNew = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: 300,
  responsive: [
    {
      breakpoint: 1900,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }
  ]
}

const CarouselNewRedux = () => {
  const [tweetStorms, setTweetStorms] = useState([]);
  const [height, setHeight] = useState(0);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  function handleStatus () {

  }

  useEffect(() => {
    const loadTweetStorms = async () => {
      try {
        const response = await actions.fetchTweetStorms(0);
        setTweetStorms([...tweetStorms, ...response]);
      } catch (err) {
        toast.error("Error while loading data. Try again later.");
      }
    };

    loadTweetStorms();
  }, []);

  return (
    <div className='nft'>
      <Slider {...carouselNew}>
        {tweetStorms && tweetStorms.map((tweetStorm, index) => (
          <div className='itm' index={index + 1} key={index}>
            <div className="d-item">
              <div className="nft__item">
                {tweetStorm.camp_param_startTimeStamp &&
                  <div className="de_countdown">
                    <Clock duration={tweetStorm.camp_param_duration} startTime={tweetStorm.camp_param_startTimeStamp} handleStatus={handleStatus} />
                  </div>
                }
                <div className="author_list_pp">
                  <span>
                    <img className="lazy" src={isEmpty(tweetStorm.camp_avatarUri) ? 'img/avatar.png' : api.ipfsUrl + tweetStorm.camp_avatarUri} alt="" />
                  </span>
                </div>
                <div className="nft__item_wrap" style={{ height: `${height}px` }}>
                  <Outer>
                    <span>
                      <img onLoad={onImgLoad} src={isEmpty(tweetStorm.camp_campaignUri) ? 'img/default.png' : api.ipfsUrl + tweetStorm.camp_campaignUri} className="lazy nft__item_preview" alt="" />
                    </span>
                  </Outer>
                </div>
                <div className="nft__item_info">
                  <span>
                    <h4>{tweetStorm.camp_param_name}</h4>
                  </span>
                  <div className="nft__item_price">
                    {tweetStorm.hashtag}
                  </div>
                  <div className="has_offers">
                    {fromWei(tweetStorm.camp_param_bountyAmount)} G$
                  </div>
                  {/* <div className="nft__item_like">
                    <i className="fa fa-heart"></i><span>{tweetStorm.camp_claimedBounty}/{tweetStorm.camp_param_maxBounty}</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default memo(CarouselNewRedux);
