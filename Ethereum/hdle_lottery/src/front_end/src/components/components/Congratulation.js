import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from "@mui/styles";
import { fromWei } from '../../utils';

const useStyles = makeStyles({
  paper: {
    width: '600px',
    height: 'fit-content',
    background: 'linear-gradient(to bottom, #27689e, #031727 100%)',
    backgroundSize: 'contain !important',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center'
  }
});

export default function Congratulation(props) {
  const classes = useStyles(props);
  const handleOK = () => {
    props.handleClose();
  }
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        classes={{ paper: classes.paper }}
      >
        {props.info.type === 0 ? (
          <img src="img/background/weekly.png" style={{width: '100%'}}></img>
        ) : (
          <img src="img/background/daily.png" style={{width: '100%'}}></img>
        )}
        <div className="modal-content" align="center">
          <div className="modal-subtitle">Winner</div>
          {props.info.addr !== 0 ? (
            <div className="modal-text">{props.info.addr}</div>
          ) : (
            <div className="modal-text">
              No one has won. The rewards of this lottery will be added to the next lottery.
            </div>
          )}
          <div className="modal-subtitle">Reward Amount</div>
          <div className="modal-text">{fromWei(props.info.price)} AVAX</div>
        </div>
        <div className='congratulation-footer'>
          <Button variant='contained'
            sx={{
              backgroundColor: "#c1482e",
              fontSize: '20px',
              borderRadius: '20px',
              padding: '0px 30px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: "#cb7968",
                boxShadow: 'none',
                transition: 'all 0.3s ease'
              },
              "@media (max-width: 640px)": {
                margin: '10px',
                fontSize: '14px',
                padding: '0px 16px',
              }
            }}
            onClick={handleOK}>{"O K"}</Button>
        </div>
      </Dialog>
    </div>
  );
}
