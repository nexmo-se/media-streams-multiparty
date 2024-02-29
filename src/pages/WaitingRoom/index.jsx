import React from 'react';
import { useRef, useState, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OT from '@opentok/client';
import { isMobile } from '../../util';
const DFT_PUBLISHER_OPTIONS = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  publishAudio: true,
  publishVideo: true,
  // fitMode: 'contain',
};

import { getInitials, getAudioSourceDeviceId } from '../../util';
import Grid from '@mui/material/Grid';
import { DEVICE_ACCESS_STATUS } from '../../constants';
import DeviceAccessAlert from '../../components/DeviceAccessAlert';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import usePublisher from '../../hooks/publisher';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MicExternalOn from '@mui/icons-material/MicExternalOn';
import Speaker from '@mui/icons-material/Speaker';
import VideoCall from '@mui/icons-material/VideoCall';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import useDevices from '../../hooks/useDevices';
import useSound from '../../hooks/sound';
import { IconButton, LinearProgress } from '@mui/material';

import AudioSettingsWaitingRoom from '../../components/AudioSettingsWaitingRoom';
import VideoSettingsWaitingRoom from '../../components/VideoSettingsWaitingRoom';
import { UserContext } from '../../Context/user';

import BlurSettings from '../../components/BlurSettings';

