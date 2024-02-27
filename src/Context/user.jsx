import { createContext, useState, useMemo } from 'react';

export const UserContext = createContext();

function UserProvider({ children }) {
  var username = localStorage.getItem('username') || `User-${Date.now()}`;
  // For EC-Render clients

  const [user, setUser] = useState({
    username,
    defaultSettings: {
      publishAudio: localStorage.getItem('localAudio') === 'true',
      publishVideo: localStorage.getItem('localVideo') === 'true',
      name: username,
      blur: false,
      audioSource: undefined,
      videoSource: undefined,
    },
    issues: {
      reconnections: 0,
      audioFallbacks: 0,
    },
  });

  // const value = useMemo(
  //   () => ({
  //     user,
  //     setUser,
  //   }),
  //   [user]
  // );

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
export default UserProvider;
