// 3rd party libs
import React, { useState } from 'react';
import { find } from 'lodash';

// Component
import TwoColumnCard from 'components/KPICard/TwoColumnCard';
import { DashboardWidget } from 'components';
import { AdminCardEditButton } from '../../../components/machine-health';

// API
import { useGetConfiguredWidgetQuery } from 'api';

// Types
import { PermissionScopeName } from 'types/user-management';

// Hooks & Providers
import { usePermissions } from 'hooks';
import { useLanguage } from 'providers';

import { formatTagData } from './utils';
import { useTheme } from 'styled-components';
import { ProteinMachineState } from 'types/protein';

interface Props {
  label: string;
  machineId: string;
}

/**
 * ConfiguredKPICard queries the widget API to get configured data for a particular widget label and machine.
 * It displays both states and tags, depending on what is selected to be displayed by the configurator.
 */
const ConfiguredKPICard = ({ label, machineId }: Props): JSX.Element => {
  const permission = usePermissions();
  const theme = useTheme();
  const colorMap = theme.colors.proteinMachineStateColors;

  const scopePermission = find(
    permission?.scopes,
    (scopeItem) => scopeItem.name === PermissionScopeName.FLEET
  );
  const { languageId } = useLanguage();
  const [isEditAdminPopupOpen, setIsEditAdminModalOpen] = useState<boolean>(false);

  const handleAdminModalToggle = () => setIsEditAdminModalOpen(!isEditAdminPopupOpen);

  const { data, isLoading, error } = useGetConfiguredWidgetQuery(
    {
      machineId,
      labels: [label],
      includeTagValues: true,
      languageId: languageId
    },
    {
      pollingInterval: 5000
    }
  );

  const widgetData = data && data[0];

  let errorMessage;

  if (error) {
    errorMessage = 'Failed to load data';
  }

  // We only expect to return one widget in the response array, otherwise there has been a misconfiguration
  if (!widgetData) {
    errorMessage = 'Widget not found';
  }

  if (!widgetData?.tags || widgetData?.tags?.length === 0) {
    errorMessage = 'No configured tags';
  }

  const heading = widgetData?.name ?? '';

  // Format data to be presented by TwoColumnCard
  const formattedTagData = widgetData && widgetData?.tags && formatTagData(widgetData?.tags);
  const colorCodedTagData = formattedTagData?.map((tag) => {
    const { unit, key, value, tagType, tagValue } = tag;
    return {
      unit,
      key,
      value,
      color: tagType === 'state' ? colorMap[tagValue as ProteinMachineState] : theme.colors.darkGrey
    };
  });

  const isAdmin = widgetData?.id && (scopePermission?.write || permission.isAdmin) ? true : false;

  let adminEditModalData;
  if (widgetData) {
    adminEditModalData = {
      widgetId: widgetData.id,
      machineId: machineId
    };
  }

  const widgetSettings = {
    title: heading,
    isLoading: isLoading ? true : false,
    hasError: errorMessage,
    isAdminWidget: isAdmin,
    onAdminButtonClickCallback: handleAdminModalToggle
  };

  return (
    <>
      <DashboardWidget {...widgetSettings}>
        {colorCodedTagData && <TwoColumnCard values={colorCodedTagData || []} />}
      </DashboardWidget>
      {adminEditModalData && (
        <AdminCardEditButton
          {...{
            isEditAdminPopupOpen,
            setIsEditAdminPopupOpen: handleAdminModalToggle,
            ...adminEditModalData
          }}
        />
      )}
    </>
  );
};

export default ConfiguredKPICard;
