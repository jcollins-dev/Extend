// 3rd party libs
import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
// Components
import {
  ChangeOverStateChartWidget,
  ChangeOverWidget
} from 'components/machine-health/linear-filler';
import {
  Button,
  CleaningStepsTable,
  Column,
  Flyout,
  KPICard,
  Loader,
  Row,
  Typography,
  Pill,
  ChangeOverStepDurationsBarChart
} from 'components';
import SessionSelector, { DateRange } from 'components/machine-health/SessionSelector';
import {
  CleaningSession,
  CleaningStepStatus,
  CleaningStepWithKPI,
  ProteinMachineRouteQueryParams
} from 'types/protein';
import { formatSessionName } from 'helpers/machine-health';
import { AlarmDetail, MachineActiveIssues } from 'components/machine-health';
import { MachineType } from 'types/machine-health';
import { ActualChangeOverDetail, AsepticChangeoverType } from 'types/machine-health/aseptic';
import { Alarm } from 'types/machine-health/alarms';
import moment from 'moment';
import {
  Route,
  Switch,
  Redirect,
  useParams,
  useLocation,
  useRouteMatch,
  useHistory
} from 'react-router-dom';
import { useGetAsepticMachineHealthChangeoverToCleaningSession } from 'hooks/useGetAsepticMachineHealthChangeover';
import {
  useGetTopAsepticMachineHealthChangeoverByIdQuery,
  useGetAsepticMachineHealthChangeoverDetailsQuery
} from 'api';

import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Alert } from 'types/machine-health/alerts';
import { AddHHMMSS, formatDuration } from 'helpers';

import _, { isEqual } from 'lodash';
import WaitTimeWidget from 'components/machine-health/linear-filler/WaitTimeWidget';

// Helpers
import { processData } from './helpers';

// Theme
import theme from 'themes';

// Hooks
import { useColorMap } from 'hooks';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 0.125rem 3.125rem 0 3.125rem;
  margin-top: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  > * {
    width: auto;
  }
`;
const IssuesContainer = styled.div`
  height: 20.68rem;
  display: flex;
