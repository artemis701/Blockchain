import React, { Component } from 'react'
import styled from "styled-components";
import {DropzoneAreaBase} from 'material-ui-dropzone'
import {withStyles} from "@material-ui/core/styles"

const useStyles = theme => ({
    dropZone: {
      fullWidth: 'true',
      background: 'transparent',
      color: 'white',
      borderColor: 'white',
      borderRadius: '30px',
      borderWidth: '2px',
      minHeight: '181px'
    },
    previewContainer: {
      justifyContent: 'center'
    },
  });
 
const Outer = styled.div`
  .path-panel {
    position: absolute;
    bottom: 20%;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

class DropzoneAreaExample extends Component{
  constructor(props) {
    super(props);
    this.state = {
      path: ''
    }
  }
  handleChange = (event) => {
    console.log(event[0].file.path);
    this.setState({ path: event[0].file.path});
    this.props.handleChange(event);
  }
  render(){
    const { classes } = this.props;
    return (
      <Outer>
        <DropzoneAreaBase
            acceptedFiles={['image/*']}
            dropzoneClass={classes.dropZone}
            previewGridClasses={{
              container: classes.previewContainer,
            }}
            dropzoneText={'Select a TweetStorm image file'}
            filesLimit={1}
            showAlerts={false}
            onAdd={this.handleChange}
            type="file"
        />
        <div className="path-panel">
          <span className="text-white text-path">{this.state.path}</span>
        </div>
      </Outer>
    )
  }
}
export default withStyles(useStyles, { withTheme: true })(DropzoneAreaExample);