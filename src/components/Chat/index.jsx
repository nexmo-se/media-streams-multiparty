import React from 'react';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import { IconButton } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import Button from '@mui/material/Button';
import { useChat } from '../../hooks/chat';
import { SessionContext } from '../../Context/session';
import { UserContext } from '../../Context/user';
import { getInitials } from '../../util';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Chat({ handleClick }) {
  const { user } = React.useContext(UserContext);
  const mSession = React.useContext(SessionContext);
  const session = mSession.session;
  const [text, setText] = React.useState('');
  const { messages, addMessages, onSignalChat, sendSignalChat, sendSignalSharing } = useChat({ session });

  const changeText = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleChatMessage(e);
    }
  };
  async function handleChatMessage(e) {
    console.log('click');
    e.preventDefault();
    let _text = text.replace(/^\s+|\s+$/g, '');
    if (_text.length) {
      try {
        console.log('gonnag send' + _text);
        await sendSignalChat({ text: _text, username: getInitials(user.username) });
      } catch (error) {
        console.log(error.message);
      }
    }
    setText('');
  }
  return (
    <Grid height={'80vh'} item xs={3}>
      {mSession.messages.map((message) => (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
          <Avatar>{message.from.toUpperCase()}</Avatar>
          <Item className="m-3">{message.text}</Item>
          <span>{message.time}</span>
        </Box>
      ))}
      {/* <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar>JG</Avatar>
        <Item className="m-3">I do not think so</Item>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar>JG</Avatar>
        <Item className="m-3">Can you send the link</Item>
      </Box> */}

      <div className=" flex absolute bottom-[100px]">
        <Input
          onChange={changeText}
          onKeyDown={handleKeyDown}
          // sx={{
          //   position: 'absolute',
          //   bottom: '12vh',
          // }}
          value={text}
          placeholder="Type in here…"
          variant="solid"
        />
        <IconButton onClick={handleChatMessage}>
          <Button>Send</Button>
        </IconButton>
      </div>
    </Grid>
  );
}

export default Chat;
