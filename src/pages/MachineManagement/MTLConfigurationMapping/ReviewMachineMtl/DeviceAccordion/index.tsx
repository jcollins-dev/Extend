import React, { ReactElement, useState } from 'react';
// 3rd party libs
import { BaseSelect, Input, Typography } from 'components';

import styled, { DefaultTheme, useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faList, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  ReviewMachineMtlData,
  ReviewMachineMtlDsdm,
  ReviewMachineMtlKdm,
  ReviewMachineMtlMqtt,
  UpdateRowValueFunc
} from 'types/machine-management';
import { ChangeEvent, DigitalEdgeType } from 'types';
import { useTranslation } from 'react-i18next';
import { useGetDeviceTypesQuery, useGetDriversQuery } from 'api';
import { skipToken } from '@reduxjs/toolkit/dist/query';

interface DeviceAccordionProps {
  digitalEdgeType: DigitalEdgeType;
  data: ReviewMachineMtlData | ReviewMachineMtlDsdm | ReviewMachineMtlMqtt | undefined;
  onRowUpdate: UpdateRowValueFunc;
  name?: string;
  children?: React.ReactNode;
  triggershowColumnOptions?: () => void;
}

//styling
const Root = styled.div`
  border: 0.0125rem solid ${(props) => props.theme.colors.lightGrey5};
  border-radius: 0.5rem;
  overflow: hidden
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
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

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex: 1;
  align-items: center;
`;
const OptionWrapper = styled.div`
  margin: 0.625rem;
  cursor: pointer;
`;
const IconContainer = styled.div`
  padding: 0;
  cursor: pointer;
`;

const WarningIconContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
`;

const InputWrapper = styled.div`
  width: 70%;
  gap: 1rem;
  padding-left: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(Input).attrs({
  type: 'password'
})``;

