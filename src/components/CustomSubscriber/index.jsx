import React, { useEffect, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';

function CustomSubscriber({ element }) {
  const videoRef = useRef(null);
  console.log(element);
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

  return <video height="100%" width="100%" ref={videoRef} autoPlay playsInline muted></video>;
}

export default CustomSubscriber;
