import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import Clock from "./Clock";
import Button from '@mui/material/Button';
import TwitterIcon from '@mui/icons-material/Twitter';
import ThumbUp from '@mui/icons-material/ThumbUp';
import { toast } from 'react-toastify';
import ClaimDialog from './ClaimDialog';
import api from '../../core/api';
import { isEmpty, fromWei } from "../../utils";
import { fetchClaimedAmount } from '../../store/actions/thunks/tweetStorms';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const BlueButton = styled(Button)(({ theme }) => ({
    background: '#2c94c9',
    borderRadius: '10px',
    "&:hover": {
        background: '#499ec9',
    }
}));

const GreenButton = styled(Button)(({ theme }) => ({
    background: '#2cc95c',
    borderRadius: '10px',
    "&:hover": {
        background: '#4fcd72',
    }
}));

//react functional component
const TweetStormCard = ({ walletState, tweetStorm, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad, onReload }) => {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState(0);
    const [reloadClaim, setReloadClaim] = React.useState(false);
    const [claimedAmount, setClaimedAmount] = React.useState(0);

    const tweetdialog = (tweetUrl, share_text, via, hash_tags) => {
        var shareURL = "http://twitter.com/share?"; //url base
        //params
        var params = {
            url: tweetUrl,
            text: share_text,
            via: via,
            hashtags: hash_tags
        }
        for (var prop in params) {
            if (!isEmpty(params[prop])) {
                shareURL += '&' + prop + '=' + encodeURIComponent(params[prop])
            }
        };
        window.open(shareURL, "_blank");
    }

    const claimdialog = (max_bounty, claimed_bounty) => {
        if (!walletState.data) {
            toast.error("Please connect your wallet!");
            return;
        }
        if (claimed_bounty >= max_bounty) {
            toast.error("TweetStorm has been ended. Please claim another one.");
            return;
        }
        if (status === 0) {
            toast.info("Please wait for TweetStorm to start.");
        } else if (status === 2) {
            toast.info("TweetStorm has been ended. Please claim another one.");
        } else {
            setOpen(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (reload) => {
        if (reload) {
            onReload();
            setReloadClaim(prevState => !prevState);
            setOpen(false);
        }
    }

    const handleStatus = (value) => {
        setStatus(value);
    }

    useEffect(() => {
        const getClaimedAmount = async () => {
            const amount = await fetchClaimedAmount(tweetStorm.camp_param_campaignId);
            setClaimedAmount(amount);
        }
        getClaimedAmount();
    }, [reloadClaim, tweetStorm.camp_param_campaignId]);

    return (
        <div className={className}>
            <div className="nft__item m-0">
                {/* {tweetStorm.item_type === 'single_items' ? (
                    <div className='icontype'><i className="fa fa-bookmark"></i></div>
                ) : (
                        <div className='icontype'><i className="fa fa-shopping-basket"></i></div>
                    )
                } */}
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
                    <div className="nft__item_like">
                        <i className="fa fa-heart"></i><span>{claimedAmount}/{tweetStorm.camp_param_maxBounty}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-xs-6" align="left">
                        <BlueButton variant="contained" onClick={() => tweetdialog(tweetStorm.camp_param_tweetUrl, tweetStorm.camp_param_shareText, tweetStorm.camp_param_via, tweetStorm.camp_param_hashtag)} startIcon={<TwitterIcon />}>Tweet</BlueButton>
                    </div>
                    <div className="col-md-6 col-xs-6" align="right">
                        <GreenButton variant="contained" onClick={() => claimdialog(tweetStorm.camp_param_maxBounty, tweetStorm.camp_claimedBounty)} startIcon={<ThumbUp />}>Claim</GreenButton>
                    </div>
                </div>
            </div>
            <ClaimDialog
                id={tweetStorm.camp_param_campaignId}
                amount={tweetStorm.camp_param_bountyAmount}
                open={open}
                onClose={handleClose}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    walletState: state.wallet.walletState
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(TweetStormCard);