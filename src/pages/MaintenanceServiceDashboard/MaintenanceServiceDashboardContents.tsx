// 3rd party libraries
import React, { ReactElement, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { MaintenanceIcon } from 'icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import {
  Button,
  Flyout,
  FollowUpDetail,
  Loader,
  MaintenanceEventDetail,
  Modal,
  PageHeader,
  TabNav,
  Typography,
  PermissionWrapper
} from 'components';
import TopView from './TopView';
import SubNavBase from './SubNavBase';

// Types
import { Machine, ModalSize, Plant, UserScopes } from 'types';
import { CartListType } from 'types/parts/cart';
import {
  MaintenanceEvent,
  MaintenanceEventArgs,
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceFrequencyType,
  MaintenanceSchedule,
  MaintenanceScheduleArgs,
  MaintenanceScheduleTableRow,
  MaintenanceEventDownloadPayload
} from 'types/maintenance';
import { PermissionScopeName } from 'types/user-management';

// API
import { useGetPlantsQuery, useDownloadSelectedPlannedMaintenanceEventsMutation } from 'api';
import { toast } from 'react-toastify';

interface Props {
  isExpanded: boolean;
}

const download_selected = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_146_80946)">
      <path
        d="M9.33337 2V4.66667C9.33337 4.84348 9.40361 5.01305 9.52864 5.13807C9.65366 5.2631 9.82323 5.33333 10 5.33333H12.6667"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3334 14H4.66671C4.31309 14 3.97395 13.8595 3.7239 13.6095C3.47385 13.3594 3.33337 13.0203 3.33337 12.6667V3.33333C3.33337 2.97971 3.47385 2.64057 3.7239 2.39052C3.97395 2.14048 4.31309 2 4.66671 2H9.33337L12.6667 5.33333V12.6667C12.6667 13.0203 12.5262 13.3594 12.2762 13.6095C12.0261 13.8595 11.687 14 11.3334 14Z"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 11.3334V7.33337" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6.33337 9.66663L8.00004 11.3333L9.66671 9.66663"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_146_80946">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const download_all = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_146_80941)">
      <path
        d="M2.66663 11.3334V12.6667C2.66663 13.0203 2.8071 13.3595 3.05715 13.6095C3.3072 13.8596 3.64634 14 3.99996 14H12C12.3536 14 12.6927 13.8596 12.9428 13.6095C13.1928 13.3595 13.3333 13.0203 13.3333 12.6667V11.3334"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66663 7.33337L7.99996 10.6667L11.3333 7.33337"
        stroke="#0076CC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 2.66663V10.6666" stroke="#0076CC" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_146_80941">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Container = styled.div<Props>`
  padding: 1.75rem 1.5rem;
  width: ${(props) => (props.isExpanded ? '100%' : '70%')};
`;

const ColumnContainer = styled.div`
  display: flex;
`;

const ModalHeader = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;

const ButtonDiv = styled.div`
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
  z-index: 1;
`;

const DownloadTypeSelectWrapper = styled.div`
  width: 200px;
  margin-left: 25px;
  margin-top: 10px;
  display: flex;
  & button {
    background-color: white;
    border: 0px;
    box-shadow: none;
  }
`;
export enum TabViews {
  HighPriority,
  Planned,
  History
}
export enum SecondaryTabViews {
  RunTimeBased,
  Predictive,
  ServiceTech,
  Resolved,
  Daily,
  Weekly,
  Monthly,
  Quarterly,
  HalfYearly,
  Yearly
}

const TabsContainer = styled.div`
  position: relative;
  padding: 1rem 3.125rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.05);
