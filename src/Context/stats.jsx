import React, { createContext, useContext } from 'react';
import OTStats from '../utils/stats';

const StatsContext = createContext();

export const useStatsContext = () => useContext(StatsContext);

export const StatsProvider = ({ children }) => {
  // Place the OTStats logic here
  const OTStatsInstance = OTStats(); // Assuming OTStats is defined and imported

  return <StatsContext.Provider value={OTStatsInstance}>{children}</StatsContext.Provider>;
};
