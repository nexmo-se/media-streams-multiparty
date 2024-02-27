import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import ReportIssue from '../ReportIssue';
import Participants from '../Participants';
import { ClickAwayListener } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import NetworkDetails from '../NetworkDetails/index';
function MoreSettings({ subStats, rtcStats, stats }) {
  const [menuState, setMenuState] = React.useState(null);
  const [participantsMenuOpen, setParticipantsMenuOpen] = React.useState(false);

  const toggler = () => {
    console.log('toggling menu participants');
    setParticipantsMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    console.log('closing menu');
    setMenuState(null);
  };

  const handleMenuItem = (submenu) => {
    setMenuState(submenu);
  };
  return (
    <>
      <Dropdown className="contents">
        <MenuButton className="contents" slots={{ root: IconButton }} slotProps={{ root: { variant: '', color: 'neutral' } }}>
          <MoreVert className="my-5 contents" fontSize="large" />
        </MenuButton>
        <Menu>
          <MenuItem
            onClick={() => {
              handleMenuItem('network');
            }}
          >
            Network
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuItem('participants');
              toggler();
            }}
          >
            Participants
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuItem('participants-expanded');
              toggler();
            }}
          >
            Participants 2
          </MenuItem>
        </Menu>
      </Dropdown>
      {menuState === 'network' && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <ReportIssue handleExit={handleClickAway} subStats={subStats} rtcStats={rtcStats} stats={stats}></ReportIssue>
        </ClickAwayListener>
      )}
      {menuState === 'participants' && (
        // <ClickAwayListener onClickAway={handleClickAway}>
        <Participants
          // open={menuState === 'participants'}
          toggler={toggler}
          participantsMenuOpen={participantsMenuOpen}
          // handleExit={handleClickAway}
        ></Participants>
        // </ClickAwayListener>
      )}
      {menuState === 'participants-expanded' && <NetworkDetails subStats={subStats} rtcStats={rtcStats} stats={stats}></NetworkDetails>}
    </>
  );
}
export default MoreSettings;