`;

const StyledLabel = styled.div`
  label {
    white-space: nowrap;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  > * + * {
    margin-left: 1rem;
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

interface Props {
  selectedChangeover: AsepticChangeoverType;
  isLoading?: boolean;
  error?: unknown;
}

export const SUB_ROUTES = {
  singleSession: 'single-session',
  stepsOverTime: 'steps-over-time'
};

const ChangeOver = ({ selectedChangeover, isLoading }: Props): ReactElement => {
  const [sessionSelectorVisible, setSessionSelectorVisible] = useState(false);
  const [shouldOverflow, setShouldOverflow] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [allStepsIds, setAllStepsIds] = useState<string[]>([]);
  const [stepsHistory, setStepsHistory] = useState<string[][]>([allStepsIds]);
  const [stepsIndex, setStepsIndex] = useState<number>(0);

  const { t } = useTranslation(['mh']);
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const closeSessionSelector = () => {
    setSessionSelectorVisible(false);
    setShouldOverflow(false);
  };

  const [selectedSession, setSelectedSession] = useState<CleaningSession>();

  /**
   * Set the selected session to the selected changeover once it is available
   */
  useEffect(() => {
    // Exit early if there already is a selected session (e.g. if the user has already selected a session using
    // the session selection UI, before the latest session data has loaded)
    if (selectedSession) {
      return;
    }

    if (selectedChangeover) {
      if (selectedChangeover?.startTime) {
        const session: CleaningSession = {
          id: selectedChangeover?.id,
          startTimestamp:
            selectedChangeover?.startDate + 'T' + selectedChangeover?.startTime + '+00:00',
          endTimestamp: selectedChangeover?.endDate
            ? selectedChangeover?.endDate + 'T' + selectedChangeover?.endTime + '+00:00'
            : undefined,
          alarms: 0
        };
        setSelectedSession(session);
      }
    }
  }, [selectedChangeover, selectedSession]);

  const [selectedAlarms, setSelectedAlarms] = useState<Alarm[]>();
  const [selectedAlerts, setSelectedAlerts] = useState<Alert[]>();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: moment().subtract(60, 'days').toDate(),
    to: moment().toDate()
  });
  const [averageDuration, setAverageDuration] = useState(10);
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const {
    data: changeoverSessionsData,
    isFetching: isSessionsFetching,
    error: sessionsError
  } = useGetAsepticMachineHealthChangeoverToCleaningSession(
    machineId,
    moment(dateRange.from).format('YYYY-MM-DD'),
    moment(dateRange.to).format('YYYY-MM-DD'),
    20
  );

  const {
    data: selectedChangeoverFullDetails,
    isFetching: isSelectedChangeoverFullDetailsFetching,
    error: selectedChangeoverFullDetailsError
  } = useGetTopAsepticMachineHealthChangeoverByIdQuery(
    selectedSession?.id !== undefined
      ? {
          machineId,
          changeoverId: selectedSession?.id as string
        }
      : skipToken,
    {
      skip: !machineId,
      pollingInterval: !selectedSession?.endTimestamp ? 30000 : undefined
    }
  );

  const { data: stepsData, isFetching: isChangeoverDetailsFetching } =
    useGetAsepticMachineHealthChangeoverDetailsQuery({
      machineId,
      end_datetime: moment(dateRange.to).format('YYYY-MM-DD HH:mm:ss'),
      start_datetime: moment(dateRange.from).format('YYYY-MM-DD HH:mm:ss')
    });

  const mergeAllAlarmsData = (subSteps: ActualChangeOverDetail[]) => {
    const allAlarms: Alarm[] = [];
    subSteps?.forEach((value) => {
      allAlarms.push(...value.alarms);
    });
    return allAlarms;
  };

  const getAllAlarmsData = (selectedChangeoverFullDetails: AsepticChangeoverType) => {
    const allAlarms: Alarm[] = [];
    selectedChangeoverFullDetails?.actualDetails?.forEach((value) => {
      allAlarms.push(...value.alarms);
    });
    return allAlarms;
  };

  // Return formatted duration string from a step
  const getStepDuration = (subSteps: ActualChangeOverDetail[]) => {
    if (subSteps) {
      let sumDuration = 0;
      subSteps.forEach((subStep) => {
        sumDuration += new Date(subStep.endTime).getTime() - new Date(subStep.startTime).getTime();
      });
      return formatDuration(sumDuration, 'hours:mins:secs');
    }
  };

  const getSumTargetDuration = (
    subSteps: ActualChangeOverDetail[],
    targetDetails: ActualChangeOverDetail[] | undefined
  ) => {
    let sumTargetDuration = '00:00:00';
    // Only include unique subSteps
    const filteredSubSteps = subSteps.filter((subStep, index, self) => {
      return self.findIndex((value) => value.recipeDescr === subStep.recipeDescr) === index;
    });

    filteredSubSteps.forEach((subStep) => {
      sumTargetDuration = AddHHMMSS(
        sumTargetDuration,
        getSubStepSumTargetDuration(subStep, targetDetails)
      );
    });
    return sumTargetDuration;
  };

  const getSumAvgDuration = (subSteps: ActualChangeOverDetail[]) => {
    let sumAvgDuration = 0;
    // Only include unique subSteps
    const filteredSubSteps = subSteps.filter((subStep, index, self) => {
      return self.findIndex((value) => value.recipeDescr === subStep.recipeDescr) === index;
    });

    filteredSubSteps.forEach((subStep) => {
      sumAvgDuration = sumAvgDuration + parseFloat(subStep?.avgDuration);
    });

    const hours = Math.floor(sumAvgDuration / 60);
    const minutes = sumAvgDuration % 60;

    return `${hours}:${minutes}:00`;
  };

  const getStepAvgDuration = (subStep: ActualChangeOverDetail) => {
    const avgDuration = parseFloat(subStep.avgDuration);

    const hours = Math.floor(avgDuration / 60);
    const minutes = avgDuration % 60;

    return `${hours}:${minutes}:00`;
  };

  const getSubStepSumTargetDuration = (
    subStep: ActualChangeOverDetail,
    targetDetails: ActualChangeOverDetail[] | undefined
  ) => {
    let sumTargetDuration = '00:00:00';

    if (targetDetails) {
      const subSteps = targetDetails.filter(
        (targetDetail) => targetDetail.recipeDescr === subStep.recipeDescr
      );
      subSteps.forEach((subStep) => {
        sumTargetDuration =
          sumTargetDuration && subStep?.duration
            ? AddHHMMSS(sumTargetDuration, subStep?.duration)
            : '-';
      });
    }

    return sumTargetDuration;
  };

  const checkSubStepsStatus = (subSteps: ActualChangeOverDetail[]) => {
    const status = subSteps.every((subStep) => {
      return subStep?.alarms.length > 0;
    });
    return !status ? CleaningStepStatus.Completed : '';
  };

  const toCleaningStepWithKPI = (
    selectedChangeover?: AsepticChangeoverType
  ): CleaningStepWithKPI[] => {
    // Group tags by their 'tagGroupId'
    const groups = _(selectedChangeover?.actualDetails)
      .groupBy((actualDetail) => actualDetail.modeDescr)
      .map((values, key) => ({
        id: values[0].modeNumber,
        name: key,
        parentName: '',
        status: '1',
        startTime: values[0].startTime,
        endTime: values[values.length - 1].endTime,
        avgOverTime: getSumAvgDuration(values),
        kpis: [],
        alarms: mergeAllAlarmsData(values),
        alerts: [],
        duration: getStepDuration(values),
        targetDuration: getSumTargetDuration(values, selectedChangeover?.targetDetails),
        subSteps: _(values)
          .groupBy((subStep) => subStep.recipeDescr)
          .map((subSteps) => ({
            id: subSteps[0].recipeDescr,
            name: subSteps[0].recipeDescr,
            parentName: subSteps[0].modeDescr,
            status: checkSubStepsStatus(subSteps),
            startTime: subSteps[0].startTime + '.275000+00:00',
            endTime: subSteps[subSteps.length - 1].endTime,
            avgOverTime: getStepAvgDuration(subSteps[0]),
            kpis: [],
            alarms: mergeAllAlarmsData(subSteps),
            alerts: [],
            duration: getStepDuration(subSteps),
            targetDuration: getSubStepSumTargetDuration(
              subSteps[0],
              selectedChangeover?.targetDetails
            ),
            targetDiffInMinutes: subSteps[0].targetDiffInMinutes
          }))
          .value()
      }))
      .value();
    const returnData: CleaningStepWithKPI[] = [];

    for (const group of groups) {
      returnData.push(group as unknown as CleaningStepWithKPI);
    }
    return returnData;
  };

  const handleDateOpen = () => {
    setShouldOverflow((prev) => !prev);
  };

  const goto = (subRoute: string) => {
    history.push(`${match.url}/${subRoute}`);
  };

  const isActive = (subRoute: string) => location.pathname.includes(`${match.url}/${subRoute}`);

  useEffect(() => {
    const selectedSteps: string[] = [];
    stepsData?.map((step) => {
      selectedSteps.push(step.id);
    });
    setSelectedSteps(selectedSteps);
    setAllStepsIds(selectedSteps);
  }, [stepsData]);

  const getColorById = useColorMap(theme.colors.changeoverStepDurationsColors);

  const onSelectFilters = (filters: string[]) => {
    setStepsHistory((prev) => [...prev, filters]);
    setStepsIndex((prev) => prev + 1);
  };

  const onSelectSteps = (steps: string[]) => {
    if (isEqual(selectedSteps, allStepsIds)) {
      setSelectedSteps([...steps]);
      onSelectFilters([...steps]);
    } else if (steps.every((step) => selectedSteps.includes(step))) {
      setSelectedSteps(allStepsIds);
      onSelectFilters(allStepsIds);
    } else {
      const newValue = [...selectedSteps, ...steps];
      setSelectedSteps(newValue);
      onSelectFilters(newValue);
    }
  };

  const currentSteps = useMemo(() => stepsHistory[stepsIndex], [stepsIndex, stepsHistory]);

  const { orderedGroupedSteps, decoratedSteps } = useMemo(
    () => processData(stepsData),
    [stepsData]
  );

  return (
    <Container>
      <PillsContainer>
        <Typography mb={0} size="0.8125rem" weight="bold">
          {t('show_me')}:
        </Typography>
        <Pill
          onClick={() => goto(SUB_ROUTES.singleSession)}
          selected={isActive(SUB_ROUTES.singleSession)}
        >
          {t('single_session')}
        </Pill>
        <Pill
          onClick={() => goto(SUB_ROUTES.stepsOverTime)}
          selected={isActive(SUB_ROUTES.stepsOverTime)}
        >
          {t('steps_over_time')}
        </Pill>
      </PillsContainer>

      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/${SUB_ROUTES.singleSession}`} />
        </Route>

        <Route path={`${match.path}/${SUB_ROUTES.singleSession}`}>
          <Row>
            <Column size={10} />
            <Column size={2}>
              <ButtonsContainer>
                <StyledLabel>
                  <Typography mb={0} size="0.8rem" as="label" weight="bold">
                    {t('show_me')}
                  </Typography>
                </StyledLabel>
                <Button
                  variant={'thin'}
                  arrow={true}
                  onClick={() => setSessionSelectorVisible(true)}
                >
                  {formatSessionName(selectedSession, undefined)}
                </Button>
                <Flyout
                  overflow={shouldOverflow ? 'visible' : 'auto'} // necessary for date selector to be visible
                  width="28.125rem"
                  visible={sessionSelectorVisible}
                  onClose={closeSessionSelector}
                >
                  <SessionSelector
                    close={closeSessionSelector}
                    session={selectedSession}
                    dateRange={dateRange}
                    onSelectSession={setSelectedSession}
                    onDateRangeChange={setDateRange}
                    averageDuration={averageDuration}
                    onAverageDurationChange={setAverageDuration}
                    data={changeoverSessionsData}
                    isLoading={isSessionsFetching}
                    error={sessionsError}
                    handleDateOpen={handleDateOpen}
                    displayAverageSizeSelector={false}
                  />
                </Flyout>
                <Flyout
                  width="28.125rem"
                  visible={!!(selectedAlarms || selectedAlerts)}
                  onClose={() => {
                    setSelectedAlarms(undefined);
                    setSelectedAlerts(undefined);
                  }}
                >
                  {(selectedAlarms || selectedAlerts) && (
                    <AlarmDetail
                      alarms={selectedAlarms}
                      alerts={selectedAlerts}
                      onClose={() => {
                        setSelectedAlarms(undefined);
                        setSelectedAlerts(undefined);
                      }}
                    />
                  )}
                </Flyout>
              </ButtonsContainer>
            </Column>
          </Row>
          <Row>
            <Column size={4}>
              {isSelectedChangeoverFullDetailsFetching ? (
                <Loader />
              ) : (
                <ChangeOverWidget
                  hideArrow={true}
                  currentChangeoverSummary={selectedChangeoverFullDetails as AsepticChangeoverType}
                />
              )}
            </Column>
            <Column size={4}>
              <WaitTimeWidget
                waitTimeValue={
                  selectedChangeoverFullDetails?.waitTime
                    ? selectedChangeoverFullDetails?.waitTime
                    : (t('na', { ns: 'common' }) as string)
                }
                isLoading={isSelectedChangeoverFullDetailsFetching}
              />
            </Column>
            <Column size={4}>
              <IssuesContainer>
                <MachineActiveIssues
                  scrollHeight={400}
                  title={t('session_issues') as string}
                  machineType={MachineType.Aseptic}
                  alarmsDataIn={getAllAlarmsData(
                    selectedChangeoverFullDetails as AsepticChangeoverType
                  )}
                  alertsDataIn={selectedChangeoverFullDetails?.alerts}
                  hideArrow={true}
                />
              </IssuesContainer>
            </Column>
          </Row>
          <Row>
            <Column>
              <KPICard>
                <ChangeOverStateChartWidget
                  selectedChangeover={selectedChangeoverFullDetails as AsepticChangeoverType}
                  isLoading={isSelectedChangeoverFullDetailsFetching}
                  error={selectedChangeoverFullDetailsError}
                />
              </KPICard>
            </Column>
          </Row>
          <Row>
            <Column>
              <CleaningStepsTable
                key={`key`}
                data={toCleaningStepWithKPI(selectedChangeoverFullDetails)}
                isDataLoading={isLoading}
                setSelectedAlarms={(alarms) => setSelectedAlarms(alarms)}
                setSelectedAlerts={(alerts) => setSelectedAlerts(alerts)}
                machineType={MachineType.Aseptic}
              />
            </Column>
          </Row>
        </Route>

        <Route path={`${match.path}/${SUB_ROUTES.stepsOverTime}`}>
          {isChangeoverDetailsFetching ? (
            <Loader />
          ) : (
            <ChartsContainer>
              <ChangeOverStepDurationsBarChart
                selectedSteps={currentSteps}
                onSelectSteps={onSelectSteps}
                data={decoratedSteps}
                groupedData={orderedGroupedSteps}
                getColorById={getColorById}
              />
            </ChartsContainer>
          )}
        </Route>
      </Switch>
    </Container>
  );
};

export default ChangeOver;
