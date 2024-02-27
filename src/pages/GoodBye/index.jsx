import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/joy/IconButton';

import { Card, CardActions, CardContent } from '@mui/material';
import { SessionContext } from '../../Context/session';

// import styles from './styles';

export default function EndCall() {
  const [sessionId, setSessionId] = useState(null);
  const mSession = useContext(SessionContext);
  const navigate = useNavigate();

  const redirectNewMeeting = () => {
    navigate('/');
  };

  //   useEffect(() => {
  //     if (!mSession) return;
  //     console.log(mSession);
  //     setSessionId(mSession.session.id);
  //   });

  return (
    <div className="flex flex-row items-center content-center">
      <div className="w-1/2 h-[100px] m-3xl">
        <h2>This is an amazing meeting</h2>
        <h2>I hope you have had fun with us</h2>

        <IconButton onClick={redirectNewMeeting}>Start new meeting</IconButton>
      </div>
      <div className="m-[200px] h-[100px] w-1/2 items-center">
        <Card className="" variant="outlined">
          <CardActions>
            <div className="m-auto">Work in Progress</div>
            {sessionId && <CardContent>{sessionId}</CardContent>}
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
