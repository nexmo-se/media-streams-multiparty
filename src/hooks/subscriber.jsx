// @flow
// import { MessageContext } from 'contexts/message';
import { SessionContext } from '../Context/session';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import LayoutManager from '../utils/layout-manager';
import { SubscriberContext } from '../Context/subscriber';
import { useStatsContext } from '../Context/stats';

function useSubscriber() {
  const stats = useStatsContext();

  const [callSubscribers, setCallSubscribers] = useState([]);

  const mSession = useContext(SessionContext);
  const [aggregateStats, setAggregateStats] = useState(null);

  useEffect(() => {
    if (!mSession.subscribers) return;
    if (mSession.subscribers.length > 0 && stats) {
      stats.stop();

      stats.setOnAggregateStatsAvailableListener(handleAggregateStatsListener);
      stats.setSubscriberOnStatsAvailableListener(onSubscriberStatsAvailable);

      console.log('adding sub');
      mSession.subscribers.forEach((sub) => stats.addSubscriber(sub));
      stats.start();
    }
  }, [mSession.subscribers]);

  function insertMuteIcon(targetSubscriber, targetDom) {
    if (document.getElementById(`${targetSubscriber.id}-mute`)) return;
    const childNodeStr = `<div
    id=${targetSubscriber.id}-mute
    style="
    position: absolute; 
    bottom: 8px; 
    right: 8px;
    background: url('https://cdn-icons-png.flaticon.com/512/107/107037.png');
    background-position: center;
    background-size: contain;
    height: 18px;
    width: 18px;
    background-repeat: no-repeat;">
    </div>`;
    targetDom.insertAdjacentHTML('beforeend', childNodeStr);
  }

  function handleAggregateStatsListener(stats) {
    setAggregateStats(stats);
    console.log(stats);
  }
  function onSubscriberStatsAvailable(stats) {
    console.log(stats);
  }

  function unsubscribe() {
    callSubscribers.forEach((subscriber) => {
      if (subscriber.stream) mSession.session.unsubscribe(subscriber);
    });
    monitorSubscribers.forEach((subscriber) => {
      if (subscriber.stream) mSession.session.unsubscribe(subscriber);
    });
    setCallSubscribers([]);
    setMonitorSubscribers([]);
    setSubscribed([]);
  }

  return {
    unsubscribe,

    aggregateStats,
  };
}
export default useSubscriber;
