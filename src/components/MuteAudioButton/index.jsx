import Videocam from '@mui/icons-material/Videocam';
import Mic from '@mui/icons-material/MicNone';

import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import useDevices from '../../hooks/useDevices';

import ButtonGroup from '@mui/material/ButtonGroup';
import { ArrowDropDown, MicOff } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { MenuItem, MenuList } from '@mui/material';

// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import React from 'react';

import { UserContext } from '../../Context/user';

export default function MuteAudioButton({ publisher, publishing }) {
  const { user } = React.useContext(UserContext);

  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [audio, setHasAudio] = React.useState(user.defaultSettings.publishAudio);
  const title = audio ? 'Disable Mic' : 'Enable Mic';

  const toggleAudio = () => {
    if (!publisher) return;
    publisher.publishAudio(!audio);
    setHasAudio((prev) => !prev);
  };

  const changeAudioSource = (deviceId) => {
    publisher.setAudioSource(deviceId);
  };

  React.useEffect(() => {
    setDevicesAvailable(deviceInfo.audioInputDevices);
    console.log('use effect running in the mute audio button');
    console.log(publishing);
    if (publisher && publishing) {
      console.log('run inside publishing muteaudio');
      const currentDeviceId = publisher.getAudioSource()?.deviceId;
      console.log('device id');
      console.log(currentDeviceId);
      const IndexOfSelectedElement = devicesAvailable.indexOf(devicesAvailable.find((e) => e.deviceId === currentDeviceId));
      setSelectedIndex(IndexOfSelectedElement);
    }
  }, [publisher, deviceInfo, devicesAvailable, publishing]);

  React.useEffect(() => {
    if (devicesAvailable) {
      const videoDevicesAvailable = devicesAvailable.map((e) => {
        return e.label;
      });
      console.log(videoDevicesAvailable);
      setOptions(videoDevicesAvailable);
    }
    // if (user.videoEffects.backgroundBlur)
    //   setOptions(['Not available with Background Blurring']);
  }, [devicesAvailable]);

  const handleChangeVideoSource = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    const audioDeviceId = devicesAvailable.find((device) => device.label === event.target.textContent).deviceId;
    changeAudioSource(audioDeviceId);
  };

  const handleToggle = (e) => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        className="m-2 bg-rose-50"
        disableElevation
        sx={{ borderRadius: '30px' }}
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Tooltip title={title} aria-label="add">
          <IconButton
            onClick={toggleAudio}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
          >
            {audio ? <Mic className="bg-rose-50" /> : <MicOff />}
          </IconButton>
        </Tooltip>
        <IconButton
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          className="rounded-3xl h-[50px] w-[50px] bg-rose-50 "
        >
          <ArrowDropDown className="bg-rose-50" color="white" />
        </IconButton>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 101 }} // todo temporary fix for a bug in MP 0.1.5
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={option === publisher.getAudioSource().label}
                      onClick={(event) => handleChangeVideoSource(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
