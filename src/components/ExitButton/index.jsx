import React from 'react';
import { IconButton } from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import { UserContext } from '../../Context/user';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
function index({ handleLeave }) {
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();
  const handleExit = () => {
    handleLeave();
    navigate('/thankyou');
  };

  return (
    <ButtonGroup
      className="m-2 bg-red-300 absolute left-[10px]"
      disableElevation
      sx={{ borderRadius: '30px' }}
      variant="contained"
      aria-label="split button"
    >
      <Tooltip title="Exit meeting" aria-label="add">
        <IconButton
          onClick={handleExit}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
        >
          <LogoutIcon fontSize="large"></LogoutIcon>
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}

export default index;
