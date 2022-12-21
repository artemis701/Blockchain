import React, { useState, useEffect } from 'react'
import { styled, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Link } from '@reach/router';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { create as createIpfs } from 'ipfs-http-client';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core/styles"
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { compose } from 'redux';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DropzoneAreaExt from './DropzoneAreaExt';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const styles = theme => ({
    underline: {
        "&$error:after": {
            borderColor: "white"
        },
        "&:after": {
            border: `0px solid white`
        }
    },
});


const theme = createTheme({
    components: {
        MuiIconButton: {
            color: "#bdbdbd"
        },
    },
    overrides: {
        MuiFormControl: {
            root: {
                width: '100%'
            },
        },
        MuiFormHelperText: {
            root: {
                color: '#f44336'
            }
        },
        MuiInput: {
            underline: {
                "&:before": {
                    borderBottomColor: "#bdbdbd"
                },
                "&:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "#fff"
                }
            },
            root: {
                width: '98%',
                marginLeft: '1px',
                marginRight: '1px',
                fontFamily: 'Arial',
                fontSize: 20,
                color: "#bdbdbd",
            },
        },
        MuiGrid: {
            root: {
                paddingTop: '35px'
            }
        },
        MuiDropZoneArea: {
            root: {
                color: '#bdbdbd',
            },
            icon: {
                color: 'bdbdbd',
            },
        },
        MuiInputLabel: {
            root: {
                fontSize: 20,
                shrink: true,
                color: "grey",
                "&.Mui-focused": {
                    color: "aqua"
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                sizeMedium: {
                    color: '#bdbdbd'
                }
            }
        },
        MuiSvgIcon: {
            root: {
                fill: '#bdbdbd'
            }
        }
    }
});


