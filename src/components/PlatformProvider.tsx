"use client";

import { createContext, useContext } from "react";

type PlatformContextValue = {
  isMac: boolean;
};

const PlatformContext = createContext<PlatformContextValue>({ isMac: false });

type PlatformProviderProps = {
  isMac: boolean;
  children: React.ReactNode;
};

export function PlatformProvider({ isMac, children }: PlatformProviderProps) {
  return <PlatformContext.Provider value={{ isMac }}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  return useContext(PlatformContext);
}
