// 3rd party
import React, { ReactNode, createContext, useContext } from 'react';

// Elements
import {
  AlarmChartsAndDataFilterContainer,
  AlarmChartsAndDataFilterContainerProps
} from './AlarmChartsAndDataFilter.elements';
import { baseClass } from './AlarmChartsAndDataFilter.elements';

// Components
import { PieChartsArea } from './PieChartsArea';
import { SearchArea } from './SearchArea';
import { SearchAreaV2 } from './SearchAreaV2';

export interface AlarmChartsAndDataFilterPropsChart {
  title?: string;
  groupKey: string;
  itemKey: string;
  chartType: string;
}

export interface AlarmChartsAndDataFilterProps extends AlarmChartsAndDataFilterContainerProps {
  data?: Record<string, unknown>[];
  children?: ReactNode | ReactNode[];
  groupKey: string;
  itemKey: string;
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  csvFileName?: string;
  charts?: AlarmChartsAndDataFilterPropsChart[];
  title?: string;
  hasLegend?: boolean;
  tooltipText?: string;
  placeholder?: string;
  selectedVersion?: number; // Refers to the select hook version. Recipe History runs on old hook: version 1, alarsm on the new hook version 2
}

export const ProvidedAlarmChartsAndDataFilter = ({
  data,
  children,
  groupKey,
  itemKey,
  containerHeight,
  gridArea,
  className,
  csvFileName,
  charts,
  hasLegend,
  tooltipText,
  selectedVersion
}: AlarmChartsAndDataFilterProps): JSX.Element => {
  // data filters

  //const { selected } = useGroupSelectList();

  if (!data) {
    console.log('error generate select list items for filtering');
    return <>page error</>;
  }

  /*
  // get colors being used by bar chart via their data-chart-id value, after the page loads
  const cachedColors = useColors();

  const groupSelectSettings = {
    items: selected,
    handle,
    colors: cachedColors,
    gridArea: 'select',
    counter: data ? countGroupSelectItems(groupKey, itemKey, data) : undefined
  };
  */

  return (
    <AlarmChartsAndDataFilterContainer {...{ containerHeight, className, gridArea }}>
      <div className={`${baseClass}__search`}>
        {(selectedVersion === 1 || !selectedVersion) && (
          <SearchArea {...{ data, groupKey, itemKey, csvFileName }} />
        )}
        {selectedVersion === 2 && <SearchAreaV2 {...{ data, groupKey, itemKey, csvFileName }} />}
      </div>
      <div className={`${baseClass}__charts`}>
        <PieChartsArea {...{ groupKey, itemKey, data, charts, hasLegend, tooltipText }} />
      </div>
      <div className={`${baseClass}__main`}>{children}</div>
    </AlarmChartsAndDataFilterContainer>
  );
};

export interface AlarmChartsAndDataFilterContextProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
}

export const AlarmChartsAndDataFilterContext = createContext<AlarmChartsAndDataFilterContextProps>({
  isLoading: true
});

export const useAlarmChartsAndDataFilterContext = (): AlarmChartsAndDataFilterContextProps =>
  useContext(AlarmChartsAndDataFilterContext);

export const AlarmChartsAndDataFilter = ({
  isLoading,
  hasError,
  hasMessage,
  groupKey,
  itemKey,
  data,
  containerHeight,
  className,
  gridArea,
  children,
  selectedVersion,
  ...rest
}: AlarmChartsAndDataFilterProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  if (isLoading) return <>loading screen</>;
  if (hasError) return <>error screen</>;
  if (hasMessage) return <>has message</>;
  if (!data) return <>no date screen</>;

  return (
    <ProvidedAlarmChartsAndDataFilter
      {...{
        groupKey,
        itemKey,
        data,
        className,
        containerHeight,
        gridArea,
        children,
        selectedVersion,
        ...rest
      }}
    />
  );
};
