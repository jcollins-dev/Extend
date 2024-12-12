import React, { useEffect, useRef, useState } from 'react';
// 3rd party libs
import { BaseSelect, Button, Typography, WarningPrompt } from 'components';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, DigitalEdgeType } from 'types';
import { useDeleteMachineTagListMutation, useGetDeviceTypesQuery, useGetDriversQuery } from 'api';
import Loader from '../../../components/Loader';
import ImportMachineTagListModal from './ImportMachineTagListModal';
import { MachineTagListAttributeDSDM, MachineTagListAttributeKDM } from 'types/machine-management';
import { toast } from 'react-toastify';

interface DeviceAccordionProps {
  machineTagListId?: string;
  name: string;
  digitalEdgeType: string;
  machineId: string;
  isReview: boolean;
  isDraft: boolean;
  data?: MachineTagListAttributeKDM | MachineTagListAttributeDSDM;
  handleSuccessfulImport: () => void;
  handleSuccessfulDelete: (deviceName: string, isDraft: boolean) => void;
}

//styling
const Root = styled.div`
    border: 0.0125rem solid ${(props) => props.theme.colors.lightGrey5};
    border-radius: 0.5rem;
    overflow: hidden
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2rem 1rem;
  gap: 1rem;
  background-color: ${(props) => props.theme.colors.lightGrey3};

  height: 3rem;
  width: 100%;
`;
const IconContainer = styled.div`
  padding: 0;
  cursor: pointer;
`;

const ImportedIconContainer = styled.div`
  padding: 0;
`;

