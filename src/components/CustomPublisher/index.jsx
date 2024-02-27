import React, { useEffect, useMemo, useState, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
function CustomPublisher({ mediaStream }) {
  const videoRef = useRef(null);
  let streamRef = null;
  useEffect(() => {
    if (mediaStream) {
      //   videoRef.current = elem;

      console.log(mediaStream);
      // const stream = sub._.webRtcStream();
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      // videoRef.current.srcObject = elem.srcObject;
      videoRef.current.srcObject = new MediaStream([videoTrack, audioTrack]);
      streamRef = mediaStream;
      const originalAddTrack = mediaStream.addTrack.bind(mediaStream);
      const originalRemoveTrack = mediaStream.removeTrack.bind(mediaStream);
      mediaStream.addTrack = (newTrack) => {
        console.log(newTrack);
        originalAddTrack(newTrack);
        videoRef.current.srcObject.addTrack(newTrack);
        // update your local stream
      };
      mediaStream.removeTrack = (oldTrack) => {
        originalRemoveTrack(oldTrack);
        videoRef.current.srcObject.removeTrack(oldTrack);
        // update your local stream
      };

      // videoRef.current.onplay = () => {
      //   console.log('stream changed');
      //   if (streamRef !== videoRef.current.srcObject) {
      //     // Update stream with the new value
      //     const newAudioTrack = streamRef.getAudioTracks()[0];
      //     const newVideoTrack = streamRef.getVideoTracks()[0];
      //     streamRef = videoRef.current.srcObject;
      //     videoRef.current.srcObject = new MediaStream([newAudioTrack, newVideoTrack]);
      //   }
      // };
    }
  }, [mediaStream, streamRef]);
  return (
    // <video height={'100%'} width={'100%'} ref={videoRef} autoPlay playsInline muted></video>
    <div className="block overflow-hidden">
      <PushPinIcon></PushPinIcon>

      <video width="100%" ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomPublisher;
