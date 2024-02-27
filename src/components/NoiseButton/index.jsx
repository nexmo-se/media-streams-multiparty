import React from 'react';
import { IconButton } from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import { UserContext } from '../../Context/user';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import NoiseAwareIcon from '@mui/icons-material/NoiseAware';
import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';
function index({ handleNoiseChange, isNoiseSuppressionEnabled }) {
  return (
    <ButtonGroup className="m-2 bg-rose-50" disableElevation sx={{ borderRadius: '30px' }} variant="contained" aria-label="split button">
      <Tooltip
        title={isNoiseSuppressionEnabled ? 'Disable advanced noise suppression' : 'Enable advanced noise suppression'}
        aria-label="add"
      >
        <IconButton
          onClick={handleNoiseChange}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
        >
          {isNoiseSuppressionEnabled ? (
            <NoiseControlOffIcon fontSize="large"></NoiseControlOffIcon>
          ) : (
            <NoiseAwareIcon fontSize="large"></NoiseAwareIcon>
          )}
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}

export default index;