const InputWrapper = styled.div`
  width: 80%;
  gap: 1rem;
  margin-left: auto;
  padding-left: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey4};
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;

const PasswordInput = styled(Input).attrs({
  type: 'password'
})``;

const ButtonContainer = styled.div`
  width: 10rem;
  gap: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DeviceAccordion = ({
  machineTagListId,
  name,
  digitalEdgeType,
  machineId,
  isReview,
  isDraft,
  data,
  handleSuccessfulImport,
  handleSuccessfulDelete
}: DeviceAccordionProps): JSX.Element => {
  const { data: drivers, isLoading: isDriversLoading } = useGetDriversQuery();
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const theme = useTheme();
  const toastId = useRef<React.ReactText>('');

  const [driverId, setDriverId] = useState<string>('');
  const [deviceTypeId, setDeviceTypeId] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [port, setPort] = useState<number>();
  const [databaseName, setDatabaseName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [deleteMachineTagList] = useDeleteMachineTagListMutation();
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (confirmDelete) {
      toastId.current = toast.loading(`Machine tag list deletion is in progress...`);
      deleteMachineTagList({
        machineTagListId: machineTagListId || '',
        digitalEdgeType: toDigitalEdgeType(digitalEdgeType)
      })
        .unwrap()
        .then(() => {
          toast.update(toastId.current, {
            render: `Machine tag list deleted successfully.`,
            type: 'success',
            isLoading: false,
            closeButton: true,
            autoClose: 5000
          });
          handleSuccessfulDelete(name, isDraft);
        })
        .catch((error) => {
          console.warn('Machine tag list deletion error: ', error);
          toast.update(toastId.current, {
            render: `There was a problem while deleting the machine tag list, ${
              error?.data?.detail ? `: ${error.data.detail}` : ''
            }`,
            type: 'error',
            isLoading: false,
            closeButton: true,
            autoClose: 5000
          });
        });
      setShowWarningPrompt(false);
      setConfirmDelete(false);
    }
  }, [confirmDelete]);

  const handleDelete = () => {
    if (isDraft) {
      handleSuccessfulDelete(name, isDraft);
    } else {
      setShowWarningPrompt(true);
    }
  };

  useEffect(() => {
    if (data) {
      switch (digitalEdgeType) {
        case 'KDM':
          setDriverId((data as MachineTagListAttributeKDM).driverId);
          setDeviceTypeId((data as MachineTagListAttributeKDM).deviceTypeId);
          setIpAddress((data as MachineTagListAttributeKDM).ipAddress);
          setPort((data as MachineTagListAttributeKDM).port);
          break;
        case 'DSDM':
          setDatabaseName((data as MachineTagListAttributeDSDM).databaseName);
          setUsername((data as MachineTagListAttributeDSDM).databaseUsername);
          setPassword((data as MachineTagListAttributeDSDM).databasePassword);
          setIpAddress((data as MachineTagListAttributeDSDM).databaseIp);
          setPort((data as MachineTagListAttributeDSDM).databasePort);
          break;
      }
    }
  }, [data]);

  const { data: deviceTypes, isLoading: isDeviceTypesLoading } = useGetDeviceTypesQuery(
    { driverId: driverId },
    { skip: !driverId }
  );
  const toggleShowTable = () => {
    setShowTable(!showTable);
  };

  const toDigitalEdgeType = (digitalEdgeType: string) => {
    switch (digitalEdgeType) {
      case 'KDM':
        return DigitalEdgeType.KDM;
      case 'DSDM':
        return DigitalEdgeType.DSDM;
      case 'MQTT':
        return DigitalEdgeType.MQTT;
      default:
        return DigitalEdgeType.KDM;
    }
  };
  const setDefaultPort = (driverId: string): void => {
    const driver = drivers?.find((d) => d.id === driverId);
    if (driver) {
      setPort(driver.port);
    }
  };
  return (
    <Root>
      <Header>
        <IconContainer hidden={!isReview}>
          {showTable ? (
            <FontAwesomeIcon icon={faPlus} onClick={toggleShowTable} />
          ) : (
            <FontAwesomeIcon icon={faMinus} onClick={toggleShowTable} />
          )}
        </IconContainer>
        <ImportedIconContainer hidden={isDraft}>
          <FontAwesomeIcon icon={faDownload} />
        </ImportedIconContainer>
        <Typography color={theme.colors.darkGrey} variant="h3">
          {name}
        </Typography>
        <InputWrapper>
          {digitalEdgeType == DigitalEdgeType.KDM && (
            <>
              {isDriversLoading ? (
                <Loader size={30} margin={0} />
              ) : (
                <BaseSelect
                  options={
                    drivers
                      ? drivers.map((driver) => ({
                          label: driver.name as string,
                          value: driver.id
                        }))
                      : []
                  }
                  value={driverId}
                  placeholder={'Driver*'}
                  variant={data ? 'disabled' : 'white'}
                  handleChange={(e) => {
                    setDriverId(e.target.value);
                    setDefaultPort(e.target.value);
                  }}
                />
              )}
              {isDeviceTypesLoading ? (
                <Loader size={30} margin={0} />
              ) : (
                <BaseSelect
                  options={
                    deviceTypes
                      ? deviceTypes.map((dt) => ({
                          label: dt.name as string,
                          value: dt.id
                        }))
                      : []
                  }
                  value={deviceTypeId}
                  placeholder={'Device*'}
                  variant={data ? 'disabled' : 'white'}
                  handleChange={(e) => {
                    setDeviceTypeId(e.target.value);
                  }}
                />
              )}
              <Input
                disabled={data ? true : false}
                placeholder="IP Address*"
                type="string"
                id="IPAddress"
                value={ipAddress}
                onChange={(event: ChangeEvent) => {
                  setIpAddress(event.target.value);
                }}
              />
              <Input
                disabled={data ? true : false}
                placeholder="Port*"
                type="number"
                id="completionCycleCount"
                value={port}
                onChange={(event: ChangeEvent) => {
                  setPort(parseInt(event.target.value));
                }}
              />
            </>
          )}
          {digitalEdgeType == DigitalEdgeType.DSDM && (
            <>
              <Input
                disabled={data ? true : false}
                placeholder="Database Name*"
                type="string"
                id="DatabaseName"
                value={databaseName}
                onChange={(event: ChangeEvent) => {
                  setDatabaseName(event.target.value);
                }}
              />
              <Input
                disabled={data ? true : false}
                placeholder="IP Address*"
                type="string"
                id="IPAddress"
                value={ipAddress}
                onChange={(event: ChangeEvent) => {
                  setIpAddress(event.target.value);
                }}
              />
              <Input
                disabled={data ? true : false}
                placeholder="Username*"
                type="string"
                id="Username"
                value={username}
                onChange={(event: ChangeEvent) => {
                  setUsername(event.target.value);
                }}
              />
              <PasswordInput
                disabled={data ? true : false}
                placeholder="Password*"
                id="Password"
                value={password}
                onChange={(event: ChangeEvent) => {
                  setPassword(event.target.value);
                }}
              />
              <Input
                disabled={data ? true : false}
                placeholder="Port*"
                type="number"
                id="completionCycleCount"
                value={port}
                onChange={(event: ChangeEvent) => {
                  setPort(parseInt(event.target.value));
                }}
              />
            </>
          )}
          <ButtonContainer>
            <Button
              hidden={isReview}
              disabled={
                !(
                  digitalEdgeType === 'KDM' &&
                  driverId &&
                  deviceTypeId &&
                  ipAddress &&
                  typeof port != 'undefined'
                ) &&
                !(
                  digitalEdgeType === 'DSDM' &&
                  databaseName &&
                  ipAddress &&
                  username &&
                  password &&
                  typeof port != 'undefined'
                ) &&
                !(digitalEdgeType === 'MQTT')
              }
              onClick={() => setShowUploadModal(true)}
            >
              Import
            </Button>
            <IconContainer onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashCan} color={theme.colors.negativeRed} />
            </IconContainer>
          </ButtonContainer>
        </InputWrapper>
      </Header>
      <div hidden={showTable}>{/* Here should be the table */}</div>
      <ImportMachineTagListModal
        visible={showUploadModal}
        edgeType={toDigitalEdgeType(digitalEdgeType)}
        machineId={machineId}
        data={(() => {
          switch (digitalEdgeType) {
            case 'KDM':
              return {
                driverId,
                deviceTypeId,
                ipAddress,
                port
              } as MachineTagListAttributeKDM;
            case 'DSDM':
              return {
                databaseName: databaseName,
                databaseUsername: username,
                databasePassword: password,
                databaseIp: ipAddress,
                databasePort: port
              } as MachineTagListAttributeDSDM;
            default:
              return;
          }
        })()}
        handleSuccessfulImport={handleSuccessfulImport}
        handleClose={() => setShowUploadModal(false)}
      />
      <WarningPrompt
        helperText={`Are you sure you want to delete this device ?`}
        isConfirmPrompt
        isVisible={showWarningPrompt}
        onCancelCallback={() => setShowWarningPrompt(false)}
        onConfirmCallback={() => setConfirmDelete(true)}
        title="Confirm Deletion"
      />
    </Root>
  );
};

export default DeviceAccordion;
