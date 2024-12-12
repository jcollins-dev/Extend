import React, { ReactNode, useState, createContext, useContext, useCallback } from 'react';
import { baseClass } from '../ChartsWithFiltersPage.elements';
import { DownloadCSVButtonProps } from 'components/StyledUi/DownloadCSVButton';
import { ChartsWithDataFiltersPagePropsChart } from '../ChartsWithFiltersPage';

export interface SettingsProviderProps {
  //groupKey: string;
  csvFileSettings?: DownloadCSVButtonProps;
  charts?: ChartsWithDataFiltersPagePropsChart[];
}

export interface SettingsProviderReturnProps extends SettingsProviderProps {
  view?: Record<string, boolean>;
  handle: (type: string, value?: unknown) => void;
  pageError?: string;
  baseClass: string;
  hideSearch?: boolean;
}

const SettingsContext = createContext<SettingsProviderReturnProps>({
  //groupKey: 'type',
  handle: (type: string) => console.log(`${type} not set`),
  baseClass
});

export const useSettings = (): SettingsProviderReturnProps => useContext(SettingsContext);

interface Props extends SettingsProviderProps {
  children?: ReactNode | ReactNode[];
}

export const SettingsProvider = ({
  children,
  charts,
  //groupKey,
  //itemKey,
  csvFileSettings,
  ...settings
}: Props): JSX.Element => {
  //const [currentKeys, setCurrentKeys] = useState<Record<string, string>>({ groupKey });

  const [pageError, setPageError] = useState<string | undefined>(undefined);

  const handle = (type: string, value?: unknown) => {
    switch (type) {
      case 'set-page-error':
        return setPageError(value as string);
      case 'clear-page-error':
        return setPageError(undefined);
      case 'set-groupKey':
        break; //return setCurrentKeys({ ...currentKeys, groupKey: value as string });
      case 'set-categoryKey':
        break; //return setCurrentKeys({ ...currentKeys, categoryKey: value as string });
      case 'set-currentKeys':
        break; //return setCurrentKeys(value as Record<string, string>);
    }
  };

  const cachedHandler = useCallback(handle, []);
  const cachedCharts = charts;

  return (
    <SettingsContext.Provider
      value={{
        //...currentKeys,
        ...settings,
        charts: cachedCharts,
        //groupKey,
        handle: cachedHandler,
        pageError,
        baseClass,
        csvFileSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
