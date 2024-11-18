import React, { createContext, useContext, ReactNode } from "react";

interface DomainProviderProps {
  children: ReactNode;
}

const DomainContext = createContext<string>("");

export const useDomain = (): string => useContext(DomainContext);

export const DomainProvider: React.FC<DomainProviderProps> = ({ children }) => {
  const domain = "http://xenobackend.hariharans.me";

  return (
    <DomainContext.Provider value={domain}>{children}</DomainContext.Provider>
  );
};
