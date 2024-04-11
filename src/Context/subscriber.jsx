// @flow
import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import OT from '@opentok/client';
import OTStats from '../utils/stats';

export const SubscriberContext = createContext({});
function SubscriberProvider({ children }) {
  //   const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const perro = 'sd';

  return (
    <SubscriberContext.Provider
      value={{
        subscribers,
        setSubscribers,
        perro,
      }}
    >
      {children}
    </SubscriberContext.Provider>
  );
}
export default SubscriberProvider;
