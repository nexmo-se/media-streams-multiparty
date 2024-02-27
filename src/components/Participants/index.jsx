import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import { VolumeMuteOutlined, VolumeOffOutlined } from '@mui/icons-material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { ClickAwayListener, IconButton } from '@mui/material';
// import { SubscriberContext } from '../Context/subscriber';
import { useEffect, useContext } from 'react';
import { SessionContext } from '../../Context/session';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
function Participants({ toggler, participantsMenuOpen }) {
  const { subscribers } = useContext(SessionContext);
  // const { subscribers } = React.useContext(SubscriberContext);
  //   const [bitRate, setBitRate] = React.useState([]);
  //   const [resolution, setResolution] = React.useState(null);
  //   const [fps, setFps] = React.useState(null);
  //   const [packetLoss, setPacketLoss] = React.useState(null);
  //   const [protocol, setProtocol] = useState(null);
  //   const [layers, setLayers] = useState(null);

  // const subscribers = ['Javier', 'Pedrillo', 'Antonio'];

  // const [state, setState] = React.useState(participantsMenuOpen);

  // const toggleDrawer = (anchor, open) => (event) => {
  //   if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }
  //   console.log('toggling drawer');

  //   // setState({ ...state, [anchor]: open });
  //   setState((prev) => !prev);
  // };

  const subscribe = (value) => {
    if (!subscribers) return;
    const resolution = value === 'low' ? { width: 320, height: 240 } : { width: 640, height: 480 };
    subscribers.forEach((subscriber) => {
      subscriber.setPreferredResolution(resolution);
    });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem key={'you'} disablePadding>
          <ListItemButton>
            <PersonIcon></PersonIcon>
            <ListItemText className="mx-3" primary={'You'} />
          </ListItemButton>
        </ListItem>

        {subscribers.length > 0 &&
          subscribers.map((sub) => (
            <>
              <ListItem key={sub.stream.id} disablePadding>
                <ListItemButton>
                  <PersonIcon></PersonIcon>
                  <ListItemText className="mx-3" primary={sub.stream?.name} />
                  {sub.stream.hasAudio ? <VolumeMuteOutlined></VolumeMuteOutlined> : <VolumeOffOutlined></VolumeOffOutlined>}
                  {sub.stream.hasVideo ? <VideocamIcon></VideocamIcon> : <VideocamOffIcon></VideocamOffIcon>}
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          ))}
      </List>
    </Box>
  );
  const anchor = 'left';

  //   React.useEffect(() => {
  //     if (stats && stats.bandwidth && stats.bandwidth > 0) {
  //       console.log(stats);
  //       const bitRate = stats.bandwidth;
  //       setBitRate((prevbitrate) => [...prevbitrate, bitRate]);
  //       setResolution(`${stats.width}X${stats.height}`);
  //       setFps(stats.frameRate);
  //       setPacketLoss(stats.packetLoss);
  //       setLayers(stats.simulcastLayers);
  //     }
  //   }, [stats]);

  return (
    <div>
      {/* {['left', 'right', 'top', 'bottom'].map((anchor) => ( */}

      <React.Fragment key={anchor}>
        {/* <ClickAwayListener onClickAway={toggler}> */}
        {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
        <Drawer anchor={anchor} open={participantsMenuOpen} onClose={toggler}>
          {list(anchor)}
        </Drawer>
        {/* </ClickAwayListener> */}
      </React.Fragment>
      {/* ))} */}
    </div>
  );
}

export default Participants;
