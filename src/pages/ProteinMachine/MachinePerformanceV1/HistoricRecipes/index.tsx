// 3rd party libs
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { find } from 'lodash';

// Components
import { PageTabView } from 'components';
import { AdminCardEditButton } from 'components/machine-health';
import { HistoricRecipeTable } from '../HistoricRecipeTable/HistoricRecipeTable';

// Types
import {
  MachinePerformanceSubTabs,
  ProteinMachineRouteQueryParams,
  WidgetType
} from 'types/protein';
import { PermissionScopeName } from 'types/user-management';

//Providers
import { DateProvider } from 'providers';

// API
import { useGetConfiguredWidgetQuery } from 'api';
import { widgetTypeToLabelSuffixMap } from 'constants/machineConfig';

// Hooks & Providers
import { usePermissions } from 'hooks';
import { useLanguage } from 'providers';

// Styling
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3.25rem 1.5625rem;
  gap: 1.5625rem;
`;

const label = [
  `${MachinePerformanceSubTabs.HistoricRecipes}_${
    widgetTypeToLabelSuffixMap[WidgetType.MatrixWidgetGroup]
  }`
];

interface Props {
  endTime: Date;
  startTime: Date;
}

const HistoricRecipes = ({ startTime, endTime }: Props): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { languageId } = useLanguage();
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

  const { data, error } = useGetConfiguredWidgetQuery({
    machineId,
    labels: label,
    includeTagValues: true,
    languageId: languageId
  });

  const widgetData = data?.[0];
  // TODO: recipe history table widget label = MP_HR_MAIN_RECIPE_HISTORY  (after BE script is executed)
  const tableLabels: string[] = [];
  let recipeTag = '';
  widgetData?.members &&
    widgetData?.members.map((member) => {
      if (member.name === 'Recipe History') {
        member.members &&
          member.members.map((tag) => {
            if (tag.name === 'Active Recipe')
              tag.tags && tag.tags.map((tag) => (recipeTag = tag.name ? tag.name : tag.id));
            if (tag.name === 'Active Recipe' || tag.name === 'Tags and Setpoints')
              tag.tags && tag.tags.map((d) => tableLabels.push(d.id));
          });
      }
    });
  //

  let errorMessage;

  if (error) {
    errorMessage === 'Failed to load data';
  }

  // We only expect to return one widget in the response array, otherwise there has been a misconfiguration
  if (!widgetData) {
    errorMessage === 'Widget not found';
  }

  const isAdmin = widgetData?.id && (scopePermission?.write || permission.isAdmin);

  const tabelProps = {
    outerTableWidth: width,
    recipeTag,
    label: tableLabels,
    machineId,
    isAdmin,
    handleAdminModalToggle: () => handleAdminModalToggle(),
    hasError: errorMessage
  };

  return (
    <DateProvider context={{ startTime, endTime }}>
      <PageTabView>
        <StyledContainer ref={ref}>
          <HistoricRecipeTable {...tabelProps} />
        </StyledContainer>
        {widgetData && (
          <AdminCardEditButton
            isEditAdminPopupOpen={isEditAdminPopupOpen}
            setIsEditAdminPopupOpen={handleAdminModalToggle}
            widgetId={widgetData.id}
            machineId={machineId}
          />
        )}
      </PageTabView>
    </DateProvider>
  );
};

export default HistoricRecipes;
