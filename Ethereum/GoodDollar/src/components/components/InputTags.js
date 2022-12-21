import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import InputLabel from '@mui/material/InputLabel';
import $ from 'jquery';

const StyledInnerLabel = styled(InputLabel)({
  position: 'absolute',
  zIndex: '9999',
});

const StyledInput = styled.div`
  position: relative;
  label:not(.MuiInputLabel-shrink) {
    transform: translate(14px, 16px) scale(1);
  }
`;

export default function InputTags({ id, value, onChange }) {
  const [tags, setTags] = useState(value)
  const [focus, setFoucs] = useState(false);

  const handleChange = (newTags) => {
    setTags(newTags);
    onChange(newTags);
    if (newTags.length > 0) {
      setTimeout(() => setFoucs(true), 10);
    }
  }

  useEffect(() => {
    $('.react-tag-input__input').on('focus', function () {
      setTimeout(() => setFoucs(true), 10);
    })

    $('.react-tag-input__input').on('blur', function () {
      setTimeout(function () {
        if (tags.length === 0) {
          setFoucs(false);
        } else {
          setFoucs(true);
        }
      }, 10);
    })
    if (tags.length > 0) {
      setFoucs(true);
    }
  }, [tags]);

  return (
    <StyledInput>
      <StyledInnerLabel className="hash_label" shrink={focus}>Hash Tags</StyledInnerLabel>
      <ReactTagInput
        id={id}
        tags={tags}
        placeholder={' '}
        removeOnBackspace={true}
        value={tags}
        onChange={(newTags) => handleChange(newTags)}
      />
    </StyledInput>
  );
}
