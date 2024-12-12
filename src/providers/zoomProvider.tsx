import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ZoomObjectTuples } from 'types';

/**
 * Handle zooming Behaviour for all the children graphs where the flag 'sync = true'
 */

type ContextType = {
  zoomedDomain?: ZoomObjectTuples;
  resetZoom: () => void;
  onBrushDomainChangeEnd: (domain: ZoomObjectTuples) => void;
};

const defaultValue = {
  resetZoom: () => undefined,
  onBrushDomainChangeEnd: () => undefined
};

const DateContext = createContext<ContextType>(defaultValue);

export const useSyncZoom = (): ContextType => {
  return useContext(DateContext);
};

type Props = {
  children: ReactNode;
};

export const SyncZoomProvider = (props: Props): JSX.Element => {
  const [zoomedDomain, setZoomedDomain] = useState<ZoomObjectTuples>({
    x: undefined,
    y: undefined
  });

  const onBrushDomainChangeEnd = (domain: ZoomObjectTuples) => {
    setZoomedDomain(domain);
  };

  const resetZoom = () => {
    setZoomedDomain({ x: undefined, y: undefined });
  };

  const value = {
    zoomedDomain,
    onBrushDomainChangeEnd,
    resetZoom
  };
  return <DateContext.Provider value={value}>{props.children}</DateContext.Provider>;
};