const getWarningIconContainer = (theme: DefaultTheme): ReactElement => {
  return (
    <WarningIconContainer>
      <FontAwesomeIcon
        fontSize="0.75rem"
        color={theme.colors.negativeRed}
        icon={faExclamationCircle}
      />
    </WarningIconContainer>
  );
};
const DeviceAccordion = ({
  name,
  digitalEdgeType,
  data,
  onRowUpdate,
  children,
  triggershowColumnOptions
}: DeviceAccordionProps): ReactElement => {
  const [showTable, setShowTable] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  const { data: drivers } = useGetDriversQuery();
  const selectDriverOptions = drivers?.map((option) => {
    return {
      value: option.id as string,
      label: option.name as string
    };
  });
  const { data: deviceType } = useGetDeviceTypesQuery(
    selectedDriver.length > 0
      ? { driverId: selectedDriver }
      : (data as ReviewMachineMtlKdm).driverId
      ? { driverId: (data as ReviewMachineMtlKdm).driverId }
      : skipToken
  );
  const selectDeviceTypeOptions = deviceType?.map((option) => {
    return {
      value: option.id as string,
      label: option.name as string
    };
  });

  const driverChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDriver(e.target.value);
  };

  const toggleShowTable = () => {
    setShowTable(!showTable);
  };

  const getInputFields = (): ReactElement => {
    switch (digitalEdgeType) {
      case DigitalEdgeType.KDM:
        return (
          <>
            <BaseSelect
              options={selectDriverOptions ?? []}
              value={(data as ReviewMachineMtlKdm).driverId}
              placeholder={t('driver_*') as string}
              variant="white"
              handleChange={(e) => {
                driverChangeHandler(e);
                onRowUpdate(
                  (data as ReviewMachineMtlKdm).machineTagListId,
                  'driverId',
                  e.target.value as string
                );
              }}
            />
            <BaseSelect
              options={selectDeviceTypeOptions ?? []}
              value={(data as ReviewMachineMtlKdm).deviceTypeId}
              placeholder={t('device_*') as string}
              variant="white"
              handleChange={(e) => {
                onRowUpdate(
                  (data as ReviewMachineMtlKdm).machineTagListId,
                  'deviceTypeId',
                  e.target.value as string
                );
              }}
            />
            <InputContainer>
              <Input
                type="string"
                id="iPAddress"
                placeholder={t('ip_address_*') as string}
                variant="white"
                value={(data as ReviewMachineMtlKdm).ipAddress}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlKdm).machineTagListId,
                    'ipAddress',
                    e.target.value
                  );
                }}
              />
              {(!(data as ReviewMachineMtlKdm).ipAddress ||
                (data as ReviewMachineMtlKdm)?.ipAddress.length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
            <InputContainer>
              <Input
                type="number"
                id="port"
                variant="white"
                placeholder={t('port_*') as string}
                value={(data as ReviewMachineMtlKdm).port}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlKdm).machineTagListId,
                    'port',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlKdm).port ||
                (data as ReviewMachineMtlKdm)?.port.toString().length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
          </>
        );
        break;
      case DigitalEdgeType.DSDM:
        return (
          <>
            <InputContainer>
              <Input
                type="string"
                id="databaseName"
                variant="white"
                placeholder={t('database_name_*') as string}
                value={(data as ReviewMachineMtlDsdm).databaseName}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlDsdm).machineTagListId,
                    'databaseName',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlDsdm).databaseName ||
                (data as ReviewMachineMtlDsdm)?.databaseName.length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
            <InputContainer>
              <Input
                type="string"
                id="databaseUsername"
                variant="white"
                placeholder={t('username_*') as string}
                value={(data as ReviewMachineMtlDsdm).databaseUsername}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlDsdm).machineTagListId,
                    'databaseUsername',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlDsdm).databaseUsername ||
                (data as ReviewMachineMtlDsdm)?.databaseUsername.length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
            <InputContainer>
              <PasswordInput
                type="string"
                id="databasePassword"
                variant="white"
                placeholder={t('password_*') as string}
                value={(data as ReviewMachineMtlDsdm).databasePassword}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlDsdm).machineTagListId,
                    'databasePassword',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlDsdm).databasePassword ||
                (data as ReviewMachineMtlDsdm)?.databasePassword.length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
            <InputContainer>
              <Input
                type="string"
                id="databaseIp"
                variant="white"
                placeholder={t('ip_address_*') as string}
                value={(data as ReviewMachineMtlDsdm).databaseIp}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlDsdm).machineTagListId,
                    'databaseIp',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlDsdm).databaseIp ||
                (data as ReviewMachineMtlDsdm)?.databaseIp.length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
            <InputContainer>
              <Input
                type="number"
                id="databasePort"
                variant="white"
                placeholder={t('port_*') as string}
                value={(data as ReviewMachineMtlDsdm).databasePort}
                onChange={(e: ChangeEvent) => {
                  onRowUpdate(
                    (data as ReviewMachineMtlDsdm).machineTagListId,
                    'databasePort',
                    e.target.value as string
                  );
                }}
              />
              {(!(data as ReviewMachineMtlDsdm).databasePort ||
                (data as ReviewMachineMtlDsdm)?.databasePort.toString().length === 0) &&
                getWarningIconContainer(theme)}
            </InputContainer>
          </>
        );
        break;
      case DigitalEdgeType.MQTT:
        return <></>;
        break;
      default:
        return <></>;
        break;
    }
  };

  return (
    <Root>
      <Header>
        <NameWrapper>
          <IconContainer>
            {showTable ? (
              <FontAwesomeIcon icon={faPlus} onClick={toggleShowTable} />
            ) : (
              <FontAwesomeIcon icon={faMinus} onClick={toggleShowTable} />
            )}
          </IconContainer>
          <Typography color={theme.colors.darkGrey} variant="h3">
            {name}
          </Typography>
        </NameWrapper>
        <OptionWrapper
          onClick={() => {
            /* eslint-disable  @typescript-eslint/no-non-null-assertion */
            triggershowColumnOptions!();
          }}
        >
          <Typography variant="h4" mb={0}>
            <FontAwesomeIcon icon={faList} /> Column options
          </Typography>
        </OptionWrapper>
        <InputWrapper>{getInputFields()}</InputWrapper>
      </Header>
      <div hidden={showTable}>{children}</div>
    </Root>
  );
};

export default DeviceAccordion;
