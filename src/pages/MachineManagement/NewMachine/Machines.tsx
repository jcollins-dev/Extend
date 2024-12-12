import React, { useEffect, useMemo, useState } from 'react';
import Typography from 'components/Typography/Typography';
import theme from 'themes';
import { BaseSelect, Loader, Modal, RadioButton } from 'components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  useGetAssetSalesforceQuery,
  useGetBusinessUnitsQuery,
  useGetIsMachineOnboardedQuery,
  useGetMachineTypesQuery,
  useGetPlantsQuery,
  useGetTimeZonesQuery
} from 'api';
import { AssetSalesforce, MachineType } from 'types/machine-management';
import { BusinessUnit, DigitalEdgeType, ModalSize } from 'types';
import { useHistory } from 'react-router-dom';
import { JBTRoutes } from 'constants/routes';
import {
  Btn1,
  Btn2,
  Container,
  Machine,
  PopupModalContainer,
  RadioButtonContainer,
  SelectContainer
} from './Machine.elements';
import { useTranslation } from 'react-i18next';

const Machines = ({
  accountId,
  selectedMachine,
  setSelectedMachine,
  setSelectedMachineType,
  selectedMachineType,
  setSelectedTimeZone,
  selectedTimeZone,
  setSelectedBU,
  selectedBU,
  selectedDigitalEdgeType,
  setSelectedBUId,
  setSelectedMachineTypeCode,
  setSelectedMachineAddress,
  setSelectedDigitalEdgeType
}: {
  accountId: string | undefined;
  selectedMachine: string | undefined;
  setSelectedMachine: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedMachineType: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedMachineType: string | undefined;
  setSelectedTimeZone: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedTimeZone: string | undefined;
  setSelectedBU: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedBU: string | undefined;
  selectedDigitalEdgeType: string | undefined;
  setSelectedMachineAddress: React.Dispatch<React.SetStateAction<AssetSalesforce | undefined>>;
  setSelectedBUId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSelectedMachineTypeCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedDigitalEdgeType: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation(['common']);
  const { data: machinesData, isFetching } = useGetAssetSalesforceQuery(
    accountId === ''
      ? skipToken
      : {
          accountId: accountId
        }
  );

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const { data: machineTypesData } = useGetMachineTypesQuery();
  const { data: timeZonesData } = useGetTimeZonesQuery();
  const { data: businessUnits } = useGetBusinessUnitsQuery();
  const { data: isOnBoarded } = useGetIsMachineOnboardedQuery(
    selectedMachineId.length > 0 ? { id: selectedMachineId } : skipToken
  );
  const { data: machineData } = useGetPlantsQuery();

  useEffect(() => {
    if (selectedMachineId.length > 0) {
      isOnBoarded && isOnBoarded.machineOnboard && setPopupOpen(true);
    }
  }, [isOnBoarded, selectedMachineId]);

  const machineTypesList: MachineType[] = useMemo(() => {
    if (!machineTypesData) {
      return [];
    }
    return machineTypesData;
  }, [machineTypesData]);

  const timeZonesList: string[] = useMemo(() => {
    if (!timeZonesData) {
      return [];
    }
    return timeZonesData;
  }, [timeZonesData]);

  const businessUnitsList: BusinessUnit[] = useMemo(() => {
    if (!businessUnits) {
      return [];
    }
    return businessUnits;
  }, [businessUnits]);

  const handleClick = (machine: AssetSalesforce) => {
    if (machine.serialNumber !== selectedMachine) {
      setSelectedMachine(machine.serialNumber);
      setSelectedMachineId(machine.id);
    } else {
      setSelectedMachine(undefined);
    }
  };

  const closeBtn = () => {
    setPopupOpen(!popupOpen);
    setSelectedMachine(undefined);
    setSelectedMachineId('');
  };

  const cancel = () => {
    setPopupOpen(!popupOpen);
    setSelectedMachine(undefined);
    setSelectedMachineId('');
    history.push(JBTRoutes.machineManagementNew);
  };

  const goToParts = () => {
    history.push(JBTRoutes.partsCatalog);
  };

  const goToOnboards = () => {
    const machinesList = machineData?.find((item) => {
      if (item.machines) {
        const machineData = item.machines.find(
          (item) => item.salesforceMachineId === selectedMachineId
        );
        return machineData;
      }
    });
    const plant = machinesList?.machines.find(
      (item) => item.salesforceMachineId === selectedMachineId
    );
    if (plant) {
      history.push(JBTRoutes.onboardingPage.replace(':machineId', plant?.id));
    }
  };

  return (
    <Container>
      {isFetching ? (
        <Loader margin="auto" />
      ) : (
        machinesData &&
        machinesData.map((machine) => {
          return (
            <Machine key={machine.id}>
              <div>
                <Typography
                  onClick={() => {
                    handleClick(machine);
                  }}
                  variant="h4"
                >
                  Machine Name: {machine.name}
                </Typography>
                {selectedMachine === machine.serialNumber && (
                  <div>
                    <Typography variant="body1">Serial Number: {machine.serialNumber}</Typography>
                    <Typography variant="body2">Description: {machine.description}</Typography>
                    <SelectContainer>
                      <div>
                        {machineTypesList && (
                          <BaseSelect
                            options={
                              machineTypesList
                                ? machineTypesList.map((type) => type.name as string)
                                : ['']
                            }
                            value={selectedMachineType ? selectedMachineType : ''}
                            placeholder={'Machine Type'}
                            variant="white"
                            handleChange={(e) => {
                              const machineTypeId = machineTypesList.find(
                                (type) => type.name == e.target.value
                              );
                              setSelectedMachineType(e.target.value);
                              setSelectedMachineTypeCode(machineTypeId?.code);
                              setSelectedMachineAddress(machine);
                            }}
                          />
                        )}
                      </div>
                      <div>
                        {timeZonesList && (
                          <BaseSelect
                            options={timeZonesList}
                            value={selectedTimeZone ? selectedTimeZone : ''}
                            placeholder={'Timezone'}
                            variant="white"
                            handleChange={(e) => {
                              setSelectedTimeZone(e.target.value);
                            }}
                          />
                        )}
                      </div>
                      <div>
                        {businessUnitsList && (
                          <BaseSelect
                            options={
                              businessUnitsList
                                ? businessUnitsList.map((bu) => bu.displayName || bu.name)
                                : ['']
                            }
                            value={selectedBU ? selectedBU : ''}
                            placeholder={'BU'}
                            variant="white"
                            handleChange={(e) => {
                              const businessUnitId = businessUnitsList.find(
                                (bu) => bu.displayName == e.target.value
                              );
                              setSelectedBU(e.target.value);
                              setSelectedBUId(businessUnitId?.id);
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <BaseSelect
                          value={
                            selectedDigitalEdgeType ? selectedDigitalEdgeType : DigitalEdgeType
                          }
                          variant="white"
                          options={[
                            {
                              label: 'PLC',
                              value: DigitalEdgeType.KDM
                            },
                            {
                              label: 'SQL',
                              value: DigitalEdgeType.DSDM
                            },
                            {
                              label: DigitalEdgeType.MQTT,
                              value: DigitalEdgeType.MQTT
                            }
                          ]}
                          handleChange={(event) => {
                            setSelectedDigitalEdgeType(event.target.value);
                          }}
                          placeholder={'Digital Edge Type'}
                        />
                      </div>
                    </SelectContainer>
                    <Typography variant="body1">
                      Address: {machine.accountStreet}, {machine.accountCity},{' '}
                      {machine.accountCountry}, {machine.accountPostalCode}
                    </Typography>
                    <Typography color={theme.colors.mediumGrey3} variant="body2">
                      This address is from Salesforce. Please contact your Salesforce admin if
                      incorrect or missing.
                    </Typography>
                  </div>
                )}
              </div>
              <RadioButtonContainer>
                <RadioButton
                  checked={selectedMachine === machine.serialNumber}
                  onChange={() => {
                    handleClick(machine);
                  }}
                />
              </RadioButtonContainer>
              <Modal visible={popupOpen} onClose={closeBtn} size={ModalSize.SMALL_AUTO_HEIGHT}>
                <PopupModalContainer>
                  {isOnBoarded ? (
                    <>
                      <h2>{t('machine_is_already_exist')}</h2>
                      <p>{t('machine_is_already_exist_message')}</p>
                      <div>
                        <Btn1 onClick={cancel}>{t('cancel')}</Btn1>
                        <Btn2 onClick={goToOnboards}>{t('redirect')}</Btn2>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>{t('machine_is_already')}</h2>
                      <p>{t('machine_is_already_message')}</p>
                      <div>
                        <Btn1 onClick={cancel}>{t('cancel')}</Btn1>
                        <Btn2 onClick={goToParts}>{t('go_to_parts')}</Btn2>
                      </div>
                    </>
                  )}
                </PopupModalContainer>
              </Modal>
            </Machine>
          );
        })
      )}
    </Container>
  );
};

export default Machines;
