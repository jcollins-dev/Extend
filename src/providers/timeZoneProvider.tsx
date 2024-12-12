import { useMachine } from 'hooks';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type ContextType = {
  timeZone?: string;
};

const TimeZoneContext = createContext<ContextType>({});

export const useTimeZone = (): ContextType => {
  return useContext(TimeZoneContext);
};

type Props = {
  timeZone?: string;
  children: ReactNode;
};

export const TimeZoneProvider = (props: Props): JSX.Element => {
  const [timeZone, setTimeZone] = useState<string | undefined>(props.timeZone);

  /**
   * Skip querying machine info, if the timezone is provided
   */
  const { machine } = useMachine(!!props.timeZone);

  useEffect(() => {
    setTimeZone(props.timeZone || machine?.timezone);
  }, [machine, props.timeZone]);

  const value = {
    timeZone
  };

  return <TimeZoneContext.Provider value={value}>{props.children}</TimeZoneContext.Provider>;
};
