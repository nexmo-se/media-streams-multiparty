import React from 'react';
import { IconButton } from '@mui/material';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
function index({ handleClick }) {
  return (
    // <IconButton className="border solid-[2px]" onClick={handleClick}>
    //   <ClosedCaptionIcon fontSize="large"></ClosedCaptionIcon>
    // </IconButton>
    <ButtonGroup className="m-2 bg-rose-50" disableElevation sx={{ borderRadius: '30px' }} variant="contained" aria-label="split button">
      <Tooltip title="enable captions" aria-label="add">
        <IconButton
          onClick={handleClick}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
        >
          <ClosedCaptionIcon></ClosedCaptionIcon>
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}

export default index;
