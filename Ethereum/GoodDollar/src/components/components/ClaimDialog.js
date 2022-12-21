import React, { useEffect, useState, memo } from 'react';
import styled from "styled-components";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import ReactLoading from "react-loading";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ComposedTextField from './ComposedTextField';
import { submitTweet } from '../../core/web3';
import { postSubmitTweet } from '../../core/axios';
import { CongratulationModal, isEmpty, ClaimErrorModal, fromWei } from "../../utils";

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

const Prop = styled('h3')`f5 f4-ns mb0 white`;

const theme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {

                },
                paper: {
                    width: '500px',
                    backgroundColor: '#1d598d',
                    borderRadius: '30px',
                    textAlign: 'center',
                    '@media (min-width: 600px)': {

                    }
                }
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '42pt',
                    fontWeight: 'bold',
                    padding: '0px 20px'
                },
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    height: '5px !important',
                    color: 'white',
                    opacity: 1,
                    marginLeft: '28%',
                    marginRight: '28%'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    margin: '10px 0',
                    width: '100%'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    background: 'white',
                    borderColor: 'transparent',
                    display: 'block',
                    paddingRight: '0px',
                    '&:hover': {
                        border: 'none'
                    }
                },
                input: {
                    padding: '10px 14px',
                    width: '90%'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '15px',
                    top: '-6px',
                },
                shrink: {
                    color: 'white',
                    fontSize: '18px',
                    top: '-13px',
                    transform: 'translate(14px, -9px) scale(0.75)'
                },
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    justifyContent: 'center',
                    paddingBottom: '34px'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: 'white',
                    border: 'solid 1px white',
                    borderRadius: '24px',
                    padding: '5px 35px',
                    '&:hover': {
                        borderColor: '#a1c0db'
                    }
                },
            }
        }
    },
});

//react functional component
const ClaimDialog = ({ id, open = false, onClose, amount, onSubmit }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(false);
    const web3 = window.web3;

    useEffect(() => {
        const htmlElement = document.querySelector('body');
        if (open) {
            htmlElement.style.paddingRight = 0;
        }
    }, [open]);

    const handleChange = (e) => {
        setUrl(e.target.value);
        setError(false);
    }

    const handleSubmit = async () => {
        if (isEmpty(url) || !url.includes('https://twitter.com')) {
            setError(true);
            return;
        }
        let reload = false;
        setLoading(true);
        setWarning('Signing...');
        const response = await postSubmitTweet(id, url);
        if (response.status === 200 && response.data.ret === "success") {
            setWarning('Pending...');
            const data = response.data;
            const ret_val = await submitTweet(id, url, data.signature)
            setLoading(false);
            if (ret_val.success) {
                CongratulationModal(fromWei(amount));
                reload = true;
            } else {
                ClaimErrorModal();
            }
        } else {
            setLoading(false);
            ClaimErrorModal();
        }
        
        setTimeout(() => onSubmit(reload), 5000);
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    keepMounted
                    onClose={onClose}
                    aria-describedby="insert claim"
                >
                    <DialogTitle>
                        CLAIM
                    </DialogTitle>
                    <Divider sx={{ height: '20px' }} variant='middle' />
                    <ComposedTextField name="name" onChange={handleChange} value={url} error={error} style={{ margin: '40px 30px' }} label="Tweet URL" placeholder="https://twitter.com/" />
                    <DialogActions>
                        <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
            {<Backdrop
                sx={{ color: '#fff', zIndex: 9999}}
                open={loading}
            >
                <Loading>
                    <ReactLoading type={'spinningBubbles'} color="#fff" />
                    <Prop>{warning}</Prop>
                </Loading>
            </Backdrop>}
        </>
    );
};

export default memo(ClaimDialog);