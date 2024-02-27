import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemButton from '@mui/joy/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener } from '@mui/material';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Tooltip from '@mui/material/Tooltip';
import TuneIcon from '@mui/icons-material/Tune';

import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import { CloudUpload } from '@mui/icons-material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Card>
          <Typography>{children}</Typography>
        </Card>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Test({ handleExit, subStats, rtcStats, stats }) {
  const [value, setValue] = React.useState(0);
  // const [bitRate, setBitRate] = React.useState([]);
  // const [resolution, setResolution] = React.useState(null);
  // const [fps, setFps] = React.useState(null);
  // const [packetLoss, setPacketLoss] = React.useState(null);
  // const [protocol, setProtocol] = React.useState(null);
  const [layers, setLayers] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // React.useEffect(() => {
  //   if (stats && stats.bandwidth && stats.bandwidth > 0) {
  //     // setBitRate((prevbitrate) => [...prevbitrate, bitRate]);

  //     setLayers(stats.simulcastLayers);
  //   }
  // }, [stats, rtcStats]);

  return (
    <ClickAwayListener onClickAway={handleExit}>
      <Card sx={{ zIndex: 5, width: '50vw', height: '70vh', position: 'absolute', top: '-70vh' }}>
        <Card sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Video" {...a11yProps(0)} />
            <Tab label="Audio" {...a11yProps(1)} />
          </Tabs>
        </Card>

        {stats && (
          <CustomTabPanel value={value} index={0}>
            <List>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is ratio of packet loss">
                    <SignalWifi1BarIcon></SignalWifi1BarIcon>
                    <span> {`Packet loss: ${stats.packetLoss * 100} %`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the ICE candidate that succeeded">
                    <span> {`Network type: ${stats.networkType}`}</span>
                  </Tooltip>
                </ListItemButton>
                <ListItemDecorator></ListItemDecorator>
                <Tooltip title="This is VPN status">
                  <VpnLockIcon></VpnLockIcon>
                  <span> {`VPN : ${stats.hasVpn}`}</span>
                </Tooltip>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is ratio of packet loss">
                    <span> {`Candidate type: ${stats.candidateType}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is Codec">
                    <VpnLockIcon></VpnLockIcon>
                    <span> {`Video Codec : ${stats.codec}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <h1 className="self-center">Layers</h1>
              {stats.simulcastLayers &&
                stats.simulcastLayers.map((layer) => (
                  <div>
                    <Tooltip title="These are the simulcast layers">
                      <AspectRatioIcon></AspectRatioIcon>
                      <span> {`Resolution: ${layer.width}X${layer.height};`}</span>
                      <span> {`Frames: ${layer.framesPerSecond}`}</span>
                      {layer.qualityLimitationReason !== 'none' && <span> {`QualityLimitation: ${layer.qualityLimitationReason}`}</span>}
                    </Tooltip>
                  </div>
                ))}
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the upload bandwidth">
                    <CloudUpload></CloudUpload>
                    <span> {`Bandwidth  : ${stats.bandwidth} Kbps`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              {subStats && (
                <ListItem>
                  <ListItemButton variant="outlined">
                    <ListItemDecorator></ListItemDecorator>

                    <Tooltip title="This is the upload bandwidth">
                      <CloudUpload></CloudUpload>
                      <span> {`Bandwidth  : ${subStats.vbw} Kbps`}</span>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the Media protocol">
                    <span> {`Protocol  : ${stats.protocol}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the Media protocol">
                    <span> {`Port  : ${stats.port}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the Media protocol">
                    <span> {`Local Ip  : ${stats.localIp}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is the remote port">
                    <span> {`Remote port : ${stats.remotePort}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton variant="outlined">
                  <ListItemDecorator></ListItemDecorator>

                  <Tooltip title="This is remote ip">
                    <span> {`Remote Ip  : ${stats.remoteIp}`}</span>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            </List>
          </CustomTabPanel>
        )}
        {!stats && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
          </Box>
        )}

        <CustomTabPanel value={value} index={1}>
          <List>
            <ListItem>
              <ListItemButton variant="outlined">
                <ListItemDecorator></ListItemDecorator>

                <Tooltip title="Audio codec">
                  {/* <CloudUpload></CloudUpload> */}
                  <span> {`Audio Codec : ${stats?.audioCodec}`}</span>
                </Tooltip>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton variant="outlined">
                <ListItemDecorator></ListItemDecorator>

                <Tooltip title="Jitter audio">
                  <SignalWifi1BarIcon></SignalWifi1BarIcon>
                  <span> {`Jitter : ${stats?.jitterAudio}`}</span>
                </Tooltip>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton variant="outlined">
                <ListItemDecorator></ListItemDecorator>

                <Tooltip title="Audio packet loss">
                  <SignalWifi1BarIcon></SignalWifi1BarIcon>
                  <span> {`Audio Packet loss : ${stats?.audioPacketLoss}`}</span>
                </Tooltip>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton variant="outlined">
                <ListItemDecorator></ListItemDecorator>

                <Tooltip title="Audio bandwidth">
                  <CloudUpload></CloudUpload>
                  <span> {`Audio Bandwidth : ${stats?.audioBandwidth} Kbps`}</span>
                </Tooltip>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton variant="outlined">
                <ListItemDecorator></ListItemDecorator>

                <Tooltip title="This setting is useful for large calls with many audio participants">
                  <span> {`DTX enabled : false`}</span>
                </Tooltip>
              </ListItemButton>
            </ListItem>
          </List>
        </CustomTabPanel>
      </Card>
    </ClickAwayListener>
  );
}
