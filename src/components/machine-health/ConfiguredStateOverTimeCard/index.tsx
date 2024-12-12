// 3rd party libs
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

// Components
import { StateOverTimeCard, PermissionWrapper } from 'components';
import { AdminCardEditButton, DataRenderer } from 'components/machine-health';

// Theme
import theme from 'themes';

// Types
import { NestedRow } from 'components/StateOverTimeCard';
import { BaseTag, BaseTagStateValue, BaseTagType } from 'types/protein';
import { Role, UserScopes } from 'types';

// Api
import { useGetConfiguredWidgetQuery } from 'api';

// Helpers
import { toISO8601 } from 'helpers';

// Hooks & Providers
import { useLanguage, useTimeZone } from 'providers';
import { PermissionScopeName } from 'types/user-management';

const Container = styled.div`
  position: relative;
`;

const EditButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

type Props = {
  machineId: string;
  startDatetime: Date;
  endDatetime: Date;
  label: string;
};

// Format API response data to match the format StateOverTimeCard expects
const toNestedData = (tags?: BaseTag[]): NestedRow[] => {
  if (!tags?.length) {
    return [];
  }

  const copy = _.cloneDeep(tags);

  const nestedData = copy
    // We cannot render tags that are not of type "state", so ignore them
    .filter((tag) => {
      if (tag.type === BaseTagType.State) {
        const filteredEmptyValues = tag.values.filter((value) => value.value !== '');
        tag.values = filteredEmptyValues;
        if (filteredEmptyValues.length > 0) return tag;
      }
    })
    // Modify into the format that StateOverTimeCard expects
    .map((tag, idx) => ({
      id: idx,
      label: tag.name || tag.id || '',
      parentProperty: tag.id,
      data: tag.values.map((tagValue) => {
        const { value, name, timestamp, endTimestamp } = tagValue as BaseTagStateValue;
        return {
          stateCode: value,
          stateName: name,
          startTimestamp: timestamp,
          endTimestamp: endTimestamp
        };
      })
    }));

  return nestedData;
};

/**
 * ConfiguredStateOverTimeCard queries the widget API to get configured data for a particular widget label and machine.
 * The data is formatted, and then passed into a StateOverTimeCard to render
 */
const ConfiguredStateOverTimeCard = ({
  machineId,
  startDatetime,
  endDatetime,
  label
}: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { languageId } = useLanguage();

  const { data, isLoading, error } = useGetConfiguredWidgetQuery({
    machineId,
    labels: [label],
    includeTagValues: true,
    startDatetime: toISO8601(startDatetime, timeZone),
    endDatetime: toISO8601(endDatetime, timeZone),
    languageId: languageId
  });

  const widgetData = data && data[0];

  let errorMessage;

  if (error) {
    errorMessage === 'Failed to load data';
  }

  // We only expect to return one widget in the response array, otherwise there has been a misconfiguration
  if (!widgetData) {
    errorMessage === 'Widget not found';
  }

  if (!widgetData?.tags || widgetData?.tags?.length === 0) {
    errorMessage === 'No configured tags';
  }

  // Map state codes to colors
  const colorMap = theme.colors.proteinMachineStateColors as { [key: string]: string };

  const nestedData = useMemo(() => toNestedData(widgetData?.tags), [widgetData]);

  const [isEditAdminPopupOpen, setIsEditAdminPopupOpen] = useState<boolean>(false);

  return (
    <DataRenderer isLoading={isLoading} error={error && 'Failed to load data'}>
      <Container>
        <StateOverTimeCard
          hideSubStepIds
          title={widgetData?.name || ''}
          nestedData={nestedData}
          stateColors={colorMap}
        />
        <EditButtonContainer>
          <Tooltip placement="top" overlay={'Edit'}>
            <IconButton onClick={() => setIsEditAdminPopupOpen(true)}>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </Tooltip>
        </EditButtonContainer>
        {widgetData?.id && (
          <PermissionWrapper
            page={PermissionScopeName.FLEET}
            scope={UserScopes.Write}
            role={Role.Admin}
          >
            <EditButtonContainer>
              <AdminCardEditButton
                widgetId={widgetData.id}
                machineId={machineId}
                isEditAdminPopupOpen={isEditAdminPopupOpen}
                setIsEditAdminPopupOpen={setIsEditAdminPopupOpen}
              />
            </EditButtonContainer>
          </PermissionWrapper>
        )}
      </Container>
    </DataRenderer>
  );
};

export default ConfiguredStateOverTimeCard;
