import Videocam from '@mui/icons-material/Videocam';
import More from '@mui/icons-material/MoreVert';
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
import ReportIssue from '../ReportIssue';
import Participants from '../Participants';
import NetworkDetails from '../NetworkDetails';

// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import React from 'react';

// import { UserContext } from '../../context/UserContext';

export default function MoreButton({ subStats, rtcStats, stats }) {
  const title = 'More options';
  const [options, setOptions] = React.useState(['Report an issue', 'Participants', 'Network-expanded']);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [menuState, setMenuState] = React.useState(null);
  const [participantsMenuOpen, setParticipantsMenuOpen] = React.useState(false);

  const handleChangeMenu = (event, index) => {
    setSelectedIndex(index);
    if (index === 1) toggler();

    console.log(' index' + index);
    setOpen(false);
    // const videoDeviceId = devicesAvailable.find((device) => device.label === event.target.textContent).deviceId;
    // changeVideoSource(videoDeviceId);
  };
  const toggler = () => {
    console.log('toggling menu participants');
    setParticipantsMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    console.log('closing menu');
    setSelectedIndex(null);
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
            onClick={handleToggle}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
          >
            <More />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      {selectedIndex === 0 && <ReportIssue handleExit={handleClickAway} subStats={subStats} stats={stats}></ReportIssue>}
      {selectedIndex === 1 && <Participants toggler={toggler} participantsMenuOpen={participantsMenuOpen}></Participants>}
      {selectedIndex === 2 && <NetworkDetails handleExit={handleClickAway} subStats={subStats} stats={stats}></NetworkDetails>}

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 101 }}>
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
                      selected={index === selectedIndex}
                      onClick={(event) => handleChangeMenu(event, index)}
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