`;

const secondaryTabArrayHighPriority = [
  { value: SecondaryTabViews.RunTimeBased, selected: true, label: 'run_time_based' },
  { value: SecondaryTabViews.Predictive, selected: false, label: 'predictive' },
  { value: SecondaryTabViews.ServiceTech, selected: false, label: 'service_tech' }
];

const secondaryTabArrayHistory = [
  { value: SecondaryTabViews.Resolved, selected: true, label: 'resolved' }
];

const secondaryTabArrayPlanned = [
  { value: SecondaryTabViews.Daily, selected: true, label: 'daily' },
  { value: SecondaryTabViews.Weekly, selected: false, label: 'weekly' },
  { value: SecondaryTabViews.Monthly, selected: false, label: 'monthly' },
  { value: SecondaryTabViews.Quarterly, selected: false, label: 'quarterly' },
  { value: SecondaryTabViews.HalfYearly, selected: false, label: 'half_yearly' },
  { value: SecondaryTabViews.Yearly, selected: false, label: 'yearly' }
];

export const addMachineDescToEvents = (
  events: MaintenanceEvent[],
  givenMachines: Machine[]
): MaintenanceEvent[] => {
  return events.map((ev) => {
    return {
      ...ev,
      machineDescription:
        givenMachines.find((m) => m.id === ev.machineId)?.description || 'Machine Unavailable'
    };
  });
};

export const addMachineDescToSchedule = (
  events: MaintenanceSchedule[],
  givenMachines: Machine[]
): MaintenanceSchedule[] => {
  if (events === undefined) return [];
  return events.map((ev) => {
    return {
      ...ev,
      machineDescription:
        givenMachines.find((m) => m.id === ev.machineId)?.description || 'Machine Unavailable'
    };
  });
};

interface MaintenanceServiceDashboardContentsProps {
  machineId?: string;
}

export default function MaintenanceServiceDashboardContents({
  machineId
}: MaintenanceServiceDashboardContentsProps): ReactElement {
  // TODO - Handle errors from retrieving plants
  const { data: plants, /*error: plantsError,*/ isLoading: plantsLoading } = useGetPlantsQuery();
  const [downloadSelectedMaintenanceEvents] = useDownloadSelectedPlannedMaintenanceEventsMutation();
  const { t } = useTranslation(['fpns']);

  const machines = useMemo(
    () =>
      plantsLoading
        ? undefined
        : plants?.reduce((acc: Machine[], plant: Plant) => acc.concat(plant?.machines ?? []), []),
    [plants, plantsLoading]
  );

  const [currentTab, setCurrentTab] = useState(TabViews.HighPriority);
  const [secondaryTab, setSecondaryTab] = useState(secondaryTabArrayHighPriority);
  const [currentMaintenanceSchedulePage, setCurrentMaintenanceSchedulePage] =
    useState<MaintenanceSchedule[]>();

  // Handling the filters' visibility
  const [numResults, setNumResults] = useState<number | null>(null);

  // Define default filters for different tabs
  const defaultFilter = useMemo(() => {
    const filter: MaintenanceEventArgs = {
      includeTasks: false,
      includeProductIds: false
    };
    filter.machineIds = machineId ? [machineId] : [];
    return filter;
  }, [machineId]);

  const defaultHistoryFilter = useMemo(() => {
    const filter: MaintenanceEventArgs = {
      includeTasks: false,
      includeProductIds: false,
      status: MaintenanceEventStatus.Completed
    };
    filter.machineIds = machineId ? [machineId] : [];
    return filter;
  }, [machineId]);

  const defaultPlannedFilter = useMemo(() => {
    const filter: MaintenanceScheduleArgs = {
      frequencyType: MaintenanceFrequencyType.Days,
      minimumFrequency: 1,
      maximumFrequency: 1
    };
    filter.machineIds = machineId ? [machineId] : [];
    return filter;
  }, [machineId]);

  // initialize filters to the default
  const [priorityFilter, setPriorityFilter] = useState<
    MaintenanceEventArgs | MaintenanceScheduleArgs
  >(defaultFilter);
  const [plannedFilter, setPlannedFilter] = useState<
    MaintenanceEventArgs | MaintenanceScheduleArgs
  >(defaultPlannedFilter);
  const [historyFilter, setHistoryFilter] = useState<
    MaintenanceEventArgs | MaintenanceScheduleArgs
  >(defaultHistoryFilter);
  // reset filters back to default on tab change
  const resetFilter = (thisCurrentTab: TabViews) => {
    if (thisCurrentTab === TabViews.HighPriority) {
      setPriorityFilter(defaultFilter);
      setSecondaryTab(secondaryTabArrayHighPriority);
    } else if (thisCurrentTab === TabViews.Planned) {
      setPlannedFilter(defaultPlannedFilter);
      setSecondaryTab(secondaryTabArrayPlanned);
    } else {
      setHistoryFilter(defaultHistoryFilter);
      setSecondaryTab(secondaryTabArrayHistory);
    }
  };

  useEffect(() => {
    setPriorityFilter(defaultFilter);
    setPlannedFilter(defaultPlannedFilter);
    setHistoryFilter(defaultHistoryFilter);
  }, [defaultFilter, defaultHistoryFilter, defaultPlannedFilter, machines]);

  const [selectedPm, setSelectedPm] = useState<
    MaintenanceEventTableRow | null | MaintenanceScheduleTableRow
  >(null);
  const [completedMaintenanceEvents, setCompletedMaintenanceEvents] = useState<
    MaintenanceScheduleTableRow[]
  >([]);
  const [followUpPM, setFollowUpPM] = useState<MaintenanceEvent | null>(null);
  const [cartViewType, setCartViewType] = useState(CartListType.VIEW_TYPE_LESS);
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [showCreateServiceModal, setCreateServiceModal] = useState<boolean>(false);
  const flyoutWidth = cartViewType === CartListType.VIEW_TYPE_LESS ? '28.125rem' : '58.125rem';

  const flyoutCloseHandler = (maintenanceEvent?: MaintenanceEventTableRow) => {
    if (maintenanceEvent?.followUpNeeded) {
      setShowFollowUpModal(true);
      setFollowUpPM({ ...selectedPm } as MaintenanceEventTableRow);
    }
    setSelectedPm(null); //triggers closing of flyout
    setCartViewType(CartListType.VIEW_TYPE_LESS);
    changeTabAndRefreshEvents(currentTab, false);
  };

  const changeTabAndRefreshEvents = (tabView: TabViews, shouldResetFilter: boolean) => {
    setCurrentTab(tabView);
    if (shouldResetFilter) {
      resetFilter(tabView);
    }
  };

  const changeSecondaryTab = (secondaryTabView: SecondaryTabViews) => {
    const tempSecondaryTab = secondaryTab.map((x) => {
      return { ...x, selected: x.value == secondaryTabView ? true : false };
    });
    setSecondaryTab(tempSecondaryTab);
  };

  const onModalClose = () => {
    setShowFollowUpModal(false);
    setCreateServiceModal(false);
    setFollowUpPM(null);
  };

  const submitClickHandler = () => {
    changeTabAndRefreshEvents(currentTab, true);
    setShowFollowUpModal(false);
  };
  const getSelectedServiceData = (data: MaintenanceEventTableRow) => {
    setShowFollowUpModal(true);
    setFollowUpPM({ ...data });
  };
  const getMaxFrequencyFromPlannedEvent = (min: number): number => {
    switch (true) {
      case min >= 1 && min < 3:
        return 2;
      case min >= 7 && min < 15:
        return 14;
      case min >= 28 && min < 32:
        return 31;
      case min == 90:
        return 90;
      case min >= 180 && min < 183:
        return 182;
      case min >= 350 && min < 366:
        return 365;
      default:
        break;
    }
    return 0;
  };
  const initiateDownload = (type: string): void => {
    const downloadPayload: MaintenanceEventDownloadPayload = { machineIds: [] };

    if (machineId) {
      downloadPayload.machineIds?.push(machineId as string);
    }
    // Download maintenance events
    if (type === 'downloadselected') {
      if (completedMaintenanceEvents && completedMaintenanceEvents.length > 0) {
        downloadPayload.maintenanceScheduleIds = completedMaintenanceEvents.map(
          (event) => event.id
        );
        downloadPayload.minimumFrequency = completedMaintenanceEvents[0].frequency;
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        downloadPayload.maximumFrequency = getMaxFrequencyFromPlannedEvent(
          completedMaintenanceEvents[0].frequency!
        );
        downloadSelectedMaintenanceEvents(downloadPayload)
          .unwrap()
          .then((result) => {
            window.location.href = `${result.url}`;
          })
          .catch((error) => {
            toast.error('Error occurred while downloading events');
            console.error(error);
          });
      } else {
        toast.error('No events have been selected!');
      }
    } else {
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      downloadPayload.minimumFrequency = currentMaintenanceSchedulePage![0].frequency;
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      downloadPayload.maximumFrequency = getMaxFrequencyFromPlannedEvent(
        currentMaintenanceSchedulePage![0].frequency!
      );
      downloadSelectedMaintenanceEvents(downloadPayload)
        .unwrap()
        .then((result) => {
          window.location.href = `${result.url}`;
        })
        .catch((error) => {
          toast.error('Error occurred while downloading events');
          console.error(error);
        });
    }
  };
  return (
    <>
      <PageHeader
        mb="1rem"
        heading={t('card_maintenance_manager', { ns: 'common' })}
        icon={{ iconElement: MaintenanceIcon, iconType: 'custom' }}
      />
      {!machines ? (
        <Loader />
      ) : (
        <>
          <TabNav
            items={[
              {
                label:
                  numResults === null || currentTab != TabViews.HighPriority
                    ? t('high_priority')
                    : t('high_priority_param', { item: numResults }),
                onClick: () => changeTabAndRefreshEvents(TabViews.HighPriority, true),
                active: currentTab === TabViews.HighPriority,
                isTabEnabled: true
              },
              {
                label:
                  numResults === null || currentTab != TabViews.Planned
                    ? t('planned')
                    : t('planned_param', { item: numResults }),
                onClick: () => changeTabAndRefreshEvents(TabViews.Planned, true),
                active: currentTab === TabViews.Planned,
                isTabEnabled: true
              },
              {
                label:
                  numResults === null || currentTab != TabViews.History
                    ? t('history')
                    : t('history_param', { item: numResults }),
                onClick: () => changeTabAndRefreshEvents(TabViews.History, true),
                active: currentTab === TabViews.History,
                isTabEnabled: true
              }
            ]}
          />
          <TabsContainer>
            <SubNavBase changeSecondaryTab={changeSecondaryTab} secondaryTab={secondaryTab} />
          </TabsContainer>
          <PermissionWrapper
            page={PermissionScopeName.MAINTENANCE_MANAGER}
            scope={UserScopes.Write}
          >
            <ButtonDiv>
              <Button variant="primary" onClick={() => setCreateServiceModal(true)}>
                {t('create_service')}
              </Button>
            </ButtonDiv>
          </PermissionWrapper>
          {currentTab === TabViews.Planned && machines && (
            <DownloadTypeSelectWrapper>
              <Button
                icon={download_selected}
                variant={'thin'}
                marginLeft={'-1.2rem'}
                onClick={() => initiateDownload('downloadselected')}
              >
                {t('download_selected')}
              </Button>
              <Button
                icon={download_all}
                variant={'thin'}
                onClick={() => initiateDownload('downloadall')}
              >
                {t('download_all')}
              </Button>
            </DownloadTypeSelectWrapper>
          )}

          <ColumnContainer>
            <Container isExpanded>
              {currentTab === TabViews.HighPriority && machines && (
                <TopView
                  filter={priorityFilter}
                  machines={machines}
                  setSelectedPm={setSelectedPm}
                  setNumResults={setNumResults}
                  secondaryTab={secondaryTab}
                  primaryTab={currentTab}
                />
              )}
              {currentTab === TabViews.Planned && machines && (
                <TopView
                  filter={plannedFilter}
                  machines={machines}
                  setSelectedPm={setSelectedPm}
                  setNumResults={setNumResults}
                  secondaryTab={secondaryTab}
                  primaryTab={currentTab}
                  updateCompletedEvents={setCompletedMaintenanceEvents}
                  setCurrentMaintenanceSchedulePage={setCurrentMaintenanceSchedulePage}
                />
              )}
              {currentTab === TabViews.History && machines && (
                <TopView
                  filter={historyFilter}
                  machines={machines}
                  setSelectedPm={setSelectedPm}
                  setNumResults={setNumResults}
                  secondaryTab={secondaryTab}
                  primaryTab={currentTab}
                  onClickCreateService={getSelectedServiceData}
                />
              )}
            </Container>
          </ColumnContainer>
          <Modal
            visible={
              (showFollowUpModal && !showCreateServiceModal) ||
              (showCreateServiceModal && !showFollowUpModal)
            }
            size={ModalSize.SMALL}
            onClose={onModalClose}
            title={<ModalHeader>{FollowUpModal(showFollowUpModal, t)}</ModalHeader>}
          >
            <FollowUpDetail
              maintenanceEvent={followUpPM as MaintenanceEvent}
              onClose={onModalClose}
              onSubmitClick={submitClickHandler}
              machines={showCreateServiceModal ? machines : []}
              machineId={machineId}
              newService={showCreateServiceModal ? true : false}
            />
          </Modal>

          {selectedPm &&
            (typeof selectedPm.machineDescription == 'string' ||
              typeof selectedPm.machineDescription == 'undefined') && (
              <Flyout width={flyoutWidth} visible={!!selectedPm} onClose={flyoutCloseHandler}>
                {selectedPm && (
                  <MaintenanceEventDetail
                    maintenanceEventId={selectedPm.id}
                    machineDescription={selectedPm.machineDescription}
                    cartViewType={cartViewType}
                    onCartViewType={setCartViewType}
                    onClose={flyoutCloseHandler}
                  />
                )}
              </Flyout>
            )}
        </>
      )}
    </>
  );
}
function FollowUpModal(
  showFollowUpModal: boolean,
  t: TFunction<'fpns'[], undefined>
): React.ReactNode {
  return showFollowUpModal ? (
    <Typography as="h3" mb={2} size="1.125rem" weight="bold">
      <FontAwesomeIcon icon={faTools} /> {t('create_follow_up_service')}
    </Typography>
  ) : (
    <Typography as="h3" mb={2} size="1.125rem" weight="bold">
      <FontAwesomeIcon icon={faTools} /> {t('create_new_service')}
    </Typography>
  );
}
