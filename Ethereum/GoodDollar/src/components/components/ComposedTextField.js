import React from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { isMobile } from '../../utils';

const CssTextField = styled(TextField)({
    margin: '10px 0px',
    '& label.Mui-focused': {
      color: 'white',
      fontSize: '18px',
      top: '-13px'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'transparent',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent',
      },
    },
  });

const ComposedTextField = (props) => {
    return (
        <Box
            component="div"
            noValidate
            autoComplete="off"
        >
            <div style={{position: 'relative', ...props.style}}>
                <CssTextField
                    {...props}
                    style={{margin: 0}}
                />
                {props.error && !isMobile() && (
                  <span style={{ color: "white", fontSize: '14px', position: 'absolute', left: 0, bottom: '-27px' }}><WarningAmberIcon fontSize="" /> Please insert a valid value.</span>
                )}
            </div>
        </Box >
    );
}

export default ComposedTextField;