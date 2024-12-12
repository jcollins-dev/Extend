import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetAlertStatementTagsQuery } from 'api';
import BaseSelect from 'components/BaseSelect/BaseSelect';
import Loader from 'components/Loader';
import {
  CustomContentRendererValueEditor,
  CustomDropdownRendererAlertValueEditor
} from 'components/machine-health/configurator/WidgetTable/Dropdown';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { ValueEditorProps } from 'react-querybuilder';
import { useParams } from 'react-router-dom';
import { AlertStatementTag } from 'types/machine-health/alerts';
import { AlertsTableDropdownItem, TagsDropdownItems } from 'types/machine-health/widget-table';

export type TDropdownValue = {
  label?: string | null;
  id: string | null;
  tagGroupName?: string | null;
  isCustomThresholdValue: boolean;
  name?: string | null;
  tagId?: string | null;
  value?: string | number | null;
  values: [{ value?: number | null }];
};

type TParams = {
  alertId: string;
  machineId: string;
};

const CustomValueEditor = (props: ValueEditorProps): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<TDropdownValue | null>(null);
  const [dropdownValueContains, setDropdownValueContains] = useState<TDropdownValue | null>(null);
  const [dropdownValueBetween1, setDropdownValueBetween1] = useState<TDropdownValue | null>(null);
  const [dropdownValueBetween2, setDropdownValueBetween2] = useState<TDropdownValue | null>(null);
  const { machineId } = useFleetMachineAccountData();
  const [isUpdateAlert, setIsUpdateAlert] = useState(false);
  const params: TParams = useParams();
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
        if (props.rule.operator === 'CONTAINS') {
          const field = alertStatementTagQuery.find(
            (tag) => tag.tagId === props.rule.value.split('/')[1]
          );
          if (field) {
            setDropdownValueContains({
              ...dropdownValueContains,
              label: field.tagId as string,
              id: field.name,
              tagGroupName: field.tagGroupName,
              name: field.name as string,
              isCustomThresholdValue: false,
              tagId: field.tagId as string,
              values: [
                {
                  value: field.value
                }
              ]
            });
          } else {
            params.alertId
              ? setDropdownValueContains({
                  ...dropdownValueContains,
                  label: null,
                  id: props.rule.value.split('/')[0] as string,
                  tagGroupName: null,
                  name: null,
                  isCustomThresholdValue: true,
                  tagId: null,
                  values: [
                    {
                      value: props.rule.value.split('/')[0]
                    }
                  ]
                })
              : setDropdownValueContains(null);
          }
        } else if (props.rule.operator === 'BETWEEN' || props.rule.operator === 'NOT_BETWEEN') {
          const valueOne = props?.value?.split(',')[0];
          const valueTwo = props?.value?.split(',')[1];
          const BetweenFieldTwo = alertStatementTagQuery.find(
            (tag) => tag.tagId === valueTwo.split('/')[1]
          );
          const BetweenFieldOne = alertStatementTagQuery.find(
            (tag) => tag.tagId === valueOne.split('/')[1]
          );
          if (BetweenFieldOne) {
            setDropdownValueBetween1({
              ...dropdownValueBetween1,
              label: BetweenFieldOne.tagId as string,
              id: BetweenFieldOne.name,
              tagGroupName: BetweenFieldOne.tagGroupName,
              name: BetweenFieldOne.name as string,
              isCustomThresholdValue: false,
              tagId: BetweenFieldOne.tagId as string,
              values: [
                {
                  value: BetweenFieldOne.value
                }
              ]
            });
          } else {
            params.alertId
              ? setDropdownValueBetween1({
                  ...dropdownValueBetween1,
                  label: null,
                  id: valueOne.split('/')[0] as string,
                  tagGroupName: null,
                  name: null,
                  isCustomThresholdValue: true,
                  tagId: null,
                  values: [
                    {
                      value: valueOne.split('/')[0]
                    }
                  ]
                })
              : setDropdownValueBetween1(null);
          }

          if (BetweenFieldTwo) {
            setDropdownValueBetween2({
              ...dropdownValueBetween2,
              label: BetweenFieldTwo.tagId as string,
              id: BetweenFieldTwo.name,
              tagGroupName: BetweenFieldTwo.tagGroupName,
              name: BetweenFieldTwo.name as string,
              isCustomThresholdValue: false,
              tagId: BetweenFieldTwo.tagId as string,
              values: [
                {
                  value: BetweenFieldTwo.value
                }
              ]
            });
          } else {
            params.alertId
              ? setDropdownValueBetween2({
                  ...dropdownValueBetween2,
                  label: null,
                  id: valueTwo.split('/')[0] as string,
                  tagGroupName: null,
                  name: null,
                  isCustomThresholdValue: true,
                  tagId: null,
                  values: [
                    {
                      value: valueTwo.split('/')[0]
                    }
                  ]
                })
              : setDropdownValueBetween2(null);
          }
        } else {
          const field = alertStatementTagQuery.find(
            (tag) => tag.tagId === props.rule.value.split('/')[1]
          );

          if (field) {
            setDropdownValue({
              ...dropdownValue,
              label: field.tagId as string,
              id: field.name,
              tagGroupName: field.tagGroupName,
              isCustomThresholdValue: false,
              name: field.name as string,
              tagId: field.tagId as string,
              value: field.value,
              values: [
                {
                  value: field.value
                }
              ]
            });
          } else {
            params.alertId
              ? setDropdownValue({
                  ...dropdownValue,
                  label: null,
                  id: props.rule.value.split('/')[0] as string,
                  tagGroupName: null,
                  isCustomThresholdValue: true,
                  name: null,
                  tagId: null,
                  value: props.rule.value.split('/')[0],
                  values: [
                    {
                      value: props.rule.value.split('/')[0]
                    }
                  ]
                })
              : setDropdownValue(null);
          }
        }
        return alertStatementTagQuery.map((item: AlertStatementTag) => ({
          label: item.tagId,
          value: item.value,
          id: item.name,
          friendlyName: item.name,
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

  useEffect(() => {
    if (dropdownValue && dropdownValue?.id?.length !== 0 && isUpdateAlert) {
      setDropdownValue(null);
    }
    if (dropdownValueBetween1 && dropdownValueBetween1?.id?.length !== 0 && isUpdateAlert) {
      if (props.operator !== String('BETWEEN') || props.operator !== String('NOT_BETWEEN')) {
        setDropdownValueBetween1(null);
        setDropdownValueBetween2(null);
      }
    }
    if (dropdownValueContains && dropdownValueContains?.id?.length !== 0 && isUpdateAlert) {
      setDropdownValueContains(null);
    }

    setIsUpdateAlert(true);
  }, [props.operator]);

  if (isFetching) {
    return <Loader />;
  } else {
    // condition for between operator
    if (props.operator === 'BETWEEN' || props.operator === 'NOT_BETWEEN') {
      return (
        <>
          <section style={{ margin: '0 -1rem' }}>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABoAQMAAACXLQHQAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAAAZQTFRFAAAAe7fiGEOFVQAAAAJ0Uk5TAP9bkSK1AAAAKklEQVR4nGNgQALs/////4CDAVczyhhkDGAU/cfBGCQuHGUQZuDOemAAAARnJjjOODZ3AAAAAElFTkSuQmCC"
              alt=""
              style={{ width: '2.5rem' }}
            />
          </section>
          <div style={{ width: '100%' }}>
            <BaseSelect
              contentRenderer={({ id }: Record<string, unknown>) => (
                <CustomContentRendererValueEditor
                  item={id as unknown as TagsDropdownItems}
                  toolTipText="Threshold is Required"
                  label={
                    MasterTagDropdownList.length === 0 ? 'No Data' : 'choose_a_tag_or_threshold'
                  }
                />
              )}
              dropdownRenderer={(props, state, methods) => (
                <CustomDropdownRendererAlertValueEditor
                  props={props}
                  state={state}
                  methods={methods}
                  thresholdType="number"
                />
              )}
              disabledLabel={'tag_already_assigned'}
              handleChangeSearch={(
                value: (AlertsTableDropdownItem | string | Record<string, unknown> | undefined)[]
              ) => {
                // We need to account for the case when value = undefined ...
                // ... which can happen when the user clears the search field

                // const updateValue = value[0] as unknown as AlertsTableDropdownItem | undefined;
                // return updateValue && setDropdownValueBetween1(updateValue);

                // if (updateValue && (updateValue?.tagId as string) && updateValue.id !== null) {
                //   return setDropdownValueBetween1({
                //     ...updateValue,
                //     isCustomThresholdValue: false
                //   });
                // } else {
                //   if (updateValue && updateValue.id !== null) {
                //     return setDropdownValueBetween1({
                //       ...updateValue,
                //       isCustomThresholdValue: true
                //     });
                //   }
                // }

                const betweenValue2Tag =
                  dropdownValueBetween2 && dropdownValueBetween2.tagId === null
                    ? undefined
                    : dropdownValueBetween2 && dropdownValueBetween2.tagId;

                const updateValue = value[0] as TDropdownValue;
                if (updateValue && (updateValue?.tagId as string) && updateValue.id !== null) {
                  const betweenValue1 = updateValue
                    ? updateValue.values && updateValue.values[0].value + '/' + updateValue.tagId
                    : '0';
                  const betweenValue2 = dropdownValueBetween2
                    ? dropdownValueBetween2.values &&
                      dropdownValueBetween2.values[0].value + '/' + betweenValue2Tag
                    : '0';
                  const finalValue = betweenValue1 + ',' + betweenValue2;
                  props.handleOnChange(finalValue);
                  return setDropdownValueBetween1({
                    ...updateValue,
                    isCustomThresholdValue: false
                  });
                } else {
                  if (updateValue && updateValue.id !== null) {
                    const betweenValue1 = updateValue
                      ? updateValue.values && updateValue.values[0].value + '/' + updateValue.tagId
                      : '0';
                    const betweenValue2 = dropdownValueBetween2
                      ? dropdownValueBetween2.values &&
                        dropdownValueBetween2.values[0].value + '/' + betweenValue2Tag
                      : '0';
                    const finalValue = betweenValue1 + ',' + betweenValue2;
                    props.handleOnChange(finalValue);
                    return setDropdownValueBetween1({
                      ...updateValue,
                      isCustomThresholdValue: true
                    });
                  }
                }
              }}
              labelField="id"
              options={
                MasterTagDropdownList && (MasterTagDropdownList as { id: string; label: string }[])
              }
              placeholder={'select_tag'}
              searchable
              searchBy="label" // label is assigned as friendlyName value
              value={{
                label: dropdownValueBetween1 ? dropdownValueBetween1 : null,
                id: dropdownValueBetween1 ? dropdownValueBetween1 : null,
                name: dropdownValueBetween1 ? dropdownValueBetween1 : null
              }}
              valueField="id"
              variant={MasterTagDropdownList.length === 0 ? 'disabled' : 'gray'}
            />
            <section style={{ width: '100%', height: '1rem' }}></section>
            <BaseSelect
              contentRenderer={({ id }: Record<string, unknown>) => (
                <CustomContentRendererValueEditor
                  item={id as unknown as TagsDropdownItems}
                  toolTipText="Threshold is Required"
                  label={
                    MasterTagDropdownList.length === 0 ? 'No Data' : 'choose_a_tag_or_threshold'
                  }
                />
              )}
              dropdownRenderer={(props, state, methods) => (
                <CustomDropdownRendererAlertValueEditor
                  props={props}
                  state={state}
                  methods={methods}
                  thresholdType="number"
                />
              )}
              disabledLabel={'tag_already_assigned'}
              handleChangeSearch={(
                value: (AlertsTableDropdownItem | string | Record<string, unknown> | undefined)[]
              ) => {
                // We need to account for the case when value = undefined ...
                // ... which can happen when the user clears the search field
                const updateValue = value[0] as TDropdownValue;
                // const betweenValue1 = dropdownValueBetween1
                //   ? dropdownValueBetween1.values &&
                //     dropdownValueBetween1.values[0].value + '/' + dropdownValueBetween1.tagId
                //   : '0';
                // const betweenValue2 = updateValue
                //   ? updateValue.values && updateValue.values[0].value + '/' + updateValue.tagId
                //   : '0';
                // const finalValue = betweenValue1 + ',' + betweenValue2;
                // props.handleOnChange(finalValue);
                // return updateValue && setDropdownValueBetween2(updateValue);
                const dropdownValueBetween1Tag =
                  dropdownValueBetween1 && dropdownValueBetween1.tagId === null
                    ? undefined
                    : dropdownValueBetween1 && dropdownValueBetween1.tagId;

                if (updateValue && (updateValue?.tagId as string) && updateValue.id !== null) {
                  const betweenValue1 = dropdownValueBetween1
                    ? dropdownValueBetween1.values &&
                      dropdownValueBetween1.values[0].value + '/' + dropdownValueBetween1Tag
                    : '0';
                  const betweenValue2 = updateValue
                    ? updateValue.values && updateValue.values[0].value + '/' + updateValue.tagId
                    : '0';
                  const finalValue = betweenValue1 + ',' + betweenValue2;
                  props.handleOnChange(finalValue);
                  return setDropdownValueBetween2({
                    ...updateValue,
                    isCustomThresholdValue: false
                  });
                } else {
                  if (updateValue && updateValue.id !== null) {
                    const betweenValue1 = dropdownValueBetween1
                      ? dropdownValueBetween1.values &&
                        dropdownValueBetween1.values[0].value + '/' + dropdownValueBetween1Tag
                      : '0';
                    const betweenValue2 = updateValue
                      ? updateValue.values && updateValue.values[0].value + '/' + updateValue.tagId
                      : '0';
                    const finalValue = betweenValue1 + ',' + betweenValue2;
                    props.handleOnChange(finalValue);
                    return setDropdownValueBetween2({
                      ...updateValue,
                      isCustomThresholdValue: true
                    });
                  }
                }
              }}
              labelField="id"
              options={
                MasterTagDropdownList && (MasterTagDropdownList as { id: string; label: string }[])
              }
              placeholder={'select_tag'}
              searchable
              searchBy="label" // label is assigned as friendlyName value
              value={{
                label: dropdownValueBetween2 ? dropdownValueBetween2 : null,
                id: dropdownValueBetween2 ? dropdownValueBetween2 : null,
                name: dropdownValueBetween2 ? dropdownValueBetween2 : null
              }}
              variant={MasterTagDropdownList.length === 0 ? 'disabled' : 'gray'}
              valueField="id"
            />
          </div>
        </>
      );
    }

    // condition for contains operator
    else if (props.operator === 'CONTAINS') {
      return (
        <>
          <BaseSelect
            contentRenderer={({ id }: Record<string, unknown>) => (
              <CustomContentRendererValueEditor
                item={id as unknown as TagsDropdownItems}
                label={MasterTagDropdownList.length === 0 ? 'No Data' : 'choose_a_tag_or_threshold'}
              />
            )}
            dropdownRenderer={(props, state, methods) => (
              <CustomDropdownRendererAlertValueEditor
                props={props}
                state={state}
                methods={methods}
                thresholdType="text"
              />
            )}
            disabledLabel={'tag_already_assigned'}
            handleChangeSearch={(
              value: (AlertsTableDropdownItem | string | Record<string, unknown> | undefined)[]
            ) => {
              // We need to account for the case when value = undefined ...
              // ... which can happen when the user clears the search field
              const updateValue = value[0] as TDropdownValue;
              if (updateValue && (updateValue?.tagId as string) && updateValue.id !== null) {
                props.handleOnChange(updateValue.values[0].value + '/' + updateValue.tagId);
                return setDropdownValueContains({ ...updateValue, isCustomThresholdValue: false });
              } else {
                if (updateValue && updateValue.id !== null) {
                  props.handleOnChange(updateValue.values[0].value + '/' + updateValue.tagId);
                  return setDropdownValueContains({ ...updateValue, isCustomThresholdValue: true });
                }
              }
            }}
            labelField="id"
            options={
              MasterTagDropdownList && (MasterTagDropdownList as { id: string; label: string }[])
            }
            placeholder={'select_tag'}
            searchable
            searchBy="label" // label is assigned as friendlyName value
            value={{
              label: dropdownValueContains ? dropdownValueContains : null,
              id: dropdownValueContains ? dropdownValueContains : null,
              name: dropdownValueContains ? dropdownValueContains : null
            }}
            variant={MasterTagDropdownList.length === 0 ? 'disabled' : 'gray'}
            valueField="id"
          />
        </>
      );
    }

    return (
      <>
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRendererValueEditor
              item={id as unknown as TagsDropdownItems}
              toolTipText="Threshold is Required"
              label={MasterTagDropdownList.length === 0 ? 'No Data' : 'choose_a_tag_or_threshold'}
            />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRendererAlertValueEditor
              props={props}
              state={state}
              methods={methods}
              thresholdType="number"
            />
          )}
          disabledLabel={'tag_already_assigned'}
          handleChangeSearch={(
            value: (TDropdownValue | string | Record<string, unknown> | undefined)[]
          ) => {
            // We need to account for the case when value = undefined ...
            // ... which can happen when the user clears the search field
            // const updateValue = value[0] as TDropdownValue;
            // props.handleOnChange(updateValue.values[0].value + '/' + updateValue.tagId);
            // return updateValue && setDropdownValue(updateValue);
            const updateValue = value[0] as TDropdownValue;
            if (updateValue && (updateValue?.tagId as string) && updateValue.id !== null) {
              props.handleOnChange(
                updateValue &&
                  updateValue.values &&
                  updateValue.values[0].value + '/' + updateValue.tagId
              );
              return setDropdownValue({ ...updateValue, isCustomThresholdValue: false });
            } else {
              if (updateValue && updateValue.id !== null) {
                props.handleOnChange(
                  updateValue &&
                    updateValue.values &&
                    updateValue.values[0].value + '/' + updateValue.tagId
                );
                return setDropdownValue({ ...updateValue, isCustomThresholdValue: true });
              }
            }
          }}
          labelField="id"
          options={
            MasterTagDropdownList && (MasterTagDropdownList as { id: string; label: string }[])
          }
          placeholder={'select_tag'}
          searchable
          searchBy="label" // label is assigned as friendlyName value
          value={{
            label: dropdownValue ? dropdownValue : null,
            id: dropdownValue ? dropdownValue : null,
            name: dropdownValue ? dropdownValue : null
          }}
          valueField="id"
          variant={MasterTagDropdownList.length === 0 ? 'disabled' : 'gray'}
        />
      </>
    );
  }
};

export default CustomValueEditor;
