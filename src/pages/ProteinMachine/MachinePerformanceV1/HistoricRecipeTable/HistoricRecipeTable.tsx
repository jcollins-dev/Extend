//3rd party
import React from 'react';
import { Table, Column, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { useTranslation } from 'react-i18next';

// Api
import { useGetMachineTagsHistoryQuery } from 'api';

// Helpers
import { toISO8601 } from 'helpers';
import { transformDataToUniqueRows } from 'pages/ProteinMachine/MachineHealth/DataAnalysis/TemplateDetails/helpers';

// Providers
import { useDate, useLanguage, useTimeZone } from 'providers';

// Types
import { BaseTag } from 'types/protein';

// Components
import { WidgetUi } from 'components/StyledUi/WidgetUi';
import { Icon } from 'components';
import styled from 'styled-components';

interface Props {
  label: string[];
  machineId: string;
  recipeTag: string;
  outerTableWidth?: number;
  isAdmin?: boolean | string;
  handleAdminModalToggle: () => void;
  hasError?: string;
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
  }

  .ReactVirtualized__Table__rowColumn {
    font-size: ${({ theme }) => theme.typography.components.tableRow2.size};
  }

  .ReactVirtualized__Table__row {
    width: 100% !important;
    border-left: ${({ theme }) => theme.colors.borders.border02.border};
    border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
  }
`;

export const HistoricRecipeTable = React.forwardRef<HTMLDivElement, Props>(
  ({ recipeTag, label, machineId, outerTableWidth, isAdmin, handleAdminModalToggle }: Props) => {
    HistoricRecipeTable.displayName = 'HistoricRecipeTable';
    const { startTime, endTime } = useDate();
    const { timeZone } = useTimeZone();
    const { languageId } = useLanguage();
    const { t } = useTranslation(['mh']);

    const { data: tagData, isFetching: isFetchingTags } = useGetMachineTagsHistoryQuery({
      machineId,
      startDatetime: toISO8601(startTime),
      endDatetime: toISO8601(endTime),
      tagCodes: label,
      languageId
    });

    const stringTags: BaseTag[] = tagData || [];

    const headersOrder = [
      {
        columnName: recipeTag,
        columnPosition: 0
      }
    ];

    const emptyValueSymbol = '--';

    const tableData = transformDataToUniqueRows({
      endTime,
      showDatestamp: true,
      showDuration: true,
      stringTags,
      timeZone,
      headersOrder,
      emptyValueSymbol
    });

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

    const formatValuesForBaseTable = (tableData: string[]) => {
      const newTableValues: Record<string, unknown>[] = [];
      const keys = tableData[0].split(';');
      tableData.map((row: string, index: number) => {
        if (index !== 0) {
          const rowObject: Record<string, unknown> = {};
          row.split(';').map((item, index) => {
            rowObject[keys[index].toLowerCase().replace(/\s/g, '')] = item;
          });
          newTableValues.push(rowObject);
        }
      });
      return newTableValues;
    };

    const tableHeaders = generateColumnsTable(tableData[0]);
    const tableValues = formatValuesForBaseTable(tableData);
    const isLoading = isFetchingTags || !tableData;

    const widgetSettings = {
      Main: (
        <MainContainerTable className={'widget-ui-main scroll-x'}>
          <AutoSizer disableHeight>
            {({ width }) => (
              <>
                <Table
                  id="recipeHistory"
                  width={width}
                  height={500}
                  headerHeight={40}
                  rowHeight={35}
                  rowCount={tableValues.length}
                  rowGetter={({ index }) => tableValues[index]}
                >
                  {tableHeaders}
                </Table>
              </>
            )}
          </AutoSizer>
        </MainContainerTable>
      ),
      hasMessage: tableValues.length === 0 ? t('no_data') : undefined,
      isLoading,
      title: t('historic_recipe_table'),
      IconRight: isAdmin
        ? {
            label: t('edit'),
            Icon: <Icon.ArrowRight />,
            handleClick: () => handleAdminModalToggle(),
            tooltip: t('edit')
          }
        : undefined
    };

    return <WidgetUi {...widgetSettings} />;
  }
);
