import React from 'react';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import { IconButton } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';

function index({ handleClick }) {
  return (
    <ButtonGroup
      className="m-2 bg-rose-50 absolute right-[50px]"
      disableElevation
      sx={{ borderRadius: '30px' }}
      variant="contained"
      aria-label="split button"
    >
      <Tooltip title="Open chat" aria-label="add">
        <IconButton
          onClick={handleClick}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
        >
          <ChatTwoToneIcon></ChatTwoToneIcon>
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}

export default index;
