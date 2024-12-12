//3rd party
import React from 'react';
import { Table, Column, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
// Components
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import styled from 'styled-components';
import { useChartsAndFiltersPageData } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/_hooks/useChartsAndFiltersPageData';

interface Props {
  outerTableWidth?: number;
  isAdmin?: boolean | string;
  handleAdminModalToggle: () => void;
}

export type Ref = HTMLDivElement | undefined | null;

const MainContainerTable = styled.div`
  #recipeHistory {
  .ReactVirtualized__Table__headerRow,
  .ReactVirtualized__Table__Grid,
  .ReactVirtualized__Table__row,
  .ReactVirtualized__Grid__innerScrollContainer {
    min-width: 900px !important;
  }

  .ReactVirtualized__Table__headerTruncatedText { white-space: initial }

  .ReactVirtualized__Table__headerRow {
    text-transform: none;
    font-size: ${({ theme }) => theme.typography.headings.h6.size};
    font-weight: 500;
    line-height: 1rem;
    border: ${({ theme }) => theme.colors.borders.border02.border};
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color:  ${({ theme }) => theme.colors.lightGrey1};
    border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
    display: flex;
    justify-content: space-between;
  }

  .ReactVirtualized__Table__rowColumn {
    font-size: ${({ theme }) => theme.typography.components.tableRow2.size};
  }

  .ReactVirtualized__Table__row {
    width: 100% !important;
    border-left: ${({ theme }) => theme.colors.borders.border02.border};
    border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
    display: flex;
    justify-content: space-between;
  }
`;

export const HistoricRecipeTable = ({
  outerTableWidth,
  isAdmin,
  handleAdminModalToggle
}: Props): JSX.Element => {
  //HistoricRecipeTable.displayName = 'HistoricRecipeTable';

  const { t } = useTranslation(['mh']);

  const generateColumnsTable = (firstRow: string): JSX.Element[] => {
    const headers: string[] = firstRow.split(';');
    let dynamicWidth: number = outerTableWidth ? outerTableWidth / headers.length : 120;
    dynamicWidth = dynamicWidth > 120 ? dynamicWidth : 120;
    return headers.map((header) => {
      const columnSettings = {
        label: header,
        width: dynamicWidth,
        dataKey: header.toLowerCase().replace(/\s/g, '')
      };
      return <Column key={header.toLowerCase().replace(/\s/g, '')} {...columnSettings} />;
    });
  };

  const { data: tableValues, isLoading } = useChartsAndFiltersPageData();

  if (!tableValues) return <></>;

  const filteredData = tableValues;

  const stringKeys = Object.keys(tableValues[0]).join(';');

  const tableHeaders = generateColumnsTable(stringKeys);

  const widgetSettings = {
    Main: (
      <MainContainerTable className={'widget-ui-main scroll-x'}>
        {tableHeaders && filteredData && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <>
                <Table
                  id="recipeHistory"
                  width={width}
                  height={350}
                  headerHeight={40}
                  rowHeight={35}
                  rowCount={filteredData?.length}
                  rowGetter={({ index }) => filteredData?.[index]}
                >
                  {tableHeaders}
                </Table>
              </>
            )}
          </AutoSizer>
        )}
      </MainContainerTable>
    ),
    hasMessage: tableValues?.length === 0 ? t('no_data') : undefined,
    isLoading,
    title: t('historic_recipe_table'),
    IconRight: isAdmin
      ? {
          label: t('edit'),
          Icon: <FontAwesomeIcon icon={faPencil} />,
          handleClick: () => handleAdminModalToggle(),
          tooltip: t('edit')
        }
      : undefined
  };

  return <WidgetUi {...widgetSettings} />;
};
