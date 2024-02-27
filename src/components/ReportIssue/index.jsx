import React from 'react';
import Card from '@mui/joy/Card';

import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts';
import { useState } from 'react';
import { ClickAwayListener, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { reportIssue } from '../../api/reportIssue';

import Tooltip from '@mui/material/Tooltip';
import { UserContext } from '../../Context/user';
import OT from '@opentok/client';

import Rating from '@mui/material/Rating';

import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

function NetworkDetails({ subStats, stats, handleExit, rtcStats }) {
  const [audioIssue, setAudioIssue] = React.useState(false);
  const [videoIssue, setVideoIssue] = React.useState(false);
  const [feedBack, setFeedBack] = useState('');

  const [stars, setStars] = useState(4);
  const { user } = React.useContext(UserContext);

  const issueOT = () => {
    return new Promise((res, rej) => {
      OT.reportIssue(function (err, resp) {
        if (err) rej(e);
        else {
          res(resp);
        }
      });
    });
  };

  const handleReportIssue = async (e) => {
    console.log('click reporting');
    e.preventDefault();
    const issueId = await issueOT();

    const issue = {
      stars: stars,
      audioIssue,
      videoIssue,
      feedBack,
      reconnections: user.issues.reconnections,
      audioFallbacks: user.issues.audioFallbacks,
      issueId: issueId,
      user: user.defaultSettings.name,
    };

    const resp = reportIssue(issue);
    // }
    // });
  };

  const handleFeedback = (e) => {
    if (!e) return;
    setFeedBack(e.target.value);
  };

  return (
    <ClickAwayListener onClickAway={handleExit}>
      <Card
        sx={{
          alignItems: 'start',
          backgroundColor: '#e6e0e0',
          zIndex: '10',
          position: 'absolute',
          bottom: '10vh',
          width: 320,
          height: 500,
        }}
      >
        <h2 className="mx-auto">Report an issue</h2>
        {user.issues.reconnections ? <div>Reconnections: {user.issues.reconnections}</div> : <span>You had no reconnections</span>}
        {user.issues.audioFallbacks ? (
          <div>Audio fallbacks: {user.issues.audioFallbacks}</div>
        ) : (
          <span>You did not go into audio fallback mode</span>
        )}
        <div className="flex">
          <span>Problem with Audio</span>
          <Switch label="Problem with video" />
        </div>
        <div className="flex">
          <span>Problem with Video</span>
          <Switch label="Problem with video" />
        </div>
        <TextField
          onChange={handleFeedback}
          value={feedBack}
          id="outlined-multiline-static"
          label="Add any details"
          multiline
          rows={4}
          defaultValue="..."
        />
        <Rating
          name="simple-controlled"
          value={stars}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
        <IconButton
          onClick={handleExit}
          sx={{
            margin: 'auto',
          }}
        >
          <Button onClick={handleReportIssue}>Send</Button>
        </IconButton>

        {/* {bitRate && (
          <>
            <div className="self-center m-top-2">
              <h1>Your upload Banwidth</h1>
            </div>
            <ChartContainer
              width={500}
              height={450}
              series={[{ data: [100, 250, ...bitRate], label: 'Upload Bitrate', type: 'line' }]}
              yAxis={[{ data: [0, 100, 200, 300, 500, 800, 10000], label: 'Bitrate (kbps)' }]}
              xAxis={[{ scaleType: 'point', data: Array.from({ length: bitRate.length + 2 }, (_, index) => index) }]}
            >
              <LinePlot />
              <MarkPlot />

              <ChartsReferenceLine y={200} label="Min BW at 640X480" lineStyle={{ stroke: 'red' }} />
              <ChartsReferenceLine y={600} label="Min BW at 1080X720" lineStyle={{ stroke: 'red' }} />
             
              <ChartsYAxis />
            </ChartContainer>
          </>
        )} */}
      </Card>
    </ClickAwayListener>
  );
}

export default NetworkDetails;
