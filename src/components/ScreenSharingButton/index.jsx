import ScreenOff from '@mui/icons-material/StopScreenShare';
import ScreenShare from '@mui/icons-material/ScreenShare';

import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import useDevices from '../../hooks/useDevices';
import LayoutManager from '../../utils/layout-manager';

import ButtonGroup from '@mui/material/ButtonGroup';
import { ArrowDropDown, MicOff } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { MenuItem, MenuList } from '@mui/material';
import { SessionContext } from '../../Context/session';

// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import React from 'react';
import { useContext } from 'react';

export default function ScreenSharingButton({ layout }) {
  const { session } = useContext(SessionContext);
  const screnSharingPub = React.useRef(null);

  const anchorRef = React.useRef(null);

  const [sharing, setSharing] = React.useState(false);
  const title = sharing ? 'Stop screen share' : 'Start screen share';

  async function toggleShareScreenClick() {
    console.log(session);
    if (session && !sharing) {
      screnSharingPub.current = OT.initPublisher(
        'video-container',
        { videoSource: 'screen', insertMode: 'append', width: '100%', height: '100%' },
        (err) => {
          if (err) {
            console.log('[usePublisher]', err);
          }
          console.log('Publisher Created');
        }
      );
      screnSharingPub.current.element.classList.add('OT_big');
      screnSharingPub.current.on('streamCreated', (e) => {
        setSharing(true);
      });
      screnSharingPub.current.on('mediaStopped', (e) => {
        setSharing(false);
      });
      session.publish(screnSharingPub.current);
    } else if (session && sharing) {
      session.unpublish(screnSharingPub.current);
      // mSession.unpublish({ session: session.current });
      setSharing(false);
    }
    layout.layout();
  }

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
            onClick={toggleShareScreenClick}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
          >
            {!sharing ? <ScreenShare className="bg-rose-50" /> : <ScreenOff />}
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </>
  );
}
