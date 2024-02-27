import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/joy/IconButton';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import { Card, CardActions, CardContent } from '@mui/material';
import { SessionContext } from '../../Context/session';
import { isMobile } from '../../util';
import Stack from '@mui/material/Stack';

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            padding: '5px',
            color: 'white',
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

// import styles from './styles';

export default function RoomCreation() {
  const [room, setRoom] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const mSession = useContext(SessionContext);
  const navigate = useNavigate();
  const outerTheme = useTheme();

  const redirectNewMeeting = () => {
    if (!room) return;
    navigate(`/waiting-room/${room}`);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div className="bg-black flex w-screen h-screen justify-evenly">
      {/* <div className="flex"> */}
      <div className="flex justify-center w-1/2">
        <div className="flex justify-center flex-col">
          <div className=" justify-center">
            <img width="100px" className="flex m-auto flex-1 justify-end" src="./images/vonage-logo.svg" alt="" />
            <div className="flex m-2 text-white flex-col">
              <h2 className="m-2">Welcome to the Vonage Sample app</h2>
              <p className="m-1">Let's join</p>
              <span className="m-1">Meeting ID</span>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  onChange={handleRoomChange}
                  sx={{ color: 'white' }}
                  focused
                  placeholder="my meeting"
                  color="secondary"
                  id="outlined-basic"
                  label="Meeting Id"
                  variant="filled"
                />
              </ThemeProvider>
              <Button onClick={redirectNewMeeting} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!isMobile() && (
        <div className="flex h-screen w-screen h-full-screen flex-1 items-center justify-center">
          <img height="100%" className="flex flex-1 justify-end" src="./images/img-entrance-1.jpg" alt="" />
        </div>
      )}
    </div>
  );
}
