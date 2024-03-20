// @flow
import { useState, createContext, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import OT from '@vonage/client-sdk-video';

import { getCredentials } from '../api/fetchCredentials';
// import RoomAPI from 'api/room';
// import CredentialAPI from 'api/credential';
// import User from 'entities/user';
const SINGAL_TYPE_CHAT = 'chat';

import LayoutManager from '../utils/layout-manager';
import { UserContext } from './user';
// import { useLayoutManager } from './layout';
export const SessionContext = createContext({});
const call = 'video-container';
function SessionProvider({ children }) {
  const [callLayout, setCalLayout] = useState(new LayoutManager(call));
  // const [callLayout, setCalLayout] = useState(useLayoutManager());
  const [subscribers, setSubscribers] = useState([]);
  const [reconnecting, setReconnecting] = useState(false);
  const [videoSources, setVideoSources] = useState([]);
  const [subscriberElements, setSubscriberElements] = useState([]);

  const session = useRef(null);
  //   const navigate = useNavigate();
  // const [session, setSession] = useState();
  const [messages, setMessages] = useState([{ from: 'App', text: 'You can use the chat to say something nice' }]);
  const { user } = useContext(UserContext);
  const [streams, setStreams] = useState([]);
  const [changedStream, setChangedStream] = useState();
  const [connections, setConnections] = useState([]);
  const [connected, setConnected] = useState(false);
  const [creds, setCreds] = useState({});

  const credential = {
    appId: '7de8b215-d3f6-4404-b6ef-848345f9f195',
    token:
      'eyJhbGciOiJSUzI1NiJ9.eyJhcHBsaWNhdGlvbl9pZCI6IjdkZThiMjE1LWQzZjYtNDQwNC1iNmVmLTg0ODM0NWY5ZjE5NSIsImlhdCI6MTcxMDkzNDk0NywianRpIjoiN2RlOGIyMTUtZDNmNi00NDA0LWI2ZWYtODQ4MzQ1ZjlmMTk1Iiwic2NvcGUiOiJzZXNzaW9uLmNvbm5lY3QiLCJzZXNzaW9uX2lkIjoiMV9NWDQzWkdVNFlqSXhOUzFrTTJZMkxUUTBNRFF0WWpabFppMDRORGd6TkRWbU9XWXhPVFYtZmpFM01UQTVNelE1TkRjd016Wi1hMmhzUkVoM01tUkVkRTA1Y1RSaGFEWnFkRk5rZFcxVmZuNS0iLCJyb2xlIjoicHVibGlzaGVyIiwiaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdCI6IiJ9.SVTv0qVOoBUKc1KIHf-Q91qPfU2bidA_Y1sg5K6N-SKuw89TJk416kWbjb9XHqD8IBgIoq3SQ1wpnvC-2EI_5SMwKAe8S2l-cNwMrET8kCKazBgEG3lqTzMJzOqSnrK25V7A5FmB2ulMACLk4HjD3luJx1Cyjnx-QBBVyeLpqqDfOvdqGph63SQy6m8IIqFPfThGJDCXEVeLmPyQagKYqGcIp7oKM7MNvgEnNOPHGP92cKAZTFNyG1h2V5DWEeHZmREaftCyDeeKsuHaoIDpgK2F4ahhNA_buylpNqQxDeQbFgAaEhtcsMugoAPQ7pzrcBbvl4v8cRKDi2NAEro00Q',
    sessionId: '1_MX43ZGU4YjIxNS1kM2Y2LTQ0MDQtYjZlZi04NDgzNDVmOWYxOTV-fjE3MTA5MzQ5NDcwMzZ-a2hsREh3MmREdE05cTRhaDZqdFNkdW1Vfn5-',
  };

  // useEffect(() => {
  //   getCredentials('room')
  //     .then((creds) => {
  //       console.log(creds);
  //       setCreds(creds.data);
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

  useEffect(() => {
    try {
      if (document.getElementById(call)) callLayout.layout();
    } catch (err) {
      console.log(err.stack);
    }
  }, [videoSources]);

  function handleStreamPropertyChanged({ stream, changedProperty, newValue, oldValue }) {
    setChangedStream({ stream, changedProperty, newValue, oldValue, token: uuid() });
  }

  function handleConnectionCreated(e) {
    setConnections((prevConnections) => [...prevConnections, e.connection]);
  }

  const addMessages = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  function onSignalChat({ type, data }) {
    console.log(type);
    if (type === `signal:${SINGAL_TYPE_CHAT}`) {
      const { text, username } = JSON.parse(data);
      addMessages({ text, from: `${username || '?'}`, time: new Date().toJSON().split('T')[1] });
    }
  }

  function handleConnectionDestroyed(e) {
    setConnections((prevConnections) => [...prevConnections].filter((connection) => connection.id !== e.connection.id));
  }

  const createResizeObserver = (subscriber) => {
    console.log('creating observer');
    console.log(subscriber);
    const resizeObserver = new ResizeObserver(function (entries) {
      // since we are observing only a single element, so we access the first element in entries array
      let rect = entries[0].contentRect;

      console.log('Current Width : ' + rect.width);
      console.log('Current Height : ' + rect.height);
      subscriber.setPreferredResolution({
        width: rect.width,
        height: rect.height,
      });

      // current width & height
      // width.current = rect.width;
      // height.current = rect.height;
    });
    return resizeObserver;
  };

  function handleSessionDisconnected(e) {
    setConnections([]);
    // setSession(null);
    session.current = null;
    // setUser(null);
    setConnected(false);
  }

  function handleStreamCreated(e) {
    console.log('stream Created');

    subscribe(e.stream, session);
    // mSubscriber.subscribe(e.stream, session);
    setStreams((prevStreams) => [...prevStreams, e.stream]);
  }

  const addSubscribers = ({ subscriber }) => {
    setSubscribers((prev) => [...prev, subscriber]);
    // const resize = createResizeObserver(subscriber);
    // resize.observe(document.getElementById(subscriber.id));
  };

  const removeSubscribers = ({ subscriber }) => {
    setSubscribers((prev) => prev.filter((prevSub) => prevSub.id !== subscriber.id));
  };

  function handleStreamDestroyed(e) {
    setStreams((prevStreams) => [...prevStreams].filter((stream) => stream.id !== e.stream.id));
    setSubscriberElements((prevStreams) => prevStreams.filter(({ element }) => element.id !== e.stream.id));
    session.current.getSubscribersForStream(e.stream).forEach((subscriber) => {
      removeSubscribers({ subscriber });
    });
  }

  function handleReconnecting() {
    console.log(user);
    if (user) {
      user.issues.reconnections++;
    }

    setReconnecting(true);
  }
  function handleReconnected() {
    setReconnecting(false);
  }

  function insertPinIcon(targetSubscriber) {
    const childNodeStr = `<button 
    id="speakerPin-${targetSubscriber.id}"
    style="
    position: absolute; 
    top: 8px; 
    right: 8px;
    background: url('https://www.svgrepo.com/show/31706/map-pin.svg');
    background-position: center;
    background-size: contain;
    height: 18px;
    width: 18px;
    background-repeat: no-repeat;">
    </button>`;
    targetSubscriber.insertAdjacentHTML('beforeend', childNodeStr);
  }

  async function subscribe(stream, session, options = {}) {
    console.log('request to subscribe');
    if (session) {
      console.log(session);
      const finalOptions = Object.assign({}, options, {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        insertDefaultUI: false,
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'on',
        },
        showControls: false,
      });
      const subscriber = session.current.subscribe(stream, null, finalOptions);
      subscriber.on('videoElementCreated', function (event) {
        const element = event.element;
        console.log(event.target);
        element.setAttribute('id', event.target.streamId);
        // setSubscriberElements((prevStreams) => [...prevStreams, element]);
        setSubscriberElements((prevStreams) => [...prevStreams, { element, subscriber }]);
        setVideoSources((prevStreams) => [...prevStreams, stream]);
      });

      const element = subscriber.element;
      if (stream.videoType === 'screen') {
        element.classList.add('OT_big');
      }

      // insertPinIcon(element);
      // const pinEl = document.getElementById(`speakerPin-${element.id}`);
      // pinEl.addEventListener('click', function () {
      //   if (element.classList.contains('OT_big')) {
      //     element.classList.remove('OT_big');
      //   } else {
      //     element.classList.add('OT_big');
      //   }
      //   callLayout.layout();
      // });

      addSubscribers({ subscriber });
      // setCallSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    }
  }

  async function connect(credential) {
    try {
      session.current = OT.initSession(credential.appId, credential.sessionId);
      // let newSession = OT.initSession(credential.apiKey, credential.sessionId);
      // setSession(newSession);
      let newSession = session.current;

      session.current.on('streamPropertyChanged', handleStreamPropertyChanged);
      session.current.on('streamCreated', (e) => handleStreamCreated(e));
      session.current.on('streamDestroyed', (e) => handleStreamDestroyed(e));
      session.current.on('sessionReconnecting', (e) => handleReconnecting(e));
      session.current.on('sessionReconnected', (e) => handleReconnected(e));
      session.current.on('sessionDisconnected', (e) => handleSessionDisconnected(e));
      session.current.on('connectionCreated', (e) => handleConnectionCreated(e));
      session.current.on('connectionDestroyed', (e) => handleConnectionDestroyed(e));
      session.current.on('signal', (e) => onSignalChat(e));

      await new Promise((resolve, reject) => {
        session.current.connect(credential.token, (err) => {
          if (err) reject(err);
          else {
            setConnected(true);
            resolve();
          }
        });
      });
      const userData = JSON.parse(session.current.connection.data);
      //   const newUser = new User(userData.name, userData.role, newSession.connection.id);
      //   setUser(newUser);
      console.log('session: ', session.current);
    } catch (err) {
      console.log(err);
    }
  }

  async function joinRoom(roomName, user) {
    // getCredentials(roomName)
    //   .then((creds) => {
    //     console.log(creds.data);
    //     connect(creds.data);
    //   })
    //   .catch((e) => console.log(e));
    // setUser(user);
    // const newRoom = await RoomAPI.createSession(roomName);
    // const credential = await CredentialAPI.generateCredential({ sessionId: newRoom.sessionId, role: 'publisher', data: user });
    connect(credential);
  }

  async function disconnect() {
    if (session.current) {
      session.current.disconnect();
      setSession(null);
      setConnected(false);
    }
    // navigate('/');
  }

  return (
    <SessionContext.Provider
      value={{
        // user,
        subscribe,
        session: session.current,
        streams,
        changedStream,
        connections,
        connect,
        disconnect,
        joinRoom,
        connected,
        subscribers,
        reconnecting,
        messages,
        videoSources,
        subscriberElements,
        createResizeObserver,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
export default SessionProvider;
