// @flow
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import LayoutManager from '../utils/layout-manager';
import OT from '@opentok/client';

import { SessionContext } from '../Context/session';
import { getInitials } from '../util';
import { UserContext } from '../Context/user';

// import { useLayoutManager } from '../Context/layout';

function usePublisher(containerId, displayName = false) {
  const [logLevel, setLogLevel] = useState(0);
  //  const layoutManager = useLayoutManager();
  const DFT_PUBLISHER_OPTIONS = {
    insertMode: 'append',
    width: '100%',
    height: '100%',

    // fitMode: 'contain',
  };

  const { user } = useContext(UserContext);
  const [pubStream, setPubStream] = useState(null);
  //   const OTStats = useRef(null);
  const publisher = useRef(null);
  const [quality, setQuality] = useState('good');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publisherOptions, setPublisherOptions] = useState();
  const [stream, setStream] = useState();
  // const [layoutManager, setLayoutManager] = useState(useLayoutManager());
  const [layoutManager, setLayoutManager] = useState(new LayoutManager(containerId));
  const mSession = useContext(SessionContext);
  const [simulcastLayers, setSimulcastLayers] = useState(null);
  const [getStats, setStats] = useState(null);
  function handleDestroyed() {
    publisher.current = null;
  }

  function handleStreamCreated(e) {
    console.log('stream created event');
    // const stream = publisher.current._.webRtcStream();
    // console.log(stream);
    // setPubStream(stream);
    // console.log('started publishing');
    // setIsPublishing(true);
    // // insertWifiIcon(e.target.id, e.target.element);
    // setStream(e.stream);
  }

  function handleVideoElementCreated({ element }) {
    const stream = element.srcObject;
    setPubStream(stream);
    setIsPublishing(true);
  }

  function handleAudioLevel(e) {
    const audioLevel = e.audioLevel;
    let movingAvg = null;
    if (movingAvg === null || movingAvg <= audioLevel) {
      movingAvg = audioLevel;
    } else {
      movingAvg = 0.8 * movingAvg + 0.2 * audioLevel;
    }
    // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
    const currentLogLevel = Math.log(movingAvg) / Math.LN10 / 1.5 + 1;
    setLogLevel(Math.min(Math.max(currentLogLevel, 0), 1) * 100);
  }

  function handleStreamDestroyed(e) {
    setStream(null);
    setIsPublishing(false);
    setPubStream(null);
    if (publisher) publisher.current.destroy();
    publisher.current = null;
  }

  function handleAccessDenied() {
    console.log('access Denied');
    if (publisher.current) publisher.current.destroy();
    publisher.current = null;
  }

  async function unpublish() {
    if (publisher) {
      mSession.session.unpublish(publisher.current);
    }
  }

  function handleVideoDisabled() {
    setQuality('bad');
    user.issues.audioFallbacks++;
  }

  function handleVideoEnabled() {
    setQuality('good');
  }

  function handleVideoWarning() {
    setQuality('poor');
  }
  function handleMediaStopped(e) {
    console.log('media stopped');
    e.preventDefault();
    console.log(e);
  }

  function handleVideoWarningLifted() {
    setQuality('good');
  }

  const initPublisher = useCallback((container, publisherOptions) => {
    console.log(publisherOptions);
    if (publisher.current) {
      console.log(' - initPublisher - already initiated');
      return;
    }
    const finalPublisherOptions = Object.assign({}, DFT_PUBLISHER_OPTIONS, publisherOptions);
    // console.log(finalPublisherOptions)

    const publ = OT.initPublisher(container, finalPublisherOptions, (err) => {
      if (err) {
        publisher.current = null;
        if (err.name === 'OT_USER_MEDIA_ACCESS_DENIED') return;
        console.log(' - initPublisher err', err);
        return;
      }
      console.log('pub initialised');
    });

    publisher.current = publ;
  }, []);

  const destroyPublisher = () => {
    if (publisher.current) {
      console.log('destroying it ');
      publisher.current.destroy();
      publisher.current = null;
    } else {
      console.log('pub not destroyed');
    }
  };

  async function publishAttempt(publisher, attempt = 1, noRetry = true) {
    console.log(`Attempting to publish in ${attempt} try`);
    console.log(publisher);
    if (attempt > 1) {
      publisher = OT.initPublisher(containerId, publisherOptions);
    }

    publisher.on('destroyed', handleDestroyed);
    publisher.on('mediaStopped', handleMediaStopped);
    publisher.on('audioLevelUpdated', handleAudioLevel);
    publisher.on('streamCreated', handleStreamCreated);
    publisher.on('streamDestroyed', handleStreamDestroyed);
    publisher.on('accessDenied', handleAccessDenied);
    publisher.on('videoDisabled', handleVideoDisabled);
    publisher.on('videoEnabled', handleVideoEnabled);
    publisher.on('videoElementCreated', handleVideoElementCreated);
    publisher.on('videoDisableWarning', handleVideoWarning);
    publisher.on('videoDisableWarningLifted', handleVideoWarningLifted);
    publisher.on('audioInputDeviceChanged', (device) => {
      console.log('audio device', device);
      console.log(`changing device to: ${device.label}`);
    });

    const { retry, error } = await new Promise((resolve, reject) => {
      mSession.session.publish(publisher, (err) => {
        if (err && noRetry) {
          resolve({ retry: undefined, error: err });
        }
        if (err && attempt < 3) {
          resolve({ retry: true, error: err });
        }
        if (err && attempt >= 3) {
          resolve({ retry: false, error: err });
        } else {
          // setIsPublishing(true);
          resolve({ retry: false, error: undefined });
        }
      });
    });

    if (retry) {
      // Wait for 2 seconds before attempting to publish again
      await delay(2000 * attempt);
      await publishAttempt(publisher.current, attempt + 1);
    } else if (error) {
      if (noRetry) return;
      alert(`
      We tried to access your camera/mic 3 times but failed. 
      Please make sure you allow us to access your camera/mic and no other application is using it.
      You may refresh the page to retry`);
      mSession.disconnect();
      setIsPublishing(false);
      publisher.current = null;
    } else {
      setIsPublishing(false);
      publisher.current = publisher;
    }
  }

  async function publish(name, extraData) {
    try {
      if (!mSession.session) throw new Error('You are not connected to session');

      console.log(extraData);

      // if (!publishAttempt) {
      const options = {
        insertMode: 'append',
        name: name,
        resolution: '1280x720',
        publishAudio: user.defaultSettings.publishAudio,
        publishVideo: user.defaultSettings.publishVideo,
        audioSource: user.defaultSettings.audioSource,
        videoSource: user.defaultSettings.videoSource,
        insertDefaultUI: false,
        initials: getInitials(name),
        audioFallback: {
          publisher: true,
        },
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: displayName ? 'on' : 'off',
        },
      };
      const finalOptions = Object.assign({}, options, extraData);
      setPublisherOptions(finalOptions);
      console.log(finalOptions);
      const newPublisher = OT.initPublisher(null, finalOptions);

      publishAttempt(newPublisher, 1);
      publisher.current = newPublisher;
      // } else {
      //   publishAttempt(publisher.current);
      // }
    } catch (err) {
      console.log(err.stack);
    }
  }

  useEffect(() => {
    try {
      if (document.getElementById(containerId)) layoutManager.layout();
    } catch (err) {
      console.log(err.stack);
    }
  }, [publisher.current, pubStream, layoutManager, containerId]);

  return {
    isPublishing,
    unpublish,
    publish,
    publisher: publisher.current,
    getStats,
    simulcastLayers,
    initPublisher,
    destroyPublisher,
    quality,
    layoutManager,
    pubStream,
    logLevel,
  };
}
export default usePublisher;
