//3rd party libs
import React, { ReactNode, useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { find } from 'lodash';

//Components
import ActiveIssuesTable from './ActiveIssuesTable';
import EditTagsModal from './EditTagsModal';
import TagTable from './TagTable';
import Typography from 'components/Typography/Typography';
import { DashboardWidgetUi } from '../DashboardWidget/DashboardWidgetUi';
import { Icon } from 'components/StyledUi';
import { LineCardWidgetMain } from './LineCardWidget.elements';
import { MachineStatusIcon } from 'components/StyledUi/MachineStatusIcon/MachineStatusIcon';
import { useDateRange } from 'components/StyledUi';

// API
import {
  useGetMachineConfiguratorDataQuery,
  useGetMachineDataAnalysisTagsQuery,
  useGetMachineUtilizationQuery
} from 'api';

//Types
import { LineViewMachine, MachineUtilization } from 'types/protein';
import { TagProp } from './EditTagsModal';
import { TagProps } from './TagTable';
import { Tag } from 'types/protein';
import { PermissionScopeName } from 'types/user-management';

// Hooks & Providers
import { usePermissions } from 'hooks';
import { useLanguage } from 'providers';

//Helpers
import { formatValueByValueType } from 'components/machine-health/MachineKpi/utils';

interface LineCardWidgetProps {
  businessUnitId: number;
  machineId: string;
  name: string;
  children?: ReactNode | ReactNode[];
  handleClick: (id: string) => void | undefined;
  setUtilizationByMachine: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        utilization: MachineUtilization;
      }[]
    >
  >;
}

export interface TagTableItemProps {
  label?: string;
  actual?: string | number;
  id?: string;
  name?: string;
  type?: string;
  unit?: string;
  machineId?: string;
  meta?: {
    dataType?: string;
  };
}

export const LineCardWidget = ({
  businessUnitId,
  machineId,
  name,
  handleClick,
  setUtilizationByMachine
}: LineCardWidgetProps): JSX.Element => {
  const theme = useTheme();
  const permission = usePermissions();
  const scopePermission = find(
    permission?.scopes,
    (scopeItem) => scopeItem.name === PermissionScopeName.FLEET
  );
  const { languageId } = useLanguage();

  const [currentMachineTagsEdit, setCurrentMachineTagsEdit] = useState<string>('');
  const [formattedTags, setFormattedTags] = useState<TagProp[]>([]);
  const { startTime: startDatetime, endTime: endDatetime } = useDateRange().isoDateRange;

  const { data: utilizationData } = useGetMachineUtilizationQuery({
    machineId,
    startDatetime,
    endDatetime
  });

  // Populate the utilizationByMachine state with the utilization data
  useEffect(() => {
    if (utilizationData) {
      setUtilizationByMachine((prev) => [
        ...prev.filter((item) => item.id !== machineId),
        {
          id: machineId,
          utilization: utilizationData
        }
      ]);
    }
  }, [utilizationData]);

  const {
    data: machineData,
    isFetching: fetching,
    error: machineError
  } = useGetMachineConfiguratorDataQuery({
    machineId,
    labels: [LineViewMachine.LineViewMachine],
    languageId: languageId,
    showInactive: false
  });

  const isConfigured = machineData && machineData.length > 0;
  const isTableData = machineData && (machineData[0]?.tags as TagTableItemProps[]);

  const tags = isTableData?.map((item) => item.id);

  useEffect(() => {
    const formattedTags: TagProp[] = [];
    isTableData?.forEach((item) => {
      formattedTags.push(item);
    });
    setFormattedTags(formattedTags);
  }, [machineData]);

  const {
    data: tagsRawData,
    isFetching: isLoadingTags,
    error: isErrorTagsRawData
  } = useGetMachineDataAnalysisTagsQuery(
    machineId
      ? {
          machineId,
          numbersOnly: 'false',
          tags
        }
      : skipToken,
    { skip: !machineId }
  );

  const formatGridTableDataValue = (
    tagsRawData?: Tag[],
    thisWidgetTags?: TagTableItemProps[] | []
  ): TagProps[] => {
    if (!tagsRawData || !thisWidgetTags) return [];

    const thisWidgetTagIds = thisWidgetTags.map((item) => item.id);
    const thisWidgetTagValues = tagsRawData?.filter(
      (item) => thisWidgetTagIds.indexOf(item.tagId) > -1
    );

    if (thisWidgetTagIds.length === 0 || thisWidgetTagValues.length === 0) return [];

    const formattedValues: TagProps[] = [];

    thisWidgetTags.forEach((item) => {
      const tagValue = thisWidgetTagValues?.find((value) => value.tagId === item.id);
      const tag = {
        name: item.name || item.id,
        value: formatValueByValueType(tagValue?.value, item.meta?.dataType) || '--',
        unit: item.unit
      };

      formattedValues.push(tag);
    });

    return formattedValues;
  };

  const isLoading = fetching || isLoadingTags;
  const error = machineError || isErrorTagsRawData ? 'Error' : undefined;

  const headerIcon = {
    handleClick: () => handleClick(machineId),
    label: 'header icon button label',
    toolTip: 'Go to machine'
  };

  const handleEditTagsClick = (id: string): void => {
    setCurrentMachineTagsEdit(id);
  };

  const noDataMessage = (
    <Typography color={theme.colors.darkGrey} mb={0} variant="body2">
      No data
    </Typography>
  );

  // Display configurator prompt for admins, 'No data' message for other users
  const fallBackMessage =
    scopePermission?.write || permission.isAdmin ? (
      <Typography color={theme.colors.atRiskYellow} mb={0} variant="body2">
        This machine is not configured and cannot be edited. Use the configurator to add a
        configuration to this machine before it can be edited.
      </Typography>
    ) : (
      noDataMessage
    );

  const Main = (
    <LineCardWidgetMain>
      {isConfigured ? (
        <div className="ui-table-wrapper">
          {isTableData ? (
            <TagTable tableData={[...formatGridTableDataValue(tagsRawData, isTableData)]} />
          ) : (
            noDataMessage
          )}
          {(scopePermission?.write || permission.isAdmin) && (
            <button
              className="ui-icon"
              type="button"
              onClick={() => handleEditTagsClick(machineId)}
            >
              <Icon.AdminEdit />
            </button>
          )}
        </div>
      ) : (
        fallBackMessage
      )}

      <ActiveIssuesTable machineId={machineId} />
    </LineCardWidgetMain>
  );

  const settings = {
    Main,
    Header: (
      <>
        {name} <MachineStatusIcon {...{ machineId }} />
      </>
    ),
    IconRight: { ...headerIcon, Icon: <Icon.ChevRight /> },
    isLoading: isLoading,
    hasError: error
  };

  return (
    <>
      <DashboardWidgetUi {...settings} />
      {currentMachineTagsEdit && (
        <EditTagsModal
          businessUnitId={businessUnitId}
          currentTagData={formattedTags || []}
          isOpen={!!currentMachineTagsEdit}
          machineId={currentMachineTagsEdit}
          onCloseCallback={() => setCurrentMachineTagsEdit('')}
          rawTagData={tagsRawData || []}
        />
      )}
    </>
  );
};
