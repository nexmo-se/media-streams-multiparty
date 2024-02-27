import React from 'react';

import MicIcon from '@mui/icons-material/Mic';

import Switch from '@mui/material/Switch';

const AudioSettingsWaitingRoom = ({ hasAudio, onAudioChange, className }) => {
  return (
    <div className="flex">
      <MicIcon />
      <div className="mx-4">Microphone</div>
      <Switch checked={hasAudio} onChange={onAudioChange} name="AudioToggle" />
    </div>
  );
};

export default AudioSettingsWaitingRoom;
