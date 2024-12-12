import BaseSelect from 'components/BaseSelect/BaseSelect';
import {
  CustomContentRenderer,
  CustomDropdownRendererAlertFieldSelector
} from 'components/machine-health/configurator/WidgetTable/Dropdown';
import React, { useMemo, useState } from 'react';
import { FieldSelectorProps } from 'react-querybuilder';
import { AlertsTableDropdownItem, TagsDropdownItems } from 'types/machine-health/widget-table';
import { useGetAlertStatementTagsQuery } from 'api';
import { AlertStatementTag } from 'types/machine-health/alerts';
import Loader from 'components/Loader';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
type TDropdown = {
  label: string;
  id: string;
  tagGroupName: string;
  name: string;
  tagId: string;
  values: [{ value: number }];
};

const CustomFieldEditor = (props: FieldSelectorProps): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<TDropdown | null>(null);
  const { machineId } = useFleetMachineAccountData();
  const MACHINE_ID = machineId;
  const {
    data: alertStatementTagQuery,
    isFetching,
    isError
  } = useGetAlertStatementTagsQuery(
    MACHINE_ID
      ? {
          machineId: MACHINE_ID
        }
      : skipToken
  );

  const MasterTagDropdownList = useMemo(() => {
    if (!isFetching && !isError) {
      if (alertStatementTagQuery && alertStatementTagQuery.length > 0) {
        const field = alertStatementTagQuery.find((tag) => tag.tagId === props.rule.field);
        if (field) {
          setDropdownValue({
            ...dropdownValue,
            label: field.tagId as string,
            id: field.name,
            tagGroupName: field.tagGroupName,
            name: field.name as string,
            tagId: field.tagId as string,
            values: [
              {
                value: field.value
              }
            ]
          });
        }
        return alertStatementTagQuery.map((item: AlertStatementTag) => ({
          label: item.tagId,
          id: item.name,
          tagGroupName: item.tagGroupName,
          name: item.name,
          tagId: item.tagId,
          values: [{ value: item.value }]
        }));
      } else {
        return [];
      }
    }
    return [];
  }, [alertStatementTagQuery, isFetching]);

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer
              item={id as unknown as TagsDropdownItems}
              label={MasterTagDropdownList.length === 0 ? 'No Data' : 'select_a_tag'}
              toolTipText={'Tag Is Required'}
            />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRendererAlertFieldSelector
              props={props}
              state={state}
              methods={methods}
            />
          )}
          disabledLabel={'tag_already_assigned'}
          handleChangeSearch={(
            value: (AlertsTableDropdownItem | string | Record<string, unknown> | undefined)[]
          ) => {
            // We need to account for the case when value = undefined ...
            // ... which can happen when the user clears the search field
            const updateValue = value[0] as TDropdown;
            props.handleOnChange(updateValue && updateValue.tagId);
            return updateValue && setDropdownValue(updateValue);
          }}
          labelField="id"
          options={MasterTagDropdownList as { id: string; label: string }[]}
          placeholder={'select_tag'}
          searchable
          searchBy="label" // label is assigned as friendlyName value
          value={{
            label: dropdownValue,
            id: dropdownValue,
            name: dropdownValue
          }}
          valueField="id"
          variant={MasterTagDropdownList.length === 0 ? 'disabled' : 'gray'}
        />
      )}
    </>
  );
};

export default CustomFieldEditor;
