// 3rd party libs
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

// Components
import { UiWidget as Ui, Icon } from '../';
import { Types } from '.';
import { Modal, Typography } from 'components';
import { ModalSize } from 'types';

// Utilities
import { timeDisplayFormatter } from './timeDisplayFormatter';
import { DateRangeProps } from '../DateRange/DateRangePicker/DateRangePicker.types';

// Constants
import { LineGuide } from 'constants/lineView';

// Theme
import theme from 'themes';

const StyledModalContentContainer = styled.div`
  padding: 0rem 3rem 1.5rem;
`;

interface Props extends Types.Props, Types.RefProps {
  handleToggleCalendar: () => void;
  onAdminButtonClickCallback?: () => void;
  linksToPathTooltipContent?: string;
  titleIndicator?: ReactNode | ReactNode[];
  showIconHelper?: boolean;
  dateRange?: DateRangeProps;
}
interface IconProps extends Types.IconLinkProps {
  left?: boolean;
  hasError?: string;
  tooltip?: string;
  tooltipProperties?: {
    offsetX?: number;
    offsetY?: number;
    placement?: string;
  };
}

const WidgetIcon = ({
  Icon,
  label,
  handleClick,
  left,
  hasError,
  tooltip,
  tooltipProperties
}: IconProps): JSX.Element => {
  const { offsetX = 0, offsetY = 0, placement = 'top' } = tooltipProperties ?? {};

  const widgetHeaderIcon = tooltip ? (
    <Tooltip
      align={{
        offset: [offsetX, offsetY]
      }}
      overlay={tooltip}
      overlayStyle={{ maxWidth: 250 }}
      placement={placement}
    >
      <Ui.Icon ga={left ? 'icon-left' : 'icon-right'}>{Icon}</Ui.Icon>
    </Tooltip>
  ) : (
    <Ui.Icon ga={left ? 'icon-left' : 'icon-right'}>{Icon}</Ui.Icon>
  );

  const widgetHeaderIconButton = tooltip ? (
    <Tooltip placement="top" overlay={tooltip}>
      <Ui.IconButton
        onClick={() => handleClick?.()}
        ariaLabel={label}
        ga={left ? 'icon-left' : 'icon-right'}
        hasError={hasError}
      >
        {Icon}
      </Ui.IconButton>
    </Tooltip>
  ) : (
    <Ui.IconButton
      onClick={() => handleClick?.()}
      ariaLabel={label}
      ga={left ? 'icon-left' : 'icon-right'}
      hasError={hasError}
    >
      {Icon}
    </Ui.IconButton>
  );

  return !handleClick ? widgetHeaderIcon : widgetHeaderIconButton;
};

export const WidgetHeader = ({
  hasError,
  isLoading,
  isAdminWidget,
  title,
  titleIndicator,
  SubTitle,
  dateRange,
  showDateRange,
  hasDatePicker,
  linksToPath,
  linksToPathTooltipContent,
  handleToggleCalendar,
  onAdminButtonClickCallback,
  hasFlyOut,
  showIconHelper,
  tooltipProperties,
  timeZone
}: Props): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation(['mh']);
  const [showMachineStateInfo, setShowMachineStateInfo] = useState<boolean>(false);

  const headingFontSize = '1rem';
  const textSpacing = '1rem';

  const triggerShowMachineStateInfo = (): void => {
    setShowMachineStateInfo(true);
  };

  const onCloseStateInfoModal = () => {
    setShowMachineStateInfo(false);
  };
  let iconRight;
  // setup header icons and links
  // date picker overrides all
  if (linksToPath && linksToPathTooltipContent) {
    iconRight = !hasError && {
      Icon: <Icon.ArrowRight />,
      label: `go to ${linksToPath}`,
      handleClick: () => history.push(linksToPath),
      tooltip: `${linksToPathTooltipContent}`
    };
  } else if (isAdminWidget && !!onAdminButtonClickCallback) {
    iconRight = !hasError && {
      Icon: <Icon.AdminEdit />,
      label: 'edit properties',
      handleClick: onAdminButtonClickCallback
    };
  } else if (hasFlyOut) {
    iconRight = !hasError && {
      Icon: <Icon.ChevRight />,
      label: 'options',
      handleClick: () => hasFlyOut()
    };
  } else if (hasDatePicker) {
    iconRight = !hasError && {
      Icon: <Icon.Calendar />,
      label: 'view calendar',
      handleClick: handleToggleCalendar
    };
  } else if (showIconHelper && linksToPathTooltipContent) {
    iconRight = {
      Icon: <Icon.InfoIcon />,
      label: 'info',
      tooltip: `${linksToPathTooltipContent}`,
      tooltipProperties
    };
  }
  // status icon, not clickable
  /* will add when icon needed
  if (hasStatusIcon)
    iconLeft = {
      Icon: <FontAwesomeIcon icon={faChartArea} />, // TODO: replace this with status component
      label: 'status'
    };
  */
  SubTitle = showDateRange
    ? `${timeDisplayFormatter({ ...dateRange, useForDisplay: true })}${
        timeZone ? ` (${timeZone})` : ''
      } `
    : SubTitle;

  return (
    <>
      {title && (
        <Ui.Title hasHeader hasTitleIndicator={titleIndicator ? true : false}>
          {titleIndicator}
          {title}{' '}
          {title === t('machine_utilization') ? (
            <FontAwesomeIcon
              icon={faCircleInfo}
              size="1x"
              style={{ cursor: 'pointer' }}
              onClick={triggerShowMachineStateInfo}
            />
          ) : (
            ''
          )}
          {SubTitle && !hasError && !isLoading && (
            <Ui.SubTitle iconType="history-clock">
              <span className="date-label">Viewing:</span> {SubTitle}
            </Ui.SubTitle>
          )}
        </Ui.Title>
      )}
      <Modal
        visible={showMachineStateInfo as boolean}
        onClose={onCloseStateInfoModal}
        title={t(LineGuide.subTitle) as string}
        size={ModalSize.SMALL_AUTO_HEIGHT}
        maxWidth="30rem"
        widthOverride="25rem"
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

      {iconRight && !hasError && !isLoading && <WidgetIcon {...iconRight} />}
    </>
  );
};
