// 3rd party libs
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { Button } from 'components';
import AssignAndScheduleEvent from './AssignAndScheduleEvent';
import MaintenanceEventDetailCard from './MaintenanceEventDetailCard';
import MaintenanceEventCloseOutSurvey from './MaintenanceEventCloseOutSurvey';
import MaintenanceEventPartsDetail from './MaintenanceEventPartsDetail';
import MaintenanceEventDetailHeader from './MaintenanceEventDetailHeader';
import Loader from 'components/Loader';
import AssignAndScheduleTaskCard from './TaskCards/AssignAndScheduleTaskCard';
import OrderPartsKitCard from './TaskCards/OrderPartsKitCard';
import CloseOutSurveyCard from './TaskCards/CloseOutSurveyCard';
import PredictiveMaintenanceEventCloseOutSurvey from './PredictiveAlertCloseOutSurvey';
import PredictiveMaintenanceEventIgnoreSurvey from './PredictiveMaintenanceEventIgnoreSurvey';
import PredictiveCloseOutSurveyCard from './TaskCards/PredictiveCloseOutSurveyCard';
// Types
import { CartListType } from 'types/parts/cart';
import {
  MaintenanceCreator,
  MaintenanceEvent,
  MaintenanceEventTableRow,
  MaintenanceTask,
  MaintenanceTaskType,
  PMOpenType,
  MaintenanceEventStatus,
  DataScienceSurvey
} from 'types/maintenance';

// api
import { useGetMaintenanceEventsQuery, useGetDataScienceSurveyQuery } from 'api';

import { useDispatch } from 'react-redux';
import { helpActions } from 'actions';
import { JBTRoutes } from 'constants/routes';
import { Link } from 'react-router-dom';

interface Props {
  maintenanceEventId: string;
  cartViewType: string;
  machineDescription?: string;
  onClose: (pm?: MaintenanceEventTableRow) => void;
  onCartViewType: (cartViewType: CartListType.VIEW_TYPE_LESS | CartListType.VIEW_TYPE_MORE) => void;
}

/* Styling */
const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.darkGray3};
`;

export const DayPickerContainer = styled.div`
  display: flex;
  flex-direction: column;

  .DayPickerInput > input {
    width: 100%;
    height: 2.5rem;
    border: 0.0625rem solid #d8dde3;
    padding: 0 1rem;
    font-family: ${(props) => props.theme.typography.family || 'sans-serif'};
    font-size: ${(props) => props.theme.typography.components.input.size || '0.875rem'};
    line-height: ${(props) => props.theme.typography.components.input.lineHeight || '1.125rem'};
    font-weight: ${(props) => props.theme.typography.components.input.weight || '500'};
    appearance: none;

    box-sizing: border-box;
    border-radius: 0.375rem;
    border: ${(props) => props.theme.colors.borders.border02.border || '0.0625rem solid #D8DDe3'};
    box-shadow: ${(props) => props.theme.colors.borders.border02.shadow || 'none'};
  }
`;

export const Footer = styled.div<{ flexDirection?: string; bgColor?: string }>`
  background-color: ${({ theme, bgColor }) => (bgColor ? bgColor : theme.colors.lightGrey1)};
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
  justify-content: end;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

export const Table = styled.table<{ mb?: string }>`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '0'};

  td {
    padding: 0.5rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;

const Container = styled.div<{ bgColor?: string }>`
  background-color: ${({ bgColor, theme }) => (bgColor ? bgColor : theme.colors.lightGrey1)};
  > * + * {
    margin-top: 0.875rem;
  }
  display: flex;
  flex-direction: column;
  flex: 1;
