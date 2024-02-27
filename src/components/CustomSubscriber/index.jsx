import React, { useEffect, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';

function CustomSubscriber({ mediaStream, element }) {
  const videoRef = useRef(null);
  console.log(element);
  const mediaStreamRef = useRef(null);
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      mediaStreamRef.current = mediaStream;
      videoRef.current.srcObject = new MediaStream([videoTrack, audioTrack]);

      const handleStreamChange = () => {
        console.log('stream changed');
        if (mediaStream !== videoRef.current.srcObject) {
          const newAudioTrack = element.srcObject.getAudioTracks()[0];
          const newVideoTrack = element.srcObject.getVideoTracks()[0];
          videoRef.current.srcObject = new MediaStream([newAudioTrack, newVideoTrack]);
          console.log(new MediaStream([newAudioTrack, newVideoTrack]));
          mediaStreamRef.current = element.srcObject;
        }
      };

      element.addEventListener('play', handleStreamChange);

      return () => {
        element.removeEventListener('play', handleStreamChange);
      };
    }
  }, [mediaStream, element]);

  return (
    <div className="block overflow-hidden">
      {/* <div className="absolute z-20"> */}
      {/* <PushPinIcon sx={{ position: 'absolute' }} /> */}

      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomSubscriber;
