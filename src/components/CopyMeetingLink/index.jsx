import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QRCode from 'qrcode.react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useCopyMeetingUrl from '../../hooks/copyMeeting';
import { IconButton } from '@mui/material';
function CopyMeetingLink() {
  const { copyUrl } = useCopyMeetingUrl();
  const [title, setTitle] = React.useState('Copy');

  const handleCopy = () => {
    setTitle('Copied');
    copyUrl();
  };

  return (
    <Card>
      <Typography sx={{ marginTop: '100px' }} variant="body2" color="text.secondary">
        You are the only one here
      </Typography>
      <Typography sx={{ marginTop: '5px' }} variant="body2" color="text.secondary">
        Scan this QR code to join from your phone
      </Typography>
      <QRCode className="mx-auto my-5" value={window.location.href} />
      <CardContent>
        <CardActions>
          <Typography sx={{ marginTop: '5px', marginLeft: '20%' }} variant="body2" color="text.secondary">
            Meeting link : {window.location.href}
          </Typography>
        </CardActions>
        {/* <IconButton onClick={handleCopy}>
          <ContentCopyIcon>Share</ContentCopyIcon>
        </IconButton> */}
        <CardActions>
          <Button onClick={handleCopy} sx={{ margin: 'auto' }} variant="contained" endIcon={<ContentCopyIcon />}>
            {title}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default CopyMeetingLink;
