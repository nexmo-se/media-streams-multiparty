const OTStats = (options) => {
  const config = Object.assign({}, options, {
    statsInterval: 3000,
  });

  let subscribers = {};
  let publishers = {};
  let onPublisherStatsAvailableListener = null;
  let onSubscriberStatsAvailableListener = null;
  let onAggregateStatsAvailableListener = null;
  let statsTimer = undefined;

  const removeSubscriber = (streamId) => {
    delete subscribers[streamId];
  };
  const addSubscriber = (subscriber) => {
    console.log(subscriber);
    subscribers[subscriber.stream.id] = {
      id: subscriber.id,
      subscriber,
      video: {
        previousTimestamp: 0,
        prevBytesReceived: 0,
        prevPacketsLost: 0,
        prevPacketsReceived: 0,
        prevKbps: 0,
      },
      audio: {
        previousTimestamp: 0,
        prevBytesReceived: 0,
        prevPacketsLost: 0,
        prevPacketsReceived: 0,
        prevKbps: 0,
      },
    };
  };

  const removePublisher = (publisherId) => {
    delete publishers[publisherId];
  };
  const addPublisher = (publisher) => {
    publishers[publisher.id] = {
      id: publisher.id,
      publisher,
      video: {
        previousTimestamp: 0,
        prevBytesSent: 0,
        prevPacketsLost: 0,
        prevPacketsSent: 0,
      },
      audio: {
        previousTimestamp: 0,
        prevBytesSent: 0,
        prevPacketsLost: 0,
        prevPacketsSent: 0,
      },
    };
  };

  const start = () => {
    if (statsTimer === undefined) {
      console.log('starting collecting stats');
      statsTimer = setInterval(collectStats, config.statsInterval);
    }
  };

  const stop = () => {
    if (statsTimer !== undefined) {
      clearInterval(statsTimer);
      statsTimer = undefined;
    }
  };
  function collectStats() {
    /*publisher stats */
    for (let publisherId in publishers) {
      let publisher = publishers[publisherId].publisher;
      publisher.getStats(async (err, statsArray) => {
        if (err) {
          console.log(err);
        }
        if (publishers[publisherId].video.previousTimestamp === 0) {
          publishers[publisherId].video.previousTimestamp = statsArray[0].stats.timestamp;
          publishers[publisherId].audio.previousTimestamp = statsArray[0].stats.timestamp;
          return;
        }
        const audioStats =
          statsArray[0].stats.audio === undefined ? { packetsLost: 0, packetsSent: 0, bytesSent: 0 } : statsArray[0].stats.audio;
        const videoStats = statsArray[0].stats.video;

        const videoPacketLost = videoStats.packetsLost - publishers[publisherId].video.prevPacketsLost;
        const videoPacketsSent = videoStats.packetsSent - publishers[publisherId].video.prevPacketsSent;
        let totalVideoPkts = videoPacketLost + videoPacketsSent;
        let videoPLRatio = totalVideoPkts > 0 ? videoPacketLost / totalVideoPkts : 0;
        videoPLRatio = Math.round(videoPLRatio * 100) / 100;

        const audioPacketLost = audioStats.packetsLost - publishers[publisherId].audio.prevPacketsLost;
        const audioPacketsSent = audioStats.packetsSent - publishers[publisherId].audio.prevPacketsSent;
        let totalAudioPkts = audioPacketLost + audioPacketsSent;
        let audioPLRatio = totalAudioPkts > 0 ? audioPacketLost / totalAudioPkts : 0;
        audioPLRatio = Math.round(audioPLRatio * 100) / 100;

        const videoKbps = Math.floor(
          ((videoStats.bytesSent - publishers[publisherId].video.prevPublisherBytesSent) * 8) /
            (statsArray[0].stats.timestamp - publishers[publisherId].video.previousTimestamp)
        );

        const audioKbps = Math.floor(
          ((audioStats.bytesSent - publishers[publisherId].audio.prevPublisherBytesSent) * 8) /
            (statsArray[0].stats.timestamp - publishers[publisherId].audio.previousTimestamp)
        );

        publishers[publisherId].video.prevPublisherBytesSent = videoStats.bytesSent;
        publishers[publisherId].video.prevPacketsSent = videoStats.packetsSent;
        publishers[publisherId].video.prevPacketsLost = videoStats.packetsLost;
        publishers[publisherId].video.previousTimestamp = statsArray[0].stats.timestamp;
        publishers[publisherId].audio.prevPublisherBytesSent = audioStats.bytesSent;
        publishers[publisherId].audio.prevPacketsSent = audioStats.packetsSent;
        publishers[publisherId].audio.prevPacketsLost = audioStats.packetsLost;
        publishers[publisherId].audio.previousTimestamp = statsArray[0].stats.timestamp;
        const rtcStats = await getRtcStats(publishers[publisherId]);
        if (onPublisherStatsAvailableListener != null) {
          onPublisherStatsAvailableListener(
            publisherId,
            {
              bandwidth: videoKbps,
              width: publisher.videoWidth(),
              height: publisher.videoHeight(),
              frameRate: Math.round(videoStats.frameRate),
              packetLoss: videoPLRatio,
            },
            {
              audioBandwidth: audioKbps,
              audioPacketLoss: audioPLRatio,
            },
            rtcStats
          );
        } else {
          console.log('onStatsAvailableListener is null');
        }
      });
    }

    getAggregateStats();
    console.log(subscribers);
    /* subscriber stats */
    for (let subscriberId in subscribers) {
      let sub = subscribers[subscriberId].subscriber;
      sub.getStats((err, statsArray) => {
        if (err) {
          console.log(err);
          return;
        }

        if (subscribers[subscriberId].video.previousTimestamp === 0) {
          subscribers[subscriberId].video.previousTimestamp = statsArray.timestamp;
          subscribers[subscriberId].audio.previousTimestamp = statsArray.timestamp;
          return;
        }

        //console.log(statsArray);
        const audioStats = statsArray.audio === undefined ? { packetsLost: 0, packetsReceived: 0, bytesReceived: 0 } : statsArray.audio;
        const videoStats = statsArray.video;

        const videoPacketLost = videoStats.packetsLost - subscribers[subscriberId].video.prevPacketsLost;
        const videoPacketsReceived = videoStats.packetsReceived - subscribers[subscriberId].video.prevPacketsReceived;
        let videoTotalPkts = videoPacketLost + videoPacketsReceived;
        let videoPLRatio = videoTotalPkts > 0 ? videoPacketLost / videoTotalPkts : 0;
        videoPLRatio = Math.round(videoPLRatio * 100) / 100;

        const audioPacketLost = audioStats.packetsLost - subscribers[subscriberId].audio.prevPacketsLost;
        const audioPacketsReceived = audioStats.packetsReceived - subscribers[subscriberId].audio.prevPacketsReceived;
        let audioTotalPkts = audioPacketLost + audioPacketsReceived;
        let audioPLRatio = audioTotalPkts > 0 ? audioPacketLost / audioTotalPkts : 0;
        audioPLRatio = Math.round(audioPLRatio * 100) / 100;

        const videoKbps = Math.floor(
          ((videoStats.bytesReceived - subscribers[subscriberId].video.prevBytesReceived) * 8) /
            (statsArray.timestamp - subscribers[subscriberId].video.previousTimestamp)
        );

        const audioKbps = Math.floor(
          ((audioStats.bytesReceived - subscribers[subscriberId].audio.prevBytesReceived) * 8) /
            (statsArray.timestamp - subscribers[subscriberId].audio.previousTimestamp)
        );

        subscribers[subscriberId].video.prevBytesReceived = videoStats.bytesReceived;
        subscribers[subscriberId].video.prevPacketsReceived = videoStats.packetsReceived;
        subscribers[subscriberId].video.prevPacketsLost = videoStats.packetsLost;
        subscribers[subscriberId].video.previousTimestamp = statsArray.timestamp;
        subscribers[subscriberId].audio.prevBytesReceived = audioStats.bytesReceived;
        subscribers[subscriberId].audio.prevPacketsReceived = audioStats.packetsReceived;
        subscribers[subscriberId].audio.prevPacketsLost = audioStats.packetsLost;
        subscribers[subscriberId].audio.previousTimestamp = statsArray.timestamp;
        subscribers[subscriberId].video.prevKbps = videoKbps;
        subscribers[subscriberId].audio.prevKbps = audioKbps;

        if (onSubscriberStatsAvailableListener != null) {
          onSubscriberStatsAvailableListener(
            sub.id,
            {
              bandwidth: videoKbps,
              width: sub.videoWidth(),
              height: sub.videoHeight(),
              frameRate: Math.round(videoStats.frameRate),
              packetLoss: videoPLRatio,
            },
            {
              bandwidth: audioKbps,
              packetLoss: audioPLRatio,
            }
          );
        } else {
          console.log('onStatsAvailableListener is null');
        }
      });
    }
  }

  const getRtcStats = async ({ publisher }) => {
    if (publisher) {
      let prevTimeStamp = {};
      let protocol = null;
      let prevPacketsSent = {};
      let connectionType = null;
      let prevBytesSent = {};
      let hasVpn = false;
      let candidateType = false;
      let networkType = null;
      let jitterAudio = null;
      let audioPacketLost = null;
      let codec = null;
      let audioCodec = null;
      let localIp;
      let port;
      let remoteIp;
      let remotePort;

      try {
        const stats = await publisher.getRtcStatsReport();
        //   setSimulcastLayers([]);
        let simulcastLayers = [];
        // setRtt([]);
        stats[0].rtcStatsReport.forEach((e) => {
          if (e.type === 'local-candidate' && e.url) {
            console.log(e);
            port = e.port;
            localIp = e.relatedAddress;
            if (e.networkType === 'vpn') hasVpn = true;
            connectionType = e.networkType;
            candidateType = e.candidateType;
            networkType = e.networkType;

            // setConnectionType(e.networkType);
            if (e.candidateType === 'relay') {
              //   setProtocol(`TURN ${e.relayProtocol}`);
              protocol = `TURN ${e.relayProtocol}`;
              //   setIp({ ip: e.ip, type: 'relay' });
            } else {
              protocol = e.protocol;
              //   setProtocol(e.protocol);
            }
          }

          if (e.type === 'outbound-rtp' && e.kind === 'video' && e.frameHeight && e.frameWidth && e.bytesSent) {
            // Rest of the loop for subsequent iterations
            // console.log(e);
            const newLayers = {
              width: e.frameWidth,
              height: e.frameHeight,
              framesPerSecond: e.framesPerSecond,
              qualityLimitationReason: e.qualityLimitationReason,
              id: e.ssrc,
            };

            simulcastLayers = [...simulcastLayers, newLayers];
          }
          if (e.type === 'remote-candidate') {
            remoteIp = e.ip;
            remotePort = e.port;
            console.log(e);
            // Rest of the loop for subsequent iterations
          }
          if (e.type === 'remote-inbound-rtp' && e.kind === 'audio') {
            jitterAudio = e.jitter;
            // audioPacketLost = e.fractionLost;
          }
          if (e.type === 'codec') {
            if (e.mimeType.startsWith('audio')) {
              audioCodec = e.mimeType;
            } else {
              codec = e.mimeType;
            }
          }
        });

        return {
          simulcastLayers,
          protocol,
          candidateType,
          hasVpn,
          networkType,
          jitterAudio,
          audioPacketLost,
          audioCodec,
          codec,
          localIp,
          port,
          remoteIp,
          remotePort,
        };

        /* setIsScreenSharing(true); */
      } catch (e) {
        console.log('[useRtcStats] -  error:', e);
      }
    }
  };

  const getAggregateStats = () => {
    console.log('getting aggregate stats');

    let aggregateVBW = 0;
    let aggregateABW = 0;
    for (let subscriberId in subscribers) {
      aggregateABW += subscribers[subscriberId].audio.prevKbps;
      aggregateVBW += subscribers[subscriberId].video.prevKbps;
    }
    if (onAggregateStatsAvailableListener != null) {
      onAggregateStatsAvailableListener({ vbw: aggregateVBW, abw: aggregateABW });
    }
  };
  const setPublisherOnStatsAvailableListener = (listener) => {
    onPublisherStatsAvailableListener = listener;
  };
  const setSubscriberOnStatsAvailableListener = (listener) => {
    onSubscriberStatsAvailableListener = listener;
  };
  const setOnAggregateStatsAvailableListener = (listener) => {
    onAggregateStatsAvailableListener = listener;
  };

  return {
    addSubscriber,
    removeSubscriber,
    addPublisher,
    removePublisher,
    start,
    stop,
    setPublisherOnStatsAvailableListener,
    setSubscriberOnStatsAvailableListener,
    setOnAggregateStatsAvailableListener,
  };
};

export default OTStats;
