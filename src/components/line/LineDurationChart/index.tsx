// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import {
  Modal,
  StateOverTimeCard,
  Typography,
  useDateRange,
  WidgetUi,
  DateButtonWithDropdown
} from 'components';

// Theme
import theme from 'themes';

// Api
import { useGetLineAndMachinesStatusesByLineIdQuery } from 'api';

// Helpers
import { toNestedData } from './utils';

// Constants
import { LineGuide } from 'constants/lineView';

// Types
import { ModalSize } from 'types';

const StyledModalContentContainer = styled.div`
  padding: 0rem 3rem 1.5rem;
`;

type Props = {
  lineId: string;
  lineName: string;
};

const LineDurationChart = ({ lineId, lineName }: Props): JSX.Element => {
  const { dateRange, setDateRange, isoDateRange } = useDateRange();
  const { startTime: startDatetime, endTime: endDatetime } = isoDateRange;

  /**
   * Query machines by line
   *
   */
  const {
    data: lineAndMachinesTuple,
    isLoading,
    isFetching,
    error
  } = useGetLineAndMachinesStatusesByLineIdQuery({
    endDatetime,
    lineId,
    startDatetime
  });
  const { t } = useTranslation(['mh']);
  const [isOpenInfoModal, setIsInfoModalOpen] = useState(false);

  /**
   * Map state codes to colors
   */
  const colorMap = theme.colors.stateCategoriesColors as { [key: string]: string };

  const headingFontSize = '1rem';
  const textSpacing = '1rem';

  const widgetSettings = {
    title: 'Line Status',
    IconRight: {
      Icon: <DateButtonWithDropdown {...{ dateRange, setDateRange }} />,
      label: 'Select date range'
    },
    IconLeft: {
      Icon: <FontAwesomeIcon icon={faCircleInfo} />,
      handleClick: () => setIsInfoModalOpen(true),
      tooltip: 'Line status definitions',
      label: 'Info'
    },
    hasError: error && 'Failed to load line status',
    isLoading: isFetching || isLoading,
    Main: (
      <div className="widget-ui-main no-padding">
        <StateOverTimeCard
          hideStateCodes
          hideSubStepIds
          nestedData={toNestedData(lineAndMachinesTuple, lineName)}
          stateColors={colorMap}
          title={` `}
          isDefaultExpanded
        />
      </div>
    )
  };

  return (
    <>
      <WidgetUi {...widgetSettings} />

      <Modal
        visible={isOpenInfoModal}
        onClose={() => {
          setIsInfoModalOpen(false);
        }}
        title={t(LineGuide.title) as string}
        size={ModalSize.SMALL_AUTO_HEIGHT}
        maxWidth="30rem"
      >
        <StyledModalContentContainer>
          <Typography color={theme.colors.darkGrey} size={headingFontSize} weight="bold">
            {t(LineGuide.pemeaPna.details.running.title)}
          </Typography>
          <Typography
            color={theme.colors.darkGrey}
            mb={textSpacing}
            size={theme.typography.text.base.size}
          >
            {t(LineGuide.pemeaPna.details.running.text)}
          </Typography>

          <Typography color={theme.colors.darkGrey} size={headingFontSize} weight="bold">
            {t(LineGuide.pemeaPna.details.stopByAlarm.title)}
          </Typography>
          <Typography
            color={theme.colors.darkGrey}
            mb={textSpacing}
            size={theme.typography.text.base.size}
          >
            {t(LineGuide.pemeaPna.details.stopByAlarm.text)}
          </Typography>

          <Typography color={theme.colors.darkGrey} size={headingFontSize} weight="bold">
            {t(LineGuide.pemeaPna.details.paused.title)}
          </Typography>
          <Typography
            color={theme.colors.darkGrey}
            mb={textSpacing}
            size={theme.typography.text.base.size}
          >
            {t(LineGuide.pemeaPna.details.paused.text)}
          </Typography>

          <Typography color={theme.colors.darkGrey} size={headingFontSize} weight="bold">
            {t(LineGuide.pemeaPna.details.cleaning.title)}
          </Typography>
          <Typography
            color={theme.colors.darkGrey}
            mb={textSpacing}
            size={theme.typography.text.base.size}
          >
            {t(LineGuide.pemeaPna.details.cleaning.text)}
          </Typography>

          <Typography color={theme.colors.darkGrey} size={headingFontSize} weight="bold">
            {t(LineGuide.pemeaPna.details.idle.title)}
          </Typography>
          <Typography
            color={theme.colors.darkGrey}
            mb={textSpacing}
            size={theme.typography.text.base.size}
          >
            {t(LineGuide.pemeaPna.details.idle.text)}
          </Typography>
        </StyledModalContentContainer>
      </Modal>
    </>
  );
};

export default LineDurationChart;
