import React, { useEffect, useContext, useRef, useState } from 'react';
import { Mic, MicOff, Info } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { UserContext } from '../../Context/user';
import { SessionContext } from '../../Context/session';
function CustomSubscriber({ subscriber }) {
  const videoRef = useRef(null);
  const mSession = useContext(SessionContext);
  const { user } = useContext(UserContext);
  const speakingThreshold = 1000;
  const notSpeakingThreshold = 2000;
  const element = subscriber.element;
  const [isTalking, setIsTalking] = useState(false);
  const [res, setRes] = React.useState(false);
  const subs = subscriber.subscriber;
  const audioStream = {
    isTalking: false,
    timestamp: 0,
  };
  // let mediaStream
  // 'we're prusmably not seeing this because it's being attached to the subscriber too late? 
  console.warn(subs)
  subs.on('mediaStreamAvailable', (event) => {
    console.warn('mediaStreamAvailable')
    console.warn(event)
  })

  useEffect(() => {
    if (subs && videoRef.current) {
      subs.on('audioLevelUpdated', onAudioLevel);
      const resize = mSession.createResizeObserver(subs);
      resize.observe(document.getElementById(subs.stream.id));
    }
  }, [subs, videoRef.current]);

  function onAudioLevel(event) {
    const now = new Date().getTime();
    if (event && event.audioLevel > 0.2) {
      // it could be speaking
      if (!audioStream.isTalking) {
        audioStream.isTalking = true;
        audioStream.timestamp = new Date().getTime();
      } else if (audioStream.isTalking && now - audioStream.timestamp > speakingThreshold) {
        audioStream.isTalking = true;
        audioStream.timestamp = new Date().getTime();
        setIsTalking(true);
        // this means that it's speaking for more than X seconds
        // updateActiveSpeakerEl(elementId, "add");
      }
    } else if (audioStream.isTalking && now - audioStream.timestamp > notSpeakingThreshold) {
      // low audio detected for X seconds
      audioStream.isTalking = false;
      setIsTalking(false);
    }
  }

  const handleShowRes = () => {
    setRes((prev) => !prev);
  };
  
  const mediaStream = element.srcObject;
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.setAttribute('id', element.id);
      const handleStreamChange = () => {
        console.log('stream changed');
        if (mediaStream !== element.srcObject) {
          console.log('inside stream changer');
          videoRef.current.srcObject = element.srcObject;
        }
      };

      element.addEventListener('play', handleStreamChange);

      return () => {
        element.removeEventListener('play', handleStreamChange);
      };
    }
  }, [element, mediaStream]);

  return (
    <div className="absolute w-full m-auto">
      {/* {subs.stream.hasAudio ? ( */}
      <>
        {subs.stream.hasAudio ? (
          <Mic sx={{ position: 'absolute', left: '10px', top: '10px' }}></Mic>
        ) : (
          <MicOff sx={{ position: 'absolute', left: '10px', top: '10px' }}></MicOff>
        )}

        <Tooltip title={`Resolution: ${subs.videoWidth()}x${subs.videoHeight()}`}>
          <IconButton onMouseOver={handleShowRes} sx={{ zIndex: '10', position: 'absolute', right: '10px', top: '10px' }}>
            <Info />
          </IconButton>
        </Tooltip>
        {/* {res && <div>Res: {`${subs.videoWidth()}x${subs.videoHeight()}`}</div>} */}
      </>
      <p className="absolute my-10 z-10 text-xs font-bold flex tracking-widest px-2">{user.username}</p>
      <video
        className={isTalking ? 'border-solid border-lime-400 border-2' : ''}
        width="100%"
        ref={videoRef}
        autoPlay
        id={subs.stream.id}
        playsInline
        muted
      ></video>
    </div>
  );
}

export default CustomSubscriber;
