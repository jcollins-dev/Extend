import React, { ReactNode, useState, useLayoutEffect, useEffect } from 'react';
import {
  ChartsDataFilterContainer,
  ChartsDataFilterContainerProps,
  ChartsDataFilterSearchContainer,
  CenteredContainer
} from './ChartsDataFilter.elements';
import { SelectListHistoryButtons } from '../SelectListV2/SelectListHistoryButtons';
import { chartsDataFilterGridSettings } from './chartsDataFilterGridSettings';
import { PageGrid } from '../PageGrid';
import { DimensionsContainer } from '../DimensionsContainer';
import { DownloadCSVButton } from '../DownloadCSVButton/DownloadCSVButton';
import { SearchForm } from '../SearchForm';

import {
  convertToChartData,
  convertToStackedChartData,
  calculateStackedMaxDomain,
  generateCategoriesArray,
  PieChart,
  StackedBarChart
} from '../ChartsV2';
import {
  generateGroupedSelectListItems,
  GroupSelectLists,
  UseGroupSelectListProvider,
  useGroupSelectList,
  getSelectedGroups,
  searchForStringAndGetSelected,
  countGroupSelectItems
} from '../SelectListV2';
import { StyledLoader } from '../elements/StyledLoader';

export interface ChartsDataFilterProps extends ChartsDataFilterContainerProps {
  data?: Record<string, unknown>[];
  title?: string;
  children?: ReactNode | ReactNode[];
  groupKey: string;
  itemKey: string;
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  csvFileName?: string;
}

const baseClass = `charts-data-filter`;

export const ProvidedChartsDataFilter = ({
  title,
  data,
  children,
  groupKey,
  itemKey,
  containerHeight,
  gridArea,
  className,
  csvFileName
}: ChartsDataFilterProps): JSX.Element => {
  // search inpuet box
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  // data filters
  const { handle, selected, setSelected } = useGroupSelectList();
  if (!data || !selected) return <></>;
  /*
  if (!data)
    return (
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        <div className="charts-data-filter__centered charts-data-filter__centered--has-error">
          error building charts
        </div>
      </ChartsDataFilterContainer>
    );

  if (!selected)
    return (
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        <div className="charts-data-filter__centered">building charts</div>
      </ChartsDataFilterContainer>
    );
*/
  // get colors being used by bar chart via their data-chart-id value, after the page loads
  const colors = useColors();

  const pieChartSettings = {
    data: convertToChartData(data, groupKey),
    handleClick: (groupId: string) => [handle?.(`toggleGroup`, groupId), setSearchTerm('')],
    // which tags are selected, for pie chart
    selected: getSelectedGroups(selected),
    isDoughnut: true
  };

  const categories = generateCategoriesArray(data, itemKey);

  const barChartSettings = {
    // converts data to stacked chart data
    data: convertToStackedChartData(data, groupKey, itemKey),
    handleClick: (groupId: string, itemId: string) => {
      handle?.('toggleItem', groupId, itemId);
      setSearchTerm('');
    },
    // generates categories to stack recipes by date in the stacked bar chart
    categories,
    tickMarks: categories,
    // gets the max number of values per column, this to get the max containerHeight of each bar column
    maxDomain: calculateStackedMaxDomain(data, itemKey),
    isDoughnut: true,
    selected
  };

  const csvBtnSettings = {
    headers: {
      activerecipe: `Active Recipe`,
      date: `Date`,
      starttime: `Start Time`,
      duration: `Duration`
    },
    fileName: `${csvFileName || title}.csv`,
    data
  };

  const groupSelectSettings = {
    items: selected,
    handle,
    colors,
    gridArea: 'select',
    counter: data ? countGroupSelectItems(groupKey, itemKey, data) : undefined
  };

  useEffect(() => {
    if (searchTerm) {
      const found = searchForStringAndGetSelected(groupKey, itemKey, data, searchTerm);
      setSelected?.(found);
    }
  }, [searchTerm]);

  return (
    <>
      <ChartsDataFilterSearchContainer>
        <SearchForm
          handleSubmit={(x?: string) => setSearchTerm(x)}
          placeHolder="Search Recipes"
          data={data}
          hasSuggestions
        />
        <DownloadCSVButton {...csvBtnSettings} />
        <SelectListHistoryButtons />
      </ChartsDataFilterSearchContainer>
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        <PageGrid {...chartsDataFilterGridSettings}>
          <header>
            <h2>
              {title}{' '}
              <span className="charts-data-filter__count">{`(${data?.length} Total Items)`}</span>
            </h2>
          </header>
          <GroupSelectLists {...groupSelectSettings} />
          <DimensionsContainer
            className="charts-data-filter__bars"
            Component={(props) => <>demo</>}
          />
          <div className="charts-data-filter__pie">
            <PieChart {...pieChartSettings} />
          </div>
        </PageGrid>
        <span className="line-spacer"></span>
        {children}
      </ChartsDataFilterContainer>
    </>
  );
};

const useColors = (): Record<string, string> | undefined => {
  const { selected } = useGroupSelectList();

  const [colors, setColors] = useState<Record<string, string> | undefined>(undefined);

  const getColors = () => {
    if (selected) {
      const groupIds = Object.keys(selected).map((k) => k.toLowerCase());
      let colors: Record<string, string> = {};
      groupIds.map((id) => {
        // Get the HTML element by its data-bar-id attribute
        const barElement: Element | null = document.querySelector(`[data-chart-id="${id}"]`);
        if (barElement) {
          const fillColor = window.getComputedStyle(barElement).getPropertyValue('fill');
          if (!colors[id]) colors = { ...colors, [id]: fillColor };
          // Get the fill color of the element
        }
      });
      return colors;
    }
  };
  useLayoutEffect(() => {
    if (selected) {
      setColors(getColors());
    }
  }, [selected]);

  return colors;
};

export const ChartsDataFilter = ({
  isLoading,
  hasError,
  hasMessage,
  groupKey,
  itemKey,
  data,
  containerHeight,
  className,
  gridArea,
  ...rest
}: ChartsDataFilterProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  isLoading = data && data?.length == 0 ? true : isLoading;

  if (isLoading)
    return (
      <CenteredContainer>
        <StyledLoader />
      </CenteredContainer>
    );
  if (hasError) {
    className = `${className} status--error status__font`;
    return (
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        {hasError}
      </ChartsDataFilterContainer>
    );
  }

  //hasMessage = hasMessage ? hasMessage : data?.length == 0 ? `no data in range` : undefined;

  if (hasMessage)
    return (
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        <div className="charts-data-filter__centered">{hasMessage}</div>
      </ChartsDataFilterContainer>
    );

  if (!data)
    return (
      <ChartsDataFilterContainer {...{ containerHeight, className, gridArea }}>
        <div className="charts-data-filter__centered charts-data-filter__centered--has-error">
          error loading charts
        </div>
      </ChartsDataFilterContainer>
    );

  const items = generateGroupedSelectListItems(data, groupKey, itemKey);

  return (
    <UseGroupSelectListProvider {...{ items }}>
      <ProvidedChartsDataFilter
        {...{ groupKey, itemKey, data, className, containerHeight, gridArea, ...rest }}
      />
    </UseGroupSelectListProvider>
  );
};
