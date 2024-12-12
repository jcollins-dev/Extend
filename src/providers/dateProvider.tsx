import React, { createContext, ReactNode, useContext } from 'react';

/**
 * Provide date range from parent down to all its nested children
 */

type ContextType = {
  startTime: Date;
  endTime: Date;
};

const defaultValue = {
  startTime: new Date(),
  endTime: new Date()
};

const DateContext = createContext<ContextType>(defaultValue);

export const useDate = (): ContextType => {
  return useContext(DateContext);
};

type Props = {
  context: ContextType;
  children: ReactNode;
};

export const DateProvider = (props: Props): JSX.Element => {
  return <DateContext.Provider value={props.context}>{props.children}</DateContext.Provider>;
};
