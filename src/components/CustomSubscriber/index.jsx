import React, { useEffect, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';

function CustomSubscriber({ mediaStream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      videoRef.current.srcObject = new MediaStream([videoTrack, audioTrack]);

      const handleStreamChange = () => {
        console.log('stream changed');
        if (mediaStream !== videoRef.current.srcObject) {
          const newAudioTrack = mediaStream.getAudioTracks()[0];
          const newVideoTrack = mediaStream.getVideoTracks()[0];
          videoRef.current.srcObject = new MediaStream([newAudioTrack, newVideoTrack]);
        }
      };

      videoRef.current.addEventListener('play', handleStreamChange);

      return () => {
        videoRef.current.removeEventListener('play', handleStreamChange);
      };
    }
  }, [mediaStream]);

  return (
    <div className="block overflow-hidden">
      <PushPinIcon />
      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomSubscriber;
