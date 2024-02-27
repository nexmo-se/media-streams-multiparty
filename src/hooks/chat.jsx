import { useState, useCallback, useContext } from 'react';

const SINGAL_TYPE_CHAT = 'chat';
import { UserContext } from '../Context/user';

export function useChat({ session }) {
  const sendSignalChat = ({ text, username = user.defaultSettings.name }) => {
    console.log('trying to send signal');
    console.log(session);
    if (!session || session.currentState !== 'connected') return;

    return new Promise((resolve, reject) => {
      console.log('sending signal');
      // Signaling of anything other than Strings is deprecated.
      session.signal(
        {
          type: SINGAL_TYPE_CHAT,
          data: JSON.stringify({ text, username }),
        },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  };

  const sendSignalSharing = ({ status, url }) => {
    console.log('sending signal');
    if (!session || session.currentState !== 'connected') return;

    return new Promise((resolve, reject) => {
      // Signaling of anything other than Strings is deprecated.
      session.signal(
        {
          type: 'sharing',
          data: JSON.stringify({ status, from: session.connection.connectionId, url: url }),
        },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  };

  return {
    sendSignalChat,
    sendSignalSharing,
  };
}
