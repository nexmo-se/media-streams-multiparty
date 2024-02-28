import React, { useEffect, useMemo, useState, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
function CustomPublisher({ mediaStream }) {
  const videoRef = useRef(null);
  //   let streamRef = null;
  useEffect(() => {
    if (mediaStream) {
      console.log(mediaStream);
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);
  return <video height="100%" width="100%" ref={videoRef} autoPlay playsInline muted></video>;
}

export default CustomPublisher;
