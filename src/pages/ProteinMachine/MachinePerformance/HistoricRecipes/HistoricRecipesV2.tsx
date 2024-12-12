// 3rd party libs
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { find } from 'lodash';
import { format, parseISO } from 'date-fns';

// Components
import { PageTabView } from 'components';
import { AdminCardEditButton } from 'components/machine-health';
import { HistoricRecipeTable } from '../HistoricRecipeTable/HistoricRecipeTable';
import { HistoricRecipesProvider } from '../useHistoricRecipes';
// Types
import { PermissionScopeName } from 'types/user-management';
import { defaultLabelStyles } from 'components/StyledUi/StyledChartsV2/StyledCharts.styles';
import { UseStyledChartProps } from 'components/StyledUi/StyledChartsV2/hooks';
import { UiChartsAndFiltersPage } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/UiChartsAndFiltersPage';

//Providers
import { DateProvider } from 'providers';

// Hooks & Providers
import { usePermissions } from 'hooks';
import { useHistoricRecipes } from '../useHistoricRecipes';
import { useDateRange } from 'components';

// Styling
const HistoricRecipesContainer = styled.div`
  padding: 1rem 2rem;
  grid-gap: 1em;
  display: grid;
  grid-template-rows: auto 1fr;

  .alarms-view__date-picker {
    display: flex;
    justify-content: flex-end;
  }
`;

export const HistoricRecipes = (): JSX.Element => {
  return (
    <HistoricRecipesProvider>
      <HistoricRecipesProvided />
    </HistoricRecipesProvider>
  );
};

//------------------------------------------------//----/
// CHARTS
//------------------------------------------------//----/

// bar chart over time - grouped by `type` and stacked by `date`
const chartAlarmsOverTime: UseStyledChartProps = {
  type: 'stacked-bar-over-time',
  groupKey: 'activerecipe',
  categoryKey: 'date',
  title: 'Recipes by day',
  filteredByKeys: ['activerecipe'],
  format: {
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      const dateKey = (d.dateKey as string) || 'date';
      const date = datum[dateKey];
      const group = datum[(d.groupKey as string) || 'type'];
      return [`${date}`, ` \n `, `${group}: ${datum.count}`];
    }
  },
  tooltipStyles: [
    { ...defaultLabelStyles, fontSize: 13, fillOpacity: 0.7 },
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};

// pie chart with legend - grouped by `type`
const chartAlarmsByType: UseStyledChartProps = {
  //colors: alarmsColors,
  type: 'pie',
  groupKey: 'activerecipe',
  title: 'Recipes distribution',
  format: {
    label: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;
      return `${Math.round(Number(datum.y))}%`;
    },
    tooltip: (d: Record<string, unknown>) => {
      const datum = d?.datum as Record<string, unknown>;

      return [
        `${datum.x === 'undefined' ? 'Undefined' : datum.x}: ${datum.count}`,
        ` \n `,
        `${Math.round(Number(datum.y))}%`
      ];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 16, fontWeight: 500 }
  ]
};

const HistoricRecipesProvided = (): JSX.Element => {
  const permission = usePermissions();

  const scopePermission = find(
    permission?.scopes,
    (scopeItem) => scopeItem.name === PermissionScopeName.FLEET
  );
  const [isEditAdminPopupOpen, setIsEditAdminModalOpen] = useState(false);

  const handleAdminModalToggle = () => setIsEditAdminModalOpen((prev) => !prev);

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    ref.current && setWidth(ref.current?.clientWidth);
  }, []);

  useLayoutEffect(() => {
    ref.current && setWidth(ref.current?.clientWidth);
  }, []);

  const { widgetId, machineId, tableValues, isLoading, hasError, hasMessage } =
    useHistoricRecipes();

  const { startTime, endTime } = useDateRange().dateRange;

  const isAdmin = widgetId && (scopePermission?.write || permission.isAdmin);

  const { isoDateRange, dateRange } = useDateRange();

  const start = format(parseISO(isoDateRange.startTime), 'P');
  const end = format(parseISO(isoDateRange.endTime), 'P');

  const csvFileSettings = {
    data: tableValues,
    fileName: `recipes--${start}-to-${end}.csv`
  };

  const newTableValues = tableValues?.map((x) => {
    const date = x.date as string;
    const [m, d, y] = date.split('/');
    return { ...x, date: `${y}-${m}-${d}` };
  });

  const tableProps = {
    outerTableWidth: width,
    isAdmin,
    handleAdminModalToggle: () => handleAdminModalToggle()
  };

  return (
    <DateProvider context={{ startTime, endTime }}>
      <PageTabView>
        <HistoricRecipesContainer>
          {newTableValues && (
            <UiChartsAndFiltersPage
              data={newTableValues}
              charts={[chartAlarmsOverTime, chartAlarmsByType]}
              dateRange={dateRange || undefined}
              csvSettings={csvFileSettings}
              usesFilteredData
              {...{ isLoading, hasError, hasMessage }}
            >
              <HistoricRecipeTable {...tableProps} />
            </UiChartsAndFiltersPage>
          )}
        </HistoricRecipesContainer>

        {widgetId && machineId && (
          <AdminCardEditButton
            isEditAdminPopupOpen={isEditAdminPopupOpen}
            setIsEditAdminPopupOpen={handleAdminModalToggle}
            widgetId={widgetId}
            machineId={machineId}
          />
        )}
      </PageTabView>
    </DateProvider>
  );
};

export default HistoricRecipes;
