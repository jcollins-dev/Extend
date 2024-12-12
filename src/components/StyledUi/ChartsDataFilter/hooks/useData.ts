import { createContext, useContext } from 'react';
export type AlarmChartsAndDataFilterContextProps = Record<string, unknown>[] | undefined;

const AlarmChartsAndDataFilterContext =
  createContext<AlarmChartsAndDataFilterContextProps>(undefined);

export const useAlarmChartsAndDataFilterContext = (): AlarmChartsAndDataFilterContextProps =>
  useContext(AlarmChartsAndDataFilterContext);