`;

function getMaintenanceEventHeaderTitle(
  maintenanceEvent: MaintenanceEvent | undefined,
  t: TFunction<'fpns'[], undefined>
): string {
  if (
    maintenanceEvent === undefined ||
    maintenanceEvent.creator !== MaintenanceCreator.Predictive
  ) {
    return t('maintenance_event_detail');
  }

  return t('alert_detail');
}

const MaintenanceEventDetail = ({
  maintenanceEventId,
  cartViewType,
  machineDescription,
  onClose,
  onCartViewType
}: Props): JSX.Element => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { t } = useTranslation(['fpns']);

  const { data: rawMaintenanceEvents, isFetching: eventFetching } = useGetMaintenanceEventsQuery({
    maintenanceEventIds: [maintenanceEventId]
  });

  const { data: rawDataScienceSurvey } = useGetDataScienceSurveyQuery({
    maintenanceEventIds: [maintenanceEventId]
  });
  const maintenanceEvent = rawMaintenanceEvents
    ? (rawMaintenanceEvents.items[0] as MaintenanceEventTableRow)
    : undefined;

  const completedDataScienceSurvey = rawDataScienceSurvey
    ? (rawDataScienceSurvey[0] as DataScienceSurvey)
    : undefined;
  const [pmOpenType, setPMOpenType] = useState<string>(PMOpenType.None);
  const [pmSurveyComplete, setPMSurveyComplete] = useState<boolean>(true);
  const [pmHeaderBgColor, setPMHeaderBgColor] = useState<string>(theme.colors.lightGrey1);

  const maintenanceEventFlyoutOpen = pmOpenType !== PMOpenType.None;

  const surveyClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPMOpenType(PMOpenType.CloseoutSurveyType);
    const isComplete = event.currentTarget.innerText === 'Yes';
    setPMSurveyComplete(isComplete);
    setPMHeaderBgColor(isComplete ? theme.colors.onTrackGreen5 : theme.colors.negativeRed4);
  };

  const ignoreAlertClickHandler = () => {
    setPMOpenType(PMOpenType.PredictiveAlertType);
  };

  const headerClickHandler = (event?: MaintenanceEvent) => {
    setPMOpenType(PMOpenType.None);

    setPMHeaderBgColor(theme.colors.lightGrey1);
    onCartViewType(CartListType.VIEW_TYPE_LESS);
    if (event?.followUpNeeded) {
      onClose(event as MaintenanceEventTableRow);
    }
  };

  const gotoHelpHandler = () => {
    dispatch({
      type: helpActions.ADD_HELP_MESSAGE,
      helpMessage: `Help request regarding a maintenance event for machine ${machineDescription}, subcomponent ${maintenanceEvent?.subcomponent}`
    });
  };

  const pmOrderedTasks: MaintenanceTask[] = maintenanceEvent?.tasks
    ? ([...(maintenanceEvent?.tasks as MaintenanceTask[])].sort(
        (a, b) => a.priority - b.priority
      ) as MaintenanceTask[])
    : [];

  return (
    <Container style={{ padding: maintenanceEventFlyoutOpen ? '0rem' : '1rem' }}>
      <MaintenanceEventDetailHeader
        maintenanceEventFlyoutOpen={maintenanceEventFlyoutOpen}
        bgColor={pmHeaderBgColor}
        title={getMaintenanceEventHeaderTitle(maintenanceEvent, t)}
        onClose={onClose}
        onHeaderClick={headerClickHandler}
      />

      {maintenanceEventFlyoutOpen &&
        maintenanceEvent &&
        pmOpenType == PMOpenType.AssignAndSchedule && (
          <AssignAndScheduleEvent
            maintenanceEvent={maintenanceEvent}
            machineDescription={machineDescription}
            onSubmitClick={() => {
              setPMOpenType(PMOpenType.None);
            }}
          />
        )}
      {maintenanceEventFlyoutOpen && maintenanceEvent && pmOpenType == PMOpenType.PartsType && (
        <MaintenanceEventPartsDetail
          maintenanceEvent={maintenanceEvent}
          cartViewType={cartViewType}
          onCartViewType={onCartViewType}
          onSubmitClick={headerClickHandler}
        />
      )}
      {maintenanceEventFlyoutOpen &&
        maintenanceEvent &&
        pmOpenType == PMOpenType.CloseoutSurveyType && (
          <MaintenanceEventCloseOutSurvey
            maintenanceEvent={maintenanceEvent}
            surveyCompletedAsPlanned={pmSurveyComplete}
            onSubmitClick={headerClickHandler}
            machineDescription={machineDescription}
          />
        )}
      {maintenanceEventFlyoutOpen &&
        pmOpenType == PMOpenType.PredictiveAlertType &&
        maintenanceEvent && (
          <PredictiveMaintenanceEventIgnoreSurvey
            maintenanceEvent={maintenanceEvent}
            onSubmitClick={headerClickHandler}
            onClose={onClose}
          />
        )}
      {!maintenanceEventFlyoutOpen && (
        <>
          <MaintenanceEventDetailCard
            description={maintenanceEvent?.description}
            createdAt={maintenanceEvent?.createdAt}
            machineDescription={machineDescription}
            subComponent={maintenanceEvent?.subcomponent}
            status={maintenanceEvent?.status}
            suggestedDue={maintenanceEvent?.suggestedDue}
            isLoading={eventFetching}
          />

          <UnstyledLink to={JBTRoutes.help} onClick={gotoHelpHandler}>
            <Button variant="thin" arrow>
              {t('contact_jbt')}
            </Button>
          </UnstyledLink>
        </>
      )}
      {!maintenanceEventFlyoutOpen &&
        maintenanceEvent?.creator &&
        maintenanceEvent?.creator === MaintenanceCreator.Predictive &&
        maintenanceEvent?.status === MaintenanceEventStatus.Completed && (
          <PredictiveCloseOutSurveyCard
            event={maintenanceEvent}
            survey={completedDataScienceSurvey}
          />
        )}
      {!maintenanceEventFlyoutOpen && eventFetching && <Loader size={60} />}
      {maintenanceEvent &&
        !maintenanceEventFlyoutOpen &&
        !eventFetching &&
        pmOrderedTasks.map((task) => {
          if (task.type === MaintenanceTaskType.Order) {
            return (
              <OrderPartsKitCard
                maintenanceEvent={maintenanceEvent}
                onClick={() => {
                  setPMOpenType(PMOpenType.PartsType);
                }}
              />
            );
          } else if (task.type === MaintenanceTaskType.AssignAndSchedule) {
            return (
              <AssignAndScheduleTaskCard
                onClick={() => {
                  setPMOpenType(PMOpenType.AssignAndSchedule);
                }}
                maintenanceEvent={maintenanceEvent}
                machineDescription={machineDescription}
              />
            );
          } else if (task.type === MaintenanceTaskType.Complete) {
            return (
              <CloseOutSurveyCard
                event={maintenanceEvent}
                surveyClickHandler={surveyClickHandler}
              />
            );
          }
          /* TODO: what to do with follow ups?
              else if (task.type === MaintenanceTaskType.FollowUp) {
                return (
                  <i>Follow up </i>
                )
              }
              */
        })}
      {!maintenanceEventFlyoutOpen &&
        maintenanceEvent?.creator &&
        maintenanceEvent?.creator === MaintenanceCreator.Predictive && (
          <PredictiveMaintenanceEventCloseOutSurvey
            pmDetails={maintenanceEvent}
            onSubmitClick={headerClickHandler}
            onClose={onClose}
            ignoreAlertClickHandler={ignoreAlertClickHandler}
          />
        )}
    </Container>
  );
};

export default MaintenanceEventDetail;
