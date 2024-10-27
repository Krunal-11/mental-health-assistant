import React, { createContext, useState, useContext } from "react";

// Create SessionContext
const SessionContext = createContext();

// Provider component
export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use SessionContext
export const useSession = () => useContext(SessionContext);
