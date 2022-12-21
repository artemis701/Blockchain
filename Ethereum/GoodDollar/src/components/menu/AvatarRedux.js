import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { create } from 'ipfs-http-client';
import { fetchProfileLoading } from "../../store/actions/thunks";
import api from '../../core/api';
import { isEmpty } from "../../utils";
import { addPromoter, getAvatar } from '../../core/web3';

const Input = styled('input')({
  display: 'none',
});

const AvatarRedux = function({ walletState, wallet }) {
  const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [fileUrl, updateFileUrl] = useState('');
    const client = create('https://ipfs.infura.io:5001/api/v0')
    
    useEffect(() => {
      async function getExistingAvatar() {
        const avatarHash = await getAvatar();
        if (!isEmpty(avatarHash)) {
            updateFileUrl(api.ipfsUrl + avatarHash);
        } else {
          updateFileUrl('');
        }
      }
      getExistingAvatar();
    }, [wallet, walletState]);

    async function onChange(e) {
      if (!walletState.data) {
        toast.error("Please connect your wallet!");
        document.getElementById('avatar-file').value = "";
        return;
      }
      const file = e.target.files[0]
      try {
        setLoading(true);
        dispatch(fetchProfileLoading(true));
        const added = await client.add(file)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        const result = await addPromoter(added.path);
        if (result.success) {
          updateFileUrl(url)  
          toast.success("Successfully uploaded. Please create a TweetStorm.");
        }
      } catch (error) {
        
      } finally {
        dispatch(fetchProfileLoading(false));
        setLoading(false);
      }
    }

    return (
      <div className="header-avatar" style={{width:"max-content"}}>
          <label htmlFor="avatar-file" style={{cursor:'pointer'}}>
            <Input accept="image/*" id="avatar-file" type="file" onChange={onChange} />
            <IconButton color="primary" aria-label="upload picture" component="span">
              {
                fileUrl && (
                  <Avatar alt="User" src={fileUrl} />
                )
              }
              {
                !fileUrl && (
                  <Avatar alt="User" src="../../img/avatar.png" />
                )
              }
              {loading && (
                <CircularProgress
                  size={55}
                  sx={{
                    color: '#2c94c9',
                    position: 'absolute',
                    zIndex: 1,
                  }}
                />
              )}
            </IconButton>
          </label>
      </div>
    );
}

const mapStateToProps = state => ({
  walletState: state.wallet.walletState
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps()
)(AvatarRedux);