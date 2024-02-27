import React from 'react';

import BlurOnIcon from '@mui/icons-material/BlurOn';

import Switch from '@mui/material/Switch';

const BlurSettings = ({ hasBlut, onBlurChange }) => {
  return (
    <div className="flex items-center">
      <BlurOnIcon />
      <div className="mx-4">Blur</div>
      <Switch checked={hasBlut} onChange={onBlurChange} name="videoToggle" />
    </div>
  );
};

export default BlurSettings;
