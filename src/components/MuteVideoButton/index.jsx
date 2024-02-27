import Videocam from '@mui/icons-material/Videocam';
import VideocamOff from '@mui/icons-material//VideocamOff';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import useDevices from '../../hooks/useDevices';

import ButtonGroup from '@mui/material/ButtonGroup';
import { ArrowDropDown } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { MenuItem, MenuList } from '@mui/material';

// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import React from 'react';
import { useState } from 'react';

import { UserContext } from '../../Context/user';

export default function MuteVideoButton({ publisher, isPublishing }) {
  const { user } = React.useContext(UserContext);
  //   const title = hasVideo ? 'Disable Camera' : 'Enable Camera';
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [video, setHasVideo] = useState(user.defaultSettings.publishVideo);

  const toggleVideo = () => {
    console.log(publisher);
    if (!publisher) return;
    publisher.publishVideo(!video);
    setHasVideo((prev) => !prev);
  };

  const changeVideoSource = (videoDeviceId) => {
    publisher.setVideoSource(videoDeviceId);
  };

  React.useEffect(() => {
    setDevicesAvailable(deviceInfo.videoInputDevices);
    if (publisher && isPublishing) {
      console.log(publisher);
      const currentDeviceId = publisher.getVideoSource()?.deviceId;
      console.log('video device' + currentDeviceId);

      const IndexOfSelectedElement = devicesAvailable.indexOf(devicesAvailable.find((e) => e.deviceId === currentDeviceId));
      setSelectedIndex(IndexOfSelectedElement);
    }
  }, [publisher, deviceInfo, devicesAvailable, isPublishing]);

  React.useEffect(() => {
    if (devicesAvailable) {
      const videoDevicesAvailable = devicesAvailable.map((e) => {
        return e.label;
      });
      setOptions(videoDevicesAvailable);
    }
    if (user.defaultSettings.blur) setOptions(['To change devices disable Background Blurring']);
  }, [devicesAvailable]);

  const handleChangeVideoSource = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    const videoDeviceId = devicesAvailable.find((device) => device.label === event.target.textContent).deviceId;
    changeVideoSource(videoDeviceId);
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
        <Tooltip title={'video'} aria-label="add">
          <IconButton
            onClick={toggleVideo}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
          >
            {!video ? <VideocamOff bg-rose-50 /> : <Videocam />}
            {/* <Videocam /> */}
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
                      selected={option === publisher.getVideoSource().label}
                      onClick={(event) => handleChangeVideoSource(event, index)}
                      className="background-black"
                      // disabled={user.videoEffects.backgroundBlur}
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
