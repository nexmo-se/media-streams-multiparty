import { DEVICE_ACCESS_STATUS } from './../../constants';

const askDeviceMessage = 'To join the video room, your browser will request access to your cam and mic.';
const deniedDeviceMessage = 'It seems your browser is blocked from accessing your camera and/or microphone';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import { Box } from '@mui/joy';
import Typography from '@mui/joy/Typography';
export default function DeviceAccessAlert({ accessStatus }) {
  const messageToDisplay = accessStatus === DEVICE_ACCESS_STATUS.PENDING ? askDeviceMessage : deniedDeviceMessage;
  const imgToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING ? '/images/access-dialog-pending.png' : '/images/access-dialog-rejected.png';
  const severity = accessStatus === DEVICE_ACCESS_STATUS.PENDING ? 'success' : 'error';
  return (
    <Stack sx={{ width: '40%' }} spacing={4} className="absolute start-1/3 top-1/3 z-10">
      {accessStatus && (
        <Alert severity={severity} sx={{ bgcolor: 'white', color: 'white' }} variant="outlined">
          {/* <Box sx={{ flex: 1 }}> */}
          <Typography level="title-md">{messageToDisplay}</Typography>
          {/* <Typography level="body-md">{message2}</Typography> */}
          <img src={imgToDisplay} alt="Access Dialog" className="m-y-3 w-full-screen max-w-sm"></img>
          {/* <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}></Box> */}
          {/* </Box> */}
        </Alert>
      )}
    </Stack>
    // <div className="absolute top-[0px] left-[0px] right-[400px] bottom-[100px] text-center">
    //   <div className="absolute flex flex-col justify-center inset-x-1/2 bg-rose-50 inset-y-1/2 w-1/2 h-1/2 ">
    //     <h2 className="text-3xl w-2/3 color-white">{messageToDisplay}</h2>
    //     <img src={imgToDisplay} alt="Access Dialog" className="w-full-screen max-w-sm"></img>
    //   </div>
    // </div>
  );
}
