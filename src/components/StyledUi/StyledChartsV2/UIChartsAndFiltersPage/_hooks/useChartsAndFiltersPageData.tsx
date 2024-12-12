import React, { ReactNode, createContext, useContext } from 'react';
import { UseStyledChartsProps } from '../../hooks';
import { filterSelectedData, useFilterSelected } from 'components/StyledUi/FilterSelected';

export interface UseChartsAndFiltersPageDataProps extends UseStyledChartsProps {
  usesFilteredData?: boolean;
}

const DataContext = createContext<UseChartsAndFiltersPageDataProps>({
  isLoading: true
});

export const useChartsAndFiltersPageData = (): UseChartsAndFiltersPageDataProps =>
  useContext(DataContext);

interface Props extends UseChartsAndFiltersPageDataProps {
  children?: ReactNode | ReactNode[];
}

export const UseChartsAndFiltersPageDataProvider = ({
  children,
  data,
  isLoading,
  hasMessage,
  usesFilteredData,
  ...rest
}: Props): JSX.Element => {
  const [selected] = useFilterSelected();

  const filteredData = usesFilteredData ? filterSelectedData({ data, selected }) : data;

  return (
    <DataContext.Provider value={{ data: filteredData, hasMessage, isLoading, ...rest }}>
      {children}
    </DataContext.Provider>
  );
};
