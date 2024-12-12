// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VictoryBar } from 'victory';

// Components
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import { KPICard, Typography } from 'components';

// Types
import { MachineHealthKpiStatus } from 'types/machine-health';

// Helpers
import { getBorderColor, getColor } from 'helpers';

interface Props {
  title?: string;
  size?: string;
  weight?: 'bold' | 'medium' | 'normal' | undefined;
  color?: string;
  status?: string;
  height?: string;
  mb?: string;
  progressBarValue?: { value?: number | string; status: string };
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hideStatusIcon?: boolean;
  children: React.ReactNode;
}

const StyledHeader = styled.div`
  width: 100%;
  & div:first-of-type,
  h4 {
    line-height: 1.125rem;
    padding: 0;
    margin: 0;
    text-align: left;
  }
`;

const StatusIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.3125rem solid
    ${(props: Props) =>
      props && props.status === MachineHealthKpiStatus.Good
        ? theme.colors.onTrackGreen3
        : getBorderColor((props && props.status) ?? '')};
`;

const IconContainer = styled.div`
  margin-right: -1rem;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  margin-top: 1rem !important;
`;

const ProgressBarLabel = styled.span`
  width: 2rem;
  font-size: 0.75rem;
  font-weight: bold;
`;

const KPIInformationWidget = (props: Props): ReactElement => {
  const {
    title,
    size,
    weight,
    leftIcon,
    rightIcon,
    status,
    height,
    mb,
    progressBarValue,
    hideStatusIcon,
    children
  } = props;

  return (
    <>
      <KPICard
        status={status}
        height={height ? height : '13.40625rem'}
        mb={mb ? mb : '0'}
        component={
          <StyledHeader>
            <CardRow>
              <Cell>
                <Typography
                  color={getColor(status ?? MachineHealthKpiStatus.NA)}
                  size={size ?? '1rem'}
                  weight={weight ?? 'bold'}
                  mb={0}
                >
                  {leftIcon} {title}
                </Typography>
                {progressBarValue && progressBarValue.value && (
                  <ProgressBarContainer>
                    <VictoryBar
                      padding={{ top: 10, right: 10, bottom: 10, left: 0 }}
                      style={{
                        data: {
                          fill: ({ datum }) => datum.color,
                          fillOpacity: ({ datum }) => datum.y / 100
                        },
                        labels: { fontSize: 16, fontWeight: 400 }
                      }}
                      horizontal
                      barWidth={15}
                      data={[
                        { x: 'p1', y: 100, color: theme.colors.lightGrey3 },
                        {
                          x: 'p2',
                          y: progressBarValue.value,
                          color:
                            progressBarValue.status === MachineHealthKpiStatus.Good
                              ? theme.colors.onTrackGreen3
                              : getBorderColor(progressBarValue.status)
                        }
                      ]}
                      height={20}
                    />
                    <ProgressBarLabel>{progressBarValue.value}%</ProgressBarLabel>
                  </ProgressBarContainer>
                )}
              </Cell>

              {!hideStatusIcon && (
                <StatusIconContainer {...props}>
                  <FontAwesomeIcon
                    color={
                      status === MachineHealthKpiStatus.Good
                        ? theme.colors.onTrackGreen
                        : getColor(status ?? '')
                    }
                    icon={faCircle}
                    size="xs"
                  />
                </StatusIconContainer>
              )}
              <IconContainer>{rightIcon}</IconContainer>
            </CardRow>
          </StyledHeader>
        }
      >
        {children}
      </KPICard>
    </>
  );
};

export default KPIInformationWidget;