function WaitingRoom() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const { togglePlay, playing } = useSound();
  const [logLevel, setLogLevel] = useState(0);
  const { user, setUser } = useContext(UserContext);
  let [audioDevice, setAudioDevice] = useState('');
  let [videoDevice, setVideoDevice] = useState('');
  const [userName, setUserName] = useState(user.username);
  let [audioOutputDevice, setAudioOutputDevice] = useState('');
  const [blur, setBlur] = useState(false);
  const [localVideoSource, setLocalVideoSource] = useState(undefined);
  const [localAudioSource, setLocalAudioSource] = useState(undefined);
  const [localAudioOutput, setLocalAudioOutput] = useState(undefined);
  const [localAudio, setLocalAudio] = useState(true);
  const [localVideo, setLocalVideo] = useState(DFT_PUBLISHER_OPTIONS.publishVideo);
  const { deviceInfo, getDevices } = useDevices();
  const [openAudioInput, setOpenAudioInput] = React.useState(false);
  const [openVideoInput, setOpenVideoInput] = React.useState(false);
  const [openAudioOutput, setOpenAudioOutput] = React.useState(false);
  const containerRef = useRef(null);
  const { initPublisher, destroyPublisher, publisher } = usePublisher();
  const [devices, setDevices] = useState(null);
  const [accessAllowed, setAccessAllowed] = useState(DEVICE_ACCESS_STATUS.PENDING);

  const handleClick = () => {
    setOpenAudioInput(!openAudioInput);
  };
  const handleClickVideo = () => {
    setOpenVideoInput(!openVideoInput);
  };
  const handleClickAudioOutput = () => {
    setOpenAudioOutput(!openAudioOutput);
  };

  const handleUsernameChange = useCallback((e) => {
    setUser({ ...user, username: e.target.value, initials: getInitials(e.target.value) });
    setUserName(e.target.value);
  }, []);

  const handleJoinClick = () => {
    console.log('clicked');
    localStorage.setItem('username', user.username);
    localStorage.setItem('localAudio', localAudio);
    localStorage.setItem('localVideo', localVideo);
    localStorage.setItem('localAudioSource', localAudioSource);
    localStorage.setItem('localVideoSource', localVideoSource);
    localStorage.setItem('localAudioOutput', localAudioOutput);
    if (playing) togglePlay();
    navigate({
      pathname: `/room/${roomName}`,
    });
  };

  useEffect(() => {
    if (
      localAudio !== user.defaultSettings.publishAudio ||
      localVideo !== user.defaultSettings.publishVideo ||
      localAudioSource !== user.defaultSettings.audioSource ||
      localVideoSource !== user.defaultSettings.videoSource ||
      blur !== user.defaultSettings.blur
    ) {
      console.log('audio source' + localAudioSource);
      console.log('video source' + localVideoSource);

      setUser({
        ...user,
        defaultSettings: {
          publishAudio: localAudio,
          publishVideo: localVideo,
          audioSource: localAudioSource,
          videoSource: localVideoSource,
          name: userName,
          blur: blur,
        },
      });
    }
  }, [localVideo, localAudio, userName, blur, localAudioSource, localVideoSource]);

  const handleChangeOutput = useCallback(
    (e) => {
      const audioOutputId = e.target.getAttribute('value');
      setAudioOutputDevice(audioOutputId);
      OT.setAudioOutputDevice(audioOutputId);
      setLocalAudioOutput(audioOutputId);
    },
    [setLocalAudioOutput, setAudioOutputDevice]
  );

  const handleAudioChange = React.useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);
  const handleBlurChange = React.useCallback(
    (e) => {
      if (!publisher) return;
      if (blur) {
        publisher.clearVideoFilter();
      } else {
        publisher.applyVideoFilter({
          type: 'backgroundBlur',
          blurStrength: 'high',
        });
      }
      setBlur(e.target.checked);
    },
    [publisher, blur]
  );

  const handleVideoChange = React.useCallback((e) => {
    console.log('toggling local video');
    setLocalVideo(e.target.checked);
  }, []);

  const calculateAudioLevel = React.useCallback((audioLevel) => {
    let movingAvg = null;
    if (movingAvg === null || movingAvg <= audioLevel) {
      movingAvg = audioLevel;
    } else {
      movingAvg = 0.8 * movingAvg + 0.2 * audioLevel;
    }
    // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
    const currentLogLevel = Math.log(movingAvg) / Math.LN10 / 1.5 + 1;
    setLogLevel(Math.min(Math.max(currentLogLevel, 0), 1) * 100);
  }, []);

  const handleVideoSource = useCallback(
    (e) => {
      const videoDeviceId = e.target.getAttribute('value');
      setVideoDevice(videoDeviceId);
      publisher.setVideoSource(videoDeviceId);
      setLocalVideoSource(videoDeviceId);
    },
    [publisher, setVideoDevice, setLocalVideoSource]
  );

  const handleAudioSource = useCallback(
    (e) => {
      console.log(e);
      const audioDeviceId = e.target.getAttribute('value');

      setAudioDevice(audioDeviceId);

      publisher.setAudioSource(audioDeviceId);
      setLocalAudioSource(audioDeviceId);
    },
    [publisher, setAudioDevice, setLocalAudioSource]
  );

  React.useEffect(() => {
    if (publisher && deviceInfo) {
      const currentVideoDevice = publisher.getVideoSource();
      const currentAudioDevice = publisher.getAudioSource();
      setAudioDevice(deviceInfo.audioInputDevices, currentAudioDevice);
      setLocalAudioSource(getAudioSourceDeviceId(deviceInfo.audioInputDevices, currentAudioDevice));
      console.log(currentAudioDevice);
      console.log(currentVideoDevice);
      setVideoDevice(currentVideoDevice.deviceId);
      // setLocalAudioSource(currentAudioDevice);
      setLocalVideoSource(currentVideoDevice.deviceId);
      OT.getActiveAudioOutputDevice().then((currentAudioOutputDevice) => {
        setAudioOutputDevice(currentAudioOutputDevice.deviceId);
        setLocalAudioOutput(currentAudioOutputDevice.deviceId);
      });
    }
  }, [deviceInfo, publisher, setAudioDevice, setVideoDevice, setAudioOutputDevice]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(localAudio);
    }
  }, [blur, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(localVideo);
    }
  }, [localVideo, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.on('accessAllowed', () => {
        setAccessAllowed(DEVICE_ACCESS_STATUS.ACCEPTED);
        console.log('getting devices');
        getDevices();
      });
      publisher.on('accessDenied', () => {
        setAccessAllowed(DEVICE_ACCESS_STATUS.REJECTED);
      });
      publisher.on('audioLevelUpdated', ({ audioLevel }) => {
        calculateAudioLevel(audioLevel);
      });

      // return () => {
      //   publisher.off('accessAllowed', () => {});
      //   publisher.off('audioLevelUpdated', () => {});
      // };
    }
  }, [publisher, calculateAudioLevel]);

  useEffect(() => {
    if (containerRef.current && !publisher) {
      initPublisher(containerRef.current.id, DFT_PUBLISHER_OPTIONS);
    }

    return () => {
      console.log('destroying pub');
      destroyPublisher();
    };
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <div className="flex m-auto max-w-screen-sm max-h-screen  w-['360px'] p-['25px',] left-['50%',] top-['50%',]">
        <Grid className="border-solid" container direction="column" justifyContent="center" alignItems="center">
          <List
            sx={{ width: '100%', maxWidth: '60%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <div id="pub-preview" className="m-auto h-[240px] w-[320px]" ref={containerRef}></div>
            <Stack
              component="form"
              sx={{
                // width: '30vw',
                marginTop: '5px',
                padding: '7px',
              }}
              spacing={2}
              required
              noValidate
              autoComplete="off"
            >
              <TextField
                size="small"
                margin="dense"
                variant="outlined"
                onChange={handleUsernameChange}
                // margin="normal"
                required
                fullWidth
                id="user-name"
                label="User Name"
                name="user Name"
                autoComplete="User name"
                autoFocus
                value={userName}
              />
            </Stack>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <MicExternalOn />
              </ListItemIcon>
              <ListItemText primary="Audio source" />
              {openAudioInput ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAudioInput} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {deviceInfo.audioInputDevices.map((device) => (
                  // const deviceId = device.deviceId
                  <ListItemButton
                    value={device.deviceId}
                    key={device.deviceId}
                    sx={{ pl: 4, backgroundColor: device.deviceId === localAudioSource ? 'rgb(156,39,176)' : '' }}
                  >
                    {/* <ListItemText onClick={handleAudioSource} primary={device.label} value={device.deviceId}></ListItemText> */}
                    <span
                      // className={device.deviceId === localAudioSource ? 'background-black' : ''}
                      value={device.deviceId}
                      onClick={handleAudioSource}
                    >
                      {device.label}
                    </span>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <ListItemButton onClick={handleClickVideo}>
              <ListItemIcon>
                <VideoCall />
              </ListItemIcon>
              <ListItemText primary="Video source" />
              {openVideoInput ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVideoInput} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {deviceInfo.videoInputDevices.map((device) => (
                  <ListItemButton
                    key={device.deviceId}
                    sx={{ pl: 4, backgroundColor: device.deviceId === localVideoSource ? 'rgb(156,39,176)' : '' }}
                  >
                    <span value={device.deviceId} onClick={handleVideoSource}>
                      {device.label}
                    </span>
                    {/* <ListItemText primary={device.label} key={device.deviceId} value={device.deviceId}></ListItemText> */}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <ListItemButton onClick={handleClickAudioOutput}>
              <ListItemIcon>
                <Speaker />
              </ListItemIcon>
              <ListItemText primary="Audio output" />
              {openAudioOutput ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAudioOutput} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {deviceInfo.audioOutputDevices.map((device) => (
                  <ListItemButton
                    key={device.deviceId}
                    sx={{ pl: 4, backgroundColor: device.deviceId === localAudioOutput ? 'rgb(156,39,176)' : '' }}
                  >
                    <span value={device.deviceId} onClick={handleChangeOutput}>
                      {device.label}
                    </span>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <Button variant="outlined" onClick={togglePlay} startIcon={<Speaker />}>
              {!playing ? 'Test speaker' : 'Stop sound'}
            </Button>

            <div className="my-5 flex justify-center ">
              <Grid container direction="column" justifyContent="center" alignItems="center">
                <AudioSettingsWaitingRoom hasAudio={localAudio} onAudioChange={handleAudioChange} />
                <Box sx={{ width: '50%' }}>
                  <LinearProgress variant="determinate" value={logLevel}></LinearProgress>
                </Box>
                <VideoSettingsWaitingRoom hasVideo={localVideo} onVideoChange={handleVideoChange} />
                {OT.hasMediaProcessorSupport() ? (
                  <BlurSettings hasBlur={blur} onBlurChange={handleBlurChange} />
                ) : (
                  'Blur not supported in your browser'
                )}

                <Button
                  onClick={handleJoinClick}
                  className="border-[3px] border-black"
                  variant="contained"
                  color="secondary"
                  disabled={!userName}
                >
                  Join Call
                </Button>
              </Grid>
            </div>
          </List>
        </Grid>
        {/* </Box> */}
        {/* </Container> */}
      </div>
      {!isMobile() && accessAllowed !== DEVICE_ACCESS_STATUS.ACCEPTED && (
        <DeviceAccessAlert accessStatus={accessAllowed}></DeviceAccessAlert>
      )}
    </React.Fragment>
  );
}

export default WaitingRoom;
