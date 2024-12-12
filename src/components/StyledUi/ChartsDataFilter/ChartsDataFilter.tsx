// 3rd party
import React, { ReactNode, useState, useLayoutEffect, useEffect, useMemo } from 'react';

// Components
import {
  ChartsDataFilterContainer,
  ChartsDataFilterContainerProps,
  ChartsDataFilterSearchContainer
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

import { useDateRange } from '../DateRange';

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

  const pieChartSettings = {
    data: convertToChartData(data, groupKey),
    handleClick: (groupId: string) => [handle?.(`toggleGroup`, groupId), setSearchTerm('')],
    // which tags are selected, for pie chart
    selected: getSelectedGroups(selected),
    isDoughnut: true
  };

  const categories = generateCategoriesArray(data, itemKey);

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

  const cachedColors = useColors();

  const groupSelectSettings = {
    items: selected,
    handle,
    colors: cachedColors,
    gridArea: 'select',
    counter: data ? countGroupSelectItems(groupKey, itemKey, data) : undefined
  };

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
    tooltipText: 'typeAndQty',
    selected
  };

  useEffect(() => {
    if (searchTerm) {
      const found = searchForStringAndGetSelected(groupKey, itemKey, data, searchTerm);
      console.log('found', found);
      setSelected?.(found);
    }
  }, [searchTerm]);

  return (
    <>
      <ChartsDataFilterSearchContainer>
        <SearchForm
          handleSubmit={(x?: string) => setSearchTerm(x)}
          placeHolder="Search"
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
          {cachedColors && <GroupSelectLists {...groupSelectSettings} />}
          <DimensionsContainer
            className="charts-data-filter__bars"
            Component={() => <StackedBarChart {...{ ...barChartSettings }} />}
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
  //isLoading,
  //hasError,
  //hasMessage,
  groupKey,
  itemKey,
  data,
  containerHeight,
  className,
  gridArea,
  ...rest
}: ChartsDataFilterProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  const cachedData = useMemo(() => (!data || data.length == 0 ? false : data), [data]);
  const { startTime: refresh } = useDateRange().isoDateRange;
  const items = cachedData
    ? generateGroupedSelectListItems(cachedData, groupKey, itemKey)
    : undefined;

  const isLoading = !cachedData || !items ? true : undefined;

  const cached = useMemo(
    () => (
      <UseGroupSelectListProvider {...{ items, refresh }}>
        {cachedData && (
          <ProvidedChartsDataFilter
            {...{
              groupKey,
              itemKey,
              data: cachedData,
              className,
              containerHeight,
              gridArea,
              ...rest
            }}
          />
        )}
      </UseGroupSelectListProvider>
    ),
    [isLoading, items, cachedData, refresh]
  );

  return cached;
};
