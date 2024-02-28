import React from 'react';
import { useContext, useRef, useState, useEffect } from 'react';
import { Stack, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import VideoSettings from '../../components/VideoSettings';
import AudioSettings from '../../components/AudioSettings';
import ChatSettings from '../../components/ChatSettings';
import CaptionsSettings from '../../components/CaptionsSettings';
import { SessionContext } from '../../Context/session';
import usePublisher from '../../hooks/publisher';
import useSubscriber from '../../hooks/subscriber';
import { isMobile } from '../../util';
import { UserContext } from '../../Context/user';
import MuteVideoButton from '../../components/MuteVideoButton';
import MuteAudioButton from '../../components/MuteAudioButton';
import MoreButton from '../../components/MoreButton';
import ScreenSharingButton from '../../components/ScreenSharingButton';
import ConnectionAlert from '../../components/ConnectionAlert';
import Chat from '../../components/Chat';
import BlurButton from '../../components/BlurButton';
import NoiseButton from '../../components/NoiseButton';
import ExitButton from '../../components/ExitButton';
import RemoteSubscriber from '../../components/RemoteSubscriber';
import CustomSubscriber from '../../components/CustomSubscriber';
import CustomPublisher from '../../components/CustomPublisher';
import { useMediaProcessor } from '../../hooks/mediaProcessor';
import { useParams } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Room() {
  const { roomName } = useParams();
  // const { processor, connector } = useMediaProcessor();
  // const [layoutManager, setLayoutManager] = useState(useLayoutManager());
  const { user } = useContext(UserContext);
  const wrapRef = useRef(null);
  const resizeTimerRef = useRef();
  const mPublisher = usePublisher('video-container');
  // const mSubscriber = useSubscriber();
  const [isNoiseSuppressionEnabled, setNoiseSuppression] = useState(false);
  const mSession = useContext(SessionContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  useEffect(() => {
    mSession.joinRoom(roomName, 'jose');
  }, []);

  const handleNoiseChange = () => {
    console.log('toggling noise');
    setNoiseSuppression((prev) => !prev);
  };

  const handleLeave = () => {
    if (!mSession) return;
    mSession.session.disconnect();
  };

  // useEffect(() => {
  //   console.log('use effect run -toggle noise suppresion');
  //   console.log(isNoiseSuppressionEnabled);
  //   // if (OT.hasMediaProcessorSupport()) {
  //   if (mPublisher.publisher) {
  //     if (isNoiseSuppressionEnabled) {
  //       console.log(mPublisher.publisher);
  //       mPublisher.publisher
  //         .setAudioMediaProcessorConnector(connector)
  //         .catch(console.log)
  //         .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
  //     } else {
  //       console.log('turning off NS');
  //       mPublisher.publisher
  //         .setAudioMediaProcessorConnector(null)
  //         .catch(console.log)
  //         .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
  //     }
  //   } else {
  //     console.log('dping nothing');
  //     console.log(mPublisher);
  //   }
  // }, [mPublisher.isPublishing, isNoiseSuppressionEnabled, mPublisher.publisher]);

  useEffect(() => {
    const container = document.getElementById('wrapper');

    if (container) {
      const attrObserver = new MutationObserver(function (mutations) {
        mutations.forEach((mu) => {
          console.log('calling layout');
          if (mu.type !== 'attributes' && mu.attributeName !== 'class') return;
          mPublisher.layoutManager.layout();
        });
      });
      attrObserver.observe(container, { attributes: true });
    } else {
      console.log('no container');
    }
  }, [chatOpen]);

  useEffect(() => {
    // if (container) setLayoutContainer(initLayoutContainer(container));
    if (mPublisher.layoutManager)
      window.onresize = () => {
        clearTimeout(resizeTimerRef.current);

        resizeTimerRef.current = setTimeout(function () {
          mPublisher.layoutManager.layout();
          // if (container) setLayoutContainer(initLayoutContainer(container));
        }, 100);
      };

    return () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = null;
      // if (mSession.session) {
      //   mSession.session.disconnect();
      // }
      // mSession.session.unpublish(mPublisher.publisher);
    };
  }, [mSession]);

  useEffect(() => {
    if (mSession.connected && !mPublisher.publisher) {
      const blur = user.defaultSettings.blur
        ? {
            videoFilter: {
              type: 'backgroundBlur',
              blurStrength: 'high',
            },
          }
        : {};

      mPublisher.publish(user.defaultSettings.name, blur);
    } else {
      return;
    }
    if (mPublisher.layoutManager) mPublisher.layoutManager.layout();
  }, [mSession.connected]);

  return (
    <Grid className="w-screen" container spacing={1}>
      <Grid ref={wrapRef} id="wrapper" height={captionsEnabled ? '80vh' : '90vh'} item xs={chatOpen ? 9 : 12}>
        <div id="video-container" className="flex column w-full h-full">
          {mPublisher.pubStream && <CustomPublisher mediaStream={mPublisher.pubStream}></CustomPublisher>}
          {mSession.videoSources.length > 0 &&
            mSession.subscriberElements.map((element, index) => <CustomSubscriber key={element} element={element}></CustomSubscriber>)}
          {/* {mSession.session &&
            mSession.streams.length > 0 &&
            mSession.streams.map((stream) => (
              <RemoteSubscriber key={stream.streamId} stream={stream} session={mSession.session}></RemoteSubscriber>
            ))} */}
          {/* <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
           */}
        </div>
      </Grid>
      {chatOpen && <Chat></Chat>}
      {captionsEnabled && (
        <Grid height={'10vh p-2'} item xs={8}>
          <div className="flex row justify-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum voluptatibus voluptas totam sapiente vero dolorem eos,
            dignissimos ut labore laboriosam sint, odio earum enim praesentium amet minus laborum magnam ullam?
          </div>
        </Grid>
      )}
      <div className="flex justify-center flex-end items-center absolute h-[90px] radius-[25px] w-full bottom-[0px] left-[0px] bg-black rounded-t-3xl">
        <MuteAudioButton publisher={mPublisher.publisher} publishing={mPublisher.isPublishing}></MuteAudioButton>
        <MuteVideoButton publisher={mPublisher.publisher} publishing={mPublisher.isPublishing}></MuteVideoButton>

        {/* {OT.hasMediaProcessorSupport() && (
          <NoiseButton handleNoiseChange={handleNoiseChange} isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}></NoiseButton>
        )} */}
        {!isMobile() && <ScreenSharingButton layout={mPublisher.callLayout}></ScreenSharingButton>}
        {OT.hasMediaProcessorSupport() && !isMobile() && <BlurButton publisher={mPublisher.publisher}></BlurButton>}
        {/* {!isMobile() && <MoreButton subStats={mSubscriber.aggregateStats} stats={mPublisher.getStats} />} */}
        {/* <CaptionsSettings handleClick={() => setCaptionsEnabled((prev) => !prev)} /> */}
        {!isMobile() && <ChatSettings handleClick={() => setChatOpen((prev) => !prev)} />}
        <ExitButton handleLeave={handleLeave}></ExitButton>
      </div>
      {mSession.reconnecting && <ConnectionAlert message1={'Lost connection'} message2={'Please verify your network connection'} />}
      {mPublisher.quality !== 'good' && (
        <ConnectionAlert
          message1={'Video quality problem'}
          message2={'Please check your connectivity. Your video may be disabled to improve the user experience'}
        />
      )}
    </Grid>
  );
}

export default Room;