const CampaignForm = (props) => {
    let [campaignInfo, setcampaignInfo] = useState({});
    let [file_blob, setfile_blob] = useState();
    let [loading, setloading] = useState(false);
    let [formIsValid, setformIsValid] = useState(false);
    const { classes } = props;
    const color = "#bdbdbd";
    
    useEffect(() => {
        setcampaignInfo({'startTimeStamp': 10});
    }, []);

    const handleFile = (files) => {
        if (files.length === 0)
            return;
        let reader = new FileReader();
        reader.addEventListener("loadend", function (event) {
            setfile_blob(event.target.result);
        });
        reader.readAsArrayBuffer(files[0]);
    }

    const uploadImageFile = async () => {
        if (!file_blob) return;
        const client = createIpfs('https://ipfs.infura.io:5001/api/v0')
        try {
            setloading(true);
            const added = await client.add(file_blob)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            const ss = { ...campaignInfo, "campaignUri": url, "avatarUri": "" };

            if (true /*await addCampaign(ss)*/) {
                // NotificationManager.success("Successfully completed!", "Success");
                Swal.fire(
                    'Good job!',
                    'You clicked the button!',
                    'success'
                )
            } else {
                // NotificationManager.success("TweetStorm Creation Failed!", "Fail");
                Swal.fire({
                    title: '<strong style="color: pink">Warning</strong>',
                    icon: 'info',
                    html:
                        'You have insufficient G$ to create a campaign.',
                    focusConfirm: false,
                    confirmButtonText:
                        'OK'
                })
            }
            setloading(false);
        } catch (error) {
            console.log('Error uploading file: ', error)
            setloading(false);
        }
    }

    const handleChange = (e) => {
        let target_name = e.target.name;
        let value = e.target.value;
        setcampaignInfo({ ...campaignInfo, [target_name]: value });
    }

    const setStartDateFunc = (d, e) => {
        setcampaignInfo({ ...campaignInfo, [e]: d.getTime() });
    }

    const handleValidation = async () => {
        if (!campaignInfo.name || !campaignInfo.shareText || !campaignInfo.tweetUrl || !campaignInfo.via || !campaignInfo.hashtags ||
            !campaignInfo.bountyAmount || !campaignInfo.maxBounty || !campaignInfo.duration) {
            return false;
        }
        if (!file_blob) {
            NotificationManager.warning("Please click a campaign image file", "Warning");
            return false;
        }
        // if (await uploadImageFile()) {
        //     NotificationManager.warning("Soory, but image upload failed. Try again.", "Warning");
        //     return false;
        // }

        return true;
    }

    const handleSubmit = async () => {
        if (await handleValidation()) {
            Swal.fire(
                {
                    title: '<strong>Congratulations</strong>',
                    icon: 'success',
                    html:
                        '<div>TweetStorm was created successfully!<div><img style="position: absolute; left: 75%; top: 65%; width: 25%; height: 35%" src="/img/successalert.png" alt=""/></div></div>'
                }
            )
        }
        else {
            setformIsValid(true);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            {/* <div className="App">
                <TextField label="label" defaultValue="text" />
            </div> */}
            <div className="col-md-12">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container >
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.name && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Name"
                                name="name"
                                id="name"
                                helperText={!campaignInfo.shareText && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.shareText && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Default Share Text"
                                name="shareText"
                                id="shareText"

                                helperText={!campaignInfo.shareText && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { width: '99%', fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.tweetUrl && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Tweet URL"
                                name="tweetUrl"
                                id="tweetUrl"
                                placeholder='https://twitter.com/'
                                helperText={!campaignInfo.tweetUrl && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.via && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Twitter UserName"
                                name="via"
                                id="via"

                                helperText={!campaignInfo.via && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                error={!campaignInfo.hashtags && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline },
                                    startAdornment: <InputAdornment position="start"><div style={{ color: "#bdbdbd", fontSize: "20px" }}>#</div></InputAdornment>,
                                }}
                                onChange={handleChange}
                                label="Hashtags"
                                name="hashtags"
                                id="hashtags"

                                helperText={!campaignInfo.hashtags && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField type='number'
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.bountyAmount && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Bounty Amount"
                                name="bountyAmount"
                                id="bountyAmount"

                                helperText={!campaignInfo.bountyAmount && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField type='number'
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.maxBounty && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Max number of Bounties"
                                name="maxBounty"
                                id="maxBounty"

                                helperText={!campaignInfo.maxBounty && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={campaignInfo.startTimeStamp}
                                    onChange={(newValue) => { setStartDateFunc(newValue, 'startTimeStamp') }}
                                    sx={{ svg: { color } }}
                                    renderInput={(params) => {
                                        return (
                                            <TextField
                                                variant="standard" {...params}
                                                sx={{ svg: { color } }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                                }}
                                                error={!campaignInfo.startTimeStamp && formIsValid}
                                                helperText={!campaignInfo.startTimeStamp && formIsValid ? "Please insert a value." : ''}
                                            />
                                        )
                                    }}
                                />
                            </LocalizationProvider>
                            {/* <TextField type='date'
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline }
                                }}
                                error={!campaignInfo.name && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%", label: '#bdbdbd' }}
                                onChange={handleChange}
                                label="Start Date"
                                name="startTimeStamp"
                                id="startTimeStamp"

                                helperText={!campaignInfo.startTimeStamp && formIsValid ? "Please insert a value." : ''} /> */}
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField type='number'
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' },
                                    classes: { notchedOutline: classes.notchedOutline },
                                    endAdornment: <InputAdornment position="start"><div style={{ color: "#bdbdbd", fontSize: "20px" }}>days</div></InputAdornment>
                                }}
                                error={!campaignInfo.duration && formIsValid}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontFamily: 'Arial', color: '#bdbdbd' }
                                }}
                                sx={{ width: "100%" }}
                                onChange={handleChange}
                                label="Duration"
                                name="duration"
                                id="duration"

                                helperText={!campaignInfo.duration && formIsValid ? "Please insert a value." : ''} />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Item
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <DropzoneAreaExt
                                    handleChange={handleFile}
                                />
                            </Item>
                        </Grid>
                    </Grid>
                </Box >
                <div className="campaign_form_footer">
                    <Link to="/explorer"><i className="fa fa-fw" aria-hidden="true" title="Copy to use angle-left"></i>TweetStorm List</Link>
                    <button className="btn-main lead" onClick={handleSubmit}>Create</button>
                </div>
            </div >
            {<Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            }
        </ThemeProvider>
    );

}

const mapStateToProps = state => ({
    profileAvatar: state.avatar.profileAvatar
});

const mapDispatchToProps = () => ({});

export default compose(connect(
    mapStateToProps,
    mapDispatchToProps()
), withStyles(styles))(CampaignForm);