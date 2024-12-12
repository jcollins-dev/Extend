import React from 'react';
import { FilteredChartsAndDataProviders } from './FilteredChartsAndDataProviders';
import { useData } from '../_hooks';
import { FilteredChartsAndDataProps } from './FilteredChartsAndData.types';
import { SearchBarInput } from './SearchArea/SearchBarInput';
import { SearchBarHistoryButtons } from './SearchArea/SearchBarHistoryButtons';
import { SearchBarCSVButton } from './SearchArea/SearchBarCSVButton';
import { StyledStackedBarChart } from '../StyledBarChart/StyledBarChart';
import { StyledPieChart } from '../StyledPieChart/StyledPieChart';
import { FilteredChartsAndDataContainer } from './FilteredChartsAndData.elements';
import { VirtualizedTable } from '../VirtualizedTable';

interface Props extends FilteredChartsAndDataProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Charts = ({ charts }: FilteredChartsAndDataProps) => {
  const apiData = useData();

  return (
    <>
      {charts?.map(({ type, ...chartSettings }) => {
        switch (type) {
          case 'pie':
            return <StyledPieChart {...{ apiData, type, ...chartSettings }} />;
          case 'stacked-bar':
          case 'stacked-bar-over-time':
            return <StyledStackedBarChart {...{ apiData, type, ...chartSettings }} />;
          default:
            return <>error generating cart: invalid chart type</>;
        }
      })}
    </>
  );
};

const Provided = ({ charts, csvButtonSettings, children, tables }: Props) => {
  return (
    <FilteredChartsAndDataContainer className="filtered-charts-and-data">
      <div className="filtered-charts-and-data__search-bar-area">
        <SearchBarInput />
        <SearchBarHistoryButtons />
        {csvButtonSettings && <SearchBarCSVButton {...{ csvButtonSettings }} />}
      </div>

      {charts && (
        <div className="filtered-charts-and-data__charts-area">
          <Charts {...{ charts }} />
        </div>
      )}

      {tables && (
        <div className="filtered-charts-and-data__tables-area">
          {tables.map((tableSettings, i) => (
            <VirtualizedTable key={`table${i}`} {...{ ...tableSettings }} height={500} />
          ))}
        </div>
      )}

      {children}
    </FilteredChartsAndDataContainer>
  );
};

export const FilteredChartsAndData = (props: Props): JSX.Element => {
  const { apiData, ...rest } = props;

  return (
    <FilteredChartsAndDataProviders {...apiData}>
      <Provided {...rest} />
    </FilteredChartsAndDataProviders>
  );
};
