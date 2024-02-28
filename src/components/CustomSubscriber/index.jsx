import React, { useEffect, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';

function CustomSubscriber({ element }) {
  const videoRef = useRef(null);
  console.log(element);

  useEffect(() => {
    const mediaStream = element.srcObject;
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
  }, [element]);

  return (
    <div className="">
      {/* <div className="absolute z-20"> */}
      {/* <PushPinIcon sx={{ position: 'absolute' }} /> */}

      <video height="100%" width="100%" ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomSubscriber;
