import React from 'react';

import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';

import Switch from '@mui/material/Switch';

const VideoSettingsWaitingRoom = ({ hasVideo, onVideoChange }) => {
  return (
    <div className="flex items-center">
      <PhotoCameraFrontIcon />
      <div className="mx-4">Camera</div>
      <Switch checked={hasVideo} onChange={onVideoChange} name="videoToggle" />
    </div>
  );
};

export default VideoSettingsWaitingRoom;
