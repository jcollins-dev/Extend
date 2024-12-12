// 3rd party libs
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { find } from 'lodash';
import moment from 'moment';

// Components
import { PageTabView } from 'components';
import { AdminCardEditButton } from 'components/machine-health';
import { HistoricRecipeTable } from '../HistoricRecipeTable/HistoricRecipeTable';
//import { HistoricRecipesCharts } from '../HistoricRecipesCharts';
import { HistoricRecipesProvider } from '../useHistoricRecipes';
import { ChartsDataFilter } from 'components/StyledUi/ChartsDataFilter';
// Types
import { PermissionScopeName } from 'types/user-management';

//Providers
import { DateProvider } from 'providers';

// Hooks & Providers
import { usePermissions } from 'hooks';
import { useHistoricRecipes } from '../useHistoricRecipes';
import { useDateRange } from 'components';

// Styling
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3.25rem 1.5625rem;
  gap: 1.5625rem;

  .historic-recipes-page-grid {
    .select-list--group {
      max-height: 250px;
    }

    .widget-ui {
      height: 300px;
    }
  }
`;

const HistoricRecipes = (): JSX.Element => {
  return (
    <HistoricRecipesProvider>
      <HistoricRecipesProvided />
    </HistoricRecipesProvider>
  );
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

  const { widgetId, machineId, tableValues, isLoading, hasError, hasMessage, groupKey } =
    useHistoricRecipes();

  const { startTime, endTime } = useDateRange().dateRange;

  const isAdmin = widgetId && (scopePermission?.write || permission.isAdmin);

  const tabelProps = {
    outerTableWidth: width,
    isAdmin,
    handleAdminModalToggle: () => handleAdminModalToggle()
  };

  const chartsDataFilterSettings = {
    isLoading,
    hasError,
    hasMessage,
    title: `Recipes by Date and Distribution`,
    data: tableValues,
    groupKey: groupKey as string,
    itemKey: `date`,
    csvFileName: `${machineId}__recipes__from-${moment(startTime).format('L')}__to-${moment(
      endTime
    ).format('L')}`
  };

  return (
    <DateProvider context={{ startTime, endTime }}>
      <PageTabView>
        <StyledContainer ref={ref}>
          <ChartsDataFilter {...chartsDataFilterSettings}>
            <HistoricRecipeTable {...tabelProps} />
          </ChartsDataFilter>
        </StyledContainer>

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
