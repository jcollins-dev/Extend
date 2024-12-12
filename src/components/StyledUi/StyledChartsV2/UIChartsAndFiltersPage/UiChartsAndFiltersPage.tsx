import React from 'react';

import { AreaSearchBar } from './areas/SearchBar/AreaSearchBar';
import { AreaCharts } from './areas/Charts/AreaCharts';
import { AreaTables } from './areas/Tables/AreaTables';

import {
  UseChartsAndFiltersPageDataProps,
  UseChartsAndFiltersPageDataProvider
} from './_hooks/useChartsAndFiltersPageData';

import { DownloadCSVButtonProps, FilterSelectedProvider } from 'components';

import { UiChartsAndFiltersPageContainer, baseClass } from './UiChartsAndFiltersPage.elements';
import { VirtualizedTableProps } from '../VirtualizedTable/VirtualizedTable';
import { TotalsBarProps } from './TotalsBar';
import { StyledUiContainerProps } from 'components';

export interface UiChartsAndFiltersPageProps
  extends UseChartsAndFiltersPageDataProps,
    StyledUiContainerProps {
  tables?: VirtualizedTableProps[];
  csvSettings?: DownloadCSVButtonProps;
  totalsBarSettings?: TotalsBarProps;
  hasTotalsBar?: boolean;
  AreaTotalsBar?: () => JSX.Element;
  usesFilteredData?: boolean;
}

interface Props extends UiChartsAndFiltersPageProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const UiChartsAndFiltersPage = ({
  data,
  isLoading,
  hasMessage,
  hasError,
  charts,
  tables,
  dateRange,
  children,
  csvSettings,
  totalsBarSettings,
  hasTotalsBar,
  className,
  AreaTotalsBar,
  usesFilteredData
}: Props): JSX.Element => {
  className = className ? `${className} ${baseClass}` : baseClass;

  // start with one grid row for the search bar
  let gridRows = `auto`;

  // rows based on incoming settings
  if (charts) gridRows += ` auto`;
  if (totalsBarSettings || hasTotalsBar) gridRows += ` auto`;
  if (tables) gridRows += ` auto`;

  // finish of with a full height area for the children
  gridRows += ` 1fr`;

  return (
    <UiChartsAndFiltersPageContainer {...{ gridRows, className }}>
      <FilterSelectedProvider>
        <UseChartsAndFiltersPageDataProvider
          {...{ data, isLoading, hasMessage, hasError, usesFilteredData }}
        >
          <div className={`${baseClass}__search-bar-area`}>
            <AreaSearchBar {...{ csvSettings, usesFilteredData }} />
          </div>

          {charts && (
            <div className={`${baseClass}__charts-area`}>
              {<AreaCharts {...{ charts, dateRange, usesFilteredData }} />}
            </div>
          )}

          {AreaTotalsBar && (
            <div className={`${baseClass}__totals-bar-area`}>
              <AreaTotalsBar />
            </div>
          )}

          {children}

          {tables && (
            <div className={`${baseClass}__tables-area`}>
              <AreaTables {...{ tables }} />
            </div>
          )}
        </UseChartsAndFiltersPageDataProvider>
      </FilterSelectedProvider>
    </UiChartsAndFiltersPageContainer>
  );
};

//  <AreaTables />
