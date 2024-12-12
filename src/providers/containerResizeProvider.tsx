import React, { createContext, ReactNode, useContext, useState } from 'react';

/***********
 * USAGE:
 *
 * This context allows a parent component to tell a ...
 * ... child component to perform a container resize calculation.
 * Example: When an event in the parent component causes the child component to change size.
 *
 * It is intended to be used with the useContainerSize hook ...
 * ... which comes with a triggerResize function.
 *
 **********/

type ContextType = {
  resizeDelay?: number;
  setResizeDelay: (resizeDelay: number) => void;
  setShouldResize: (shouldResize: boolean) => void;
  shouldResize?: boolean;
};

const defaultValue = {
  resizeDelay: 0,
  setResizeDelay: () => undefined,
  setShouldResize: () => undefined,
  shouldResize: false
};

const ContainerResizeContext = createContext<ContextType>(defaultValue);

export const useContainerResize = (): ContextType => {
  return useContext(ContainerResizeContext);
};

type Props = {
  children: ReactNode;
};

export const ContainerResizeProvider = (props: Props): JSX.Element => {
  const [resizeDelay, setResizeDelay] = useState<number>(0);
  const [shouldResize, setShouldResize] = useState<boolean>(false);

  const value = {
    resizeDelay,
    setResizeDelay,
    setShouldResize,
    shouldResize
  };

  return (
    <ContainerResizeContext.Provider value={value}>
      {props.children}
    </ContainerResizeContext.Provider>
  );
};
