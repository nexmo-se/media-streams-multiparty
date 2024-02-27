import React from 'react';
import { IconButton } from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import { UserContext } from '../../Context/user';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
function index({ publisher }) {
  const { user } = React.useContext(UserContext);
  const [blur, setHasBlur] = React.useState(user.defaultSettings.blur);

  const handleBlurChange = async () => {
    if (blur) {
      try {
        await publisher.clearVideoFilter();
        setHasBlur(false);
      } catch (e) {
        throw new Error('Error turning off blur' + e);
      }
    } else {
      try {
        await publisher.applyVideoFilter({
          type: 'backgroundBlur',
          blurStrength: 'high',
        });
        setHasBlur(true);
      } catch (e) {
        throw new Error('Error setting blur:' + e);
      }
    }
  };
  return (
    <ButtonGroup className="m-2 bg-rose-50" disableElevation sx={{ borderRadius: '30px' }} variant="contained" aria-label="split button">
      <Tooltip title="Toggle Blur" aria-label="add">
        <IconButton
          onClick={handleBlurChange}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
        >
          {blur ? <BlurOffIcon fontSize="large"></BlurOffIcon> : <BlurOnIcon fontSize="large"></BlurOnIcon>}
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}

export default index;
