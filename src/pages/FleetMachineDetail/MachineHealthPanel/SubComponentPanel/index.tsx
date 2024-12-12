// 3rd Party Libraries
import React, { useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router-dom';

// Components
import {
  Indicator,
  MachineHealthTable,
  Modal,
  Pill,
  Tabs,
  TrendlineGraph,
  Typography
} from 'components';
import { DataRenderer } from 'components/machine-health';

// Types
import { MachineModalData } from 'types';
import {
  MachineHealthItem,
  MachineHealthKpiDetail,
  MachineHealthStatus,
  SubComponentDataState
} from 'types/machine-health';

import { default as theme } from 'themes';

// API
import { useGetMachineHealthByIdQuery } from 'api';

// Constants
import { MachineHealthKpiOptionsText } from 'constants/machineHealthKpis';

interface UngroupedDataKpi {
  [kpi: string]: MachineHealthKpiDetail[];
}

enum Period {
  LAST_HOUR = 'Last Hour',
  LAST_SHIFT = 'Last Shift',
  LAST_DAY = 'Last Day',
  LAST_WEEK = 'Last Week',
  LAST_MONTH = 'Last Month',
  CURRENT_DAY = 'Current Day'
}

/* End interfaces */

const MachineHealthPanelContainer = styled.div`
  padding-bottom: 3.625rem;

  .

`;

const PillsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  > * + * {
    margin-left: 1rem;
  }
`;

const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: 3rem;

  > * + * {
    margin-left: 1rem;
  }
`;

const GraphContainer = styled.div`
  border: ${({ theme }) => `0.0625rem solid ${theme.colors.mediumGrey1}`};
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
`;

const GraphHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  border-radius: 0.625rem 0.625rem 0 0;
  padding: 1.25rem;
  width: 100%;
`;

const KpiIndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GraphTitleContainer = styled.div`
  color: ${({ theme }) => theme.colors.black};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4375rem;
  letter-spacing: 0em;
  text-align: left;
  width: 100%;
`;

const GraphSubtitleContainer = styled.div`
  color: ${({ theme }) => theme.colors.darkGrey2};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0em;
  margin-top: 0.4375rem;
  text-align: left;
  width: 100%;
`;

const GraphKpiValueContainer = styled.div`
  color: ${({ theme }) => theme.colors.atRiskYellow};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4375rem;
  letter-spacing: 0em;
  margin-top: 0.4375rem;
  text-align: left;
  width: 100%;
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const TabsContainer = styled.div`
  margin-bottom: 1rem;
`;

const groupDataKpi = (ungroupedDataKpi: UngroupedDataKpi) => {
  const result: UngroupedDataKpi = {};

  const keys = Object.keys(ungroupedDataKpi);
  keys.forEach((value) => {
    if (value.includes(MachineHealthKpiOptionsText.CheckValve)) {
      if (result[MachineHealthKpiOptionsText.CheckValve]) {
        result[MachineHealthKpiOptionsText.CheckValve].push(ungroupedDataKpi?.[value]?.[0]);
      } else {
        result[MachineHealthKpiOptionsText.CheckValve] = [];
        result[MachineHealthKpiOptionsText.CheckValve].push(ungroupedDataKpi?.[value]?.[0]);
      }
    } else if (value.includes(MachineHealthKpiOptionsText.StrokeRate)) {
      if (result[MachineHealthKpiOptionsText.StrokeRate]) {
        result[MachineHealthKpiOptionsText.StrokeRate].push(ungroupedDataKpi?.[value]?.[0]);
      } else {
        result[MachineHealthKpiOptionsText.StrokeRate] = [];
        result[MachineHealthKpiOptionsText.StrokeRate].push(ungroupedDataKpi?.[value]?.[0]);
      }
    } else if (value.includes(MachineHealthKpiOptionsText.DecompValveTemperature)) {
      if (result[MachineHealthKpiOptionsText.DecompValveTemperature]) {
        result[MachineHealthKpiOptionsText.DecompValveTemperature].push(
          ungroupedDataKpi?.[value]?.[0]
        );
      } else {
        result[MachineHealthKpiOptionsText.DecompValveTemperature] = [];
        result[MachineHealthKpiOptionsText.DecompValveTemperature].push(
          ungroupedDataKpi?.[value]?.[0]
        );
      }
    } else if (value.includes(MachineHealthKpiOptionsText.PressureVessel)) {
      if (result[MachineHealthKpiOptionsText.PressureVessel]) {
        result[MachineHealthKpiOptionsText.PressureVessel].push(ungroupedDataKpi?.[value]?.[0]);
      } else {
        result[MachineHealthKpiOptionsText.PressureVessel] = [];
        result[MachineHealthKpiOptionsText.PressureVessel].push(ungroupedDataKpi?.[value]?.[0]);
      }
    } else if (value.includes(MachineHealthKpiOptionsText.MotorCurrent)) {
      if (result[MachineHealthKpiOptionsText.MotorCurrent]) {
        result[MachineHealthKpiOptionsText.MotorCurrent].push(ungroupedDataKpi?.[value]?.[0]);
      } else {
        result[MachineHealthKpiOptionsText.MotorCurrent] = [];
        result[MachineHealthKpiOptionsText.MotorCurrent].push(ungroupedDataKpi?.[value]?.[0]);
      }
    } else if (value.includes(MachineHealthKpiOptionsText.MotorSpeed)) {
      if (result[MachineHealthKpiOptionsText.MotorSpeed]) {
        result[MachineHealthKpiOptionsText.MotorSpeed].push(ungroupedDataKpi?.[value]?.[0]);
      } else {
        result[MachineHealthKpiOptionsText.MotorSpeed] = [];
        result[MachineHealthKpiOptionsText.MotorSpeed].push(ungroupedDataKpi?.[value]?.[0]);
      }
    }
  });
  return result;
};

export const SubComponentPanel = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<MachineModalData | null>(null);
  const [currentModalPeriod, setModalCurrentPeriod] = useState<Period>(Period.LAST_HOUR);
  const [currentTab, setCurrentTab] = useState<string>('');
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();

  const {
    data: kpiUom,
    isLoading: kpisIsLoading,
    error: kpisError
  } = useGetMachineHealthByIdQuery(machineId ?? {}, {
    pollingInterval: 30000
  });

  const kpis = kpiUom?.machineKpis[0];

  const sData = kpis?.subComponentData || {};

  const machineHealthData:
    | MachineHealthItem[]
    | {
        id: number;
        component: string;
        status: MachineHealthStatus;
        data: UngroupedDataKpi;
        actionNeeded: string;
        state: SubComponentDataState;
      }[] = [];
  for (const key in sData) {
    //Sort data to group certain kpi values
    const groupedData = groupDataKpi(sData[key]?.data);
    machineHealthData.push({
      id: parseInt(key),
      component: sData[key]?.name ?? '',
      status: sData[key]?.status ?? '',
      data: groupedData ?? [],
      actionNeeded: sData[key]?.action ?? '',
      state: sData[key]?.state ?? ''
    });
  }

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const getModalTabs = () => {
    return machineHealthData.map((tabData) => {
      return {
        label: tabData.component,
        panel: tabData.component
      };
    });
  };

  const modalTitle = kpis?.machineDesc || '';

  return (
    <MachineHealthPanelContainer>
      <DataRenderer
        isLoading={kpisIsLoading}
        error={kpisError && (t('failed_to_load_data', { ns: 'common' }) as string)}
      >
        <ScrollContainer className="scroll-container">
          <MachineHealthTable
            data={machineHealthData}
            onItemClick={(id) => {
              console.log('TODO - display details from API', id);
              // TODO - add the modal back in when data is available in the platform
              /*(setModalData(getTestData(id));
                  setCurrentTab(data.filter(datum => datum.id.toString() === id)[0].component);
                  setShowModal(true);*/
            }}
          />
        </ScrollContainer>
        <Modal
          title={t('subcomponent_details', { item: modalTitle }) as string}
          visible={showModal}
          onClose={closeModal}
          overrideStyles
        >
          <TabsContainer>
            <Tabs setTabPanel={setCurrentTab} currentTabPanel={currentTab} items={getModalTabs()} />
          </TabsContainer>
          <PillsContainer>
            <Typography mb={0} size="0.8125rem" weight="bold">
              {t('show_me')}:
            </Typography>
            {(Object.keys(Period) as Array<keyof typeof Period>).map((key) => {
              return (
                <Pill
                  key={key}
                  selected={currentModalPeriod === Period[key]}
                  onClick={() => setModalCurrentPeriod(Period[key])}
                >
                  {Period[key]}
                </Pill>
              );
            })}
          </PillsContainer>
          <ModalContentContainer>
            {modalData?.kpis.map((kpi, key) => {
              return (
                <GraphContainer key={key}>
                  <GraphHeader>
                    <KpiIndicatorContainer>
                      <StyledIndicator color={theme.colors.atRiskYellow} />
                      <GraphTitleContainer>{kpi.name}</GraphTitleContainer>
                    </KpiIndicatorContainer>
                    <GraphSubtitleContainer>
                      {t('kpi_details')} ({kpi.units})
                    </GraphSubtitleContainer>
                    <GraphKpiValueContainer>{kpi.value}</GraphKpiValueContainer>
                  </GraphHeader>
                  <TrendlineGraph kpi={kpi.id} threshold={kpi.threshold} graphData={kpi.data} />
                </GraphContainer>
              );
            })}
          </ModalContentContainer>
        </Modal>
      </DataRenderer>
    </MachineHealthPanelContainer>
  );
};

export default SubComponentPanel;
