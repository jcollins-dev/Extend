import React, { useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Loader, NewBaseTable, WarningPrompt } from 'components';
import { IcoTrash } from 'icons/IcoTrash';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { BaseType } from 'types';
import styled, { useTheme } from 'styled-components';
import { capitalizeFirst } from 'helpers';
import { useDeleteAlertMutation, useGetAlertsQuery } from 'api';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Dropdown } from './Dropdown';
import { skipToken } from '@reduxjs/toolkit/dist/query';

interface ITrigger extends BaseType {
  type?: string;
  value?: number;
  units?: string;
}

interface TableColumnConfigs extends BaseType {
  id?: string;
  machineId?: string;
  name?: string;
  state?: boolean;
  priority?: string;
  message?: string;
  description?: string;
  frequencyValue?: number;
  frequencyUnits?: string;
  slidingWindowValue?: number;
  slidingWindowUnits?: string;
  trigger?: ITrigger;
}

const AlertHeaderWrapper = styled.div`
  border-bottom: 1px solid #ccc;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 10px 10px 10px 10px;
  height: 4rem;
`;

const AlertsTable = (): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();
  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const [isViewConfirmDelete, setIsViewConfirmDelete] = useState(false);
  const [selectedDeleteId, isSelectedDeleteId] = useState<string | undefined>(undefined);
  const [deleteAlert] = useDeleteAlertMutation();

  const {
    data: TableData,
    isFetching: isAlertsFetching,
    isError
  } = useGetAlertsQuery(
    machineId
      ? {
          machineId: machineId
        }
      : skipToken
  );

  const onHandleDelete = async () => {
    if (typeof selectedDeleteId === 'undefined') {
      return toast.warn(t('alert_not_found'));
    }
    try {
      await deleteAlert({ alertId: selectedDeleteId }).unwrap();
      toast.success(t('success_alert_delete'));
      setIsViewConfirmDelete(false);
    } catch (error) {
      toast.error(t('error_alert_deleted'));
      console.log(error);
      setIsViewConfirmDelete(false);
    }
  };

  // const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const columns = [
    // {
    //   id: 'id',
    //   header: '',
    //   isEnableSorting: false,
    //   isSelected: true,
    //   renderer: (cellValue: CellContext<TableColumnConfigs, string>) => (
    //     <Checkbox
    //       width={20}
    //       height={20}
    //       id={cellValue.getValue()}
    //       disabled
    //       checked={selectedAlerts.includes(cellValue.getValue())}
    //       onChange={() => {
    //         if (selectedAlerts.includes(cellValue.getValue())) {
    //           setSelectedAlerts((prev) => {
    //             const filteredValue = prev.filter((value) => value !== cellValue.getValue());
    //             return filteredValue;
    //           });
    //         } else {
    //           setSelectedAlerts([...selectedAlerts, cellValue.getValue()]);
    //         }
    //       }}
    //     />
    //   )
    // },
    {
      id: 'state',
      header: t('state'),
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {/* <Switch
              checked={cellValue.getValue() === 'ENABLED'}
              onChange={(e) => console.log(e)}
              offColor={theme.colors.mediumGrey2}
            /> */}
            <strong>{cellValue.getValue()}</strong>
          </div>
        );
      }
    },
    {
      id: 'name',
      header: t('alert_name2'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => (
        <NavLink
          to={`${cellValue.row.original.id}/update-alert`}
          style={{ color: theme.colors.primaryBlue5, textDecoration: 'none' }}
        >
          {capitalizeFirst(cellValue.getValue().toLocaleLowerCase())}
        </NavLink>
      )
    },
    {
      id: 'priority',
      header: t('priority'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        capitalizeFirst(cellValue.getValue().toLocaleLowerCase())
    },
    {
      id: 'frequencyValue',
      header: t('alert_frequency'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const units = capitalizeFirst(
          cellValue.row.original.frequencyUnits?.toLocaleLowerCase() as string
        );
        return cellValue.row.original.frequencyUnits && `${cellValue.getValue()} ${units}`;
      }
    },
    {
      id: 'slidingWindowValue',
      header: t('alert_sliding_window'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        const units = capitalizeFirst(
          cellValue.row.original.slidingWindowUnits?.toLocaleLowerCase() as string
        );
        const value = cellValue.getValue() + ' ' + units;
        return value;
      }
    },
    {
      id: 'trigger',
      header: 'trigger',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        if (cellValue.row.original.trigger?.type === 'MATCHES') {
          const value = cellValue.row.original.trigger?.value as number;
          const type = capitalizeFirst(cellValue.row.original.trigger?.type.toLocaleLowerCase());

          return value + ' ' + type;
        } else if (cellValue.row.original.trigger?.type === 'DURATION') {
          const value = cellValue.row.original.trigger?.value as number;
          const type = capitalizeFirst(cellValue.row.original.trigger?.type.toLocaleLowerCase());
          const units = capitalizeFirst(
            cellValue.row.original.trigger?.units?.toLocaleLowerCase() as string
          );
          return value + ' ' + units + ' ' + type;
        } else {
          return '';
        }
      }
    },
    {
      id: 'action',
      header: 'action',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        return (
          <div
            onClick={() => {
              setIsViewConfirmDelete(true);
              isSelectedDeleteId(cellValue.row.original.id);
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <IcoTrash width="30" />
          </div>
        );
      }
    }
  ];

  const defaultSortState = {
    id: 'id',
    desc: true
  };

  if (isAlertsFetching) {
    return <Loader />;
  }

  return (
    <>
      <div
        style={{
          margin: '.5rem'
        }}
      >
        <AlertHeaderWrapper>
          <Dropdown />
        </AlertHeaderWrapper>
        <div>
          {TableData && !isError && (
            <NewBaseTable
              newTableData={TableData}
              columnConfigs={columns}
              sortState={defaultSortState}
              isShowColumnOptions
              isShowGlobalSearch
            />
          )}
        </div>
        <WarningPrompt
          helperText={t('alert_delete_confirm_message')}
          isConfirmPrompt
          isVisible={isViewConfirmDelete}
          onCancelCallback={() => setIsViewConfirmDelete(false)}
          onConfirmCallback={() => onHandleDelete()}
          title={t('delete_alert_confirm_title')}
        />
      </div>
    </>
  );
};

export default AlertsTable;
