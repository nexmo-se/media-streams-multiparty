import React, { useEffect, useMemo, useState, useRef, useContext } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@mui/base';
import { styled } from '@mui/material/styles';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { UserContext } from '../../Context/user';

function CustomPublisher({ mediaStream, audioLevel }) {
  const videoRef = useRef(null);
  const { user } = useContext(UserContext);
  const [muted, setMuted] = useState(false);
  //   let streamRef = null;

  useEffect(() => {
    if (mediaStream) {
      console.log(mediaStream);
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div>
      <GraphicEqIcon sx={{ position: 'absolute', left: '10px', top: '10px', color: audioLevel > 0.2 ? 'blue' : null }}></GraphicEqIcon>
      <p className="absolute my-10 z-10 text-xs font-bold flex tracking-widest px-2">{user.username}</p>
      <video height="100%" width="100%" ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomPublisher;
