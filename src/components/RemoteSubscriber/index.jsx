import React, { useEffect, useMemo, useState } from 'react';
import { OTError, Session, Stream, SubscriberProperties } from '@opentok/client';

function RemoteSubscriber({ stream, session }) {
  const [subscriber, setSubscriber] = useState(null);
  const defaultSubscriberProperties = useMemo(
    () => ({
      insertMode: 'append',
      height: '300px',
      style: {
        buttonDisplayMode: 'off',
        nameDisplayMode: 'off',
      },
      width: '400px',
    }),
    []
  );

  function insertWifiIcon(targetSubscriber, targetDom) {
    if (document.getElementById(`${targetSubscriber.id}-mute`)) return;
    const childNodeStr = `<div
    id=${targetSubscriber.id}-mute
    style="
    position: absolute; 
    top: 8px; 
    right: 8px;
    background: url('https://purepng.com/public/uploads/large/purepng.com-wifi-icon-greenwifi-iconwifiiconwireless-connection-170152843620015a2q.png');
    background-position: center;
    background-size: contain;
    height: 28px;
    width: 28px;
    background-repeat: no-repeat;">
    </div>`;
    targetDom.insertAdjacentHTML('beforeend', childNodeStr);
  }

  useEffect(() => {
    if (stream && session) {
      const targetElement = `video-container`;
      const wrapper = `<div
    id=-mute
    style="
    position: absolute; 
    top: 8px; 
    right: 8px;
    background: url('https://purepng.com/public/uploads/large/purepng.com-wifi-icon-greenwifi-iconwifiiconwireless-connection-170152843620015a2q.png');
    background-position: center;
    background-size: contain;
    height: 28px;
    width: 28px;
    background-repeat: no-repeat;">
    </div>`;
      const newSubscriber = session.subscribe(stream, targetElement, defaultSubscriberProperties, (error) => {
        if (error) {
          console.warn('Error subscribing to stream', error);
        }
      });
      setSubscriber(newSubscriber);
    }
  }, [defaultSubscriberProperties, stream, session]);

  return;
}

export default RemoteSubscriber;
