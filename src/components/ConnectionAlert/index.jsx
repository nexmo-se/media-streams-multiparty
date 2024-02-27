import * as React from 'react';
import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Warning from '@mui/icons-material/Warning';

function ConnectionAlert({ message1, message2 }) {
  return (
    <Stack className="absolute z-10">
      <Alert
        variant="soft"
        color="danger"
        invertedColors
        startDecorator={
          <CircularProgress size="lg" color="danger">
            <Warning />
          </CircularProgress>
        }
        sx={{ alignItems: 'flex-start', gap: '1rem' }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography level="title-md">{message1}</Typography>
          <Typography level="body-md">{message2}</Typography>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}></Box>
        </Box>
      </Alert>
    </Stack>
  );
}

export default ConnectionAlert;
