// 3rd party
import React, { ReactElement } from 'react';
import _ from 'lodash';
import { faAngleRight, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';

// Components
import { DashboardWidget, Loader, Typography } from 'components';
import { MachineVisionKpiItem } from 'types/machine-vision';
import theme from 'themes';
import KPISmallCard from 'components/KPI/KPISmallCard';
import { Cell, Row } from 'components/KPICard/CardComponents';

interface Props {
  isLoading?: boolean;
  KPIData: {
    average: MachineVisionKpiItem | undefined;
    target?: MachineVisionKpiItem | undefined;
    weight?: MachineVisionKpiItem | undefined;
  };
  precision?: {
    average?: number;
    target?: number;
    weight?: number;
  };
}

// Styling
const StyledIcon = styled(FontAwesomeIcon)`
  margin-left: 1rem;
`;
const StyledArrowIcon = styled(FontAwesomeIcon)`
  margin-left: 0.3125rem;
`;

const Container = styled.div`
  width: 100%;
`;
const CardContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;

  &:first-child {
    width: 55%;
  }

  &:last-child {
    width: 45%;
  }
`;
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .ui_widget {
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: #c2c2c6;
  }

  .ui-widget__main {
    padding: 0;
    border: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;

    & > div {
      padding: 0;

      & > div {
        align-items: center;
        padding: 0;
        width: 100%;

        & > div:first-child {
          height: 100%;
          display: flex;
          align-items: center;
          background: ${theme.colors.lightGrey1};
        }

        & > div:last-child {
          flex-direction: row;
          justify-content: center;
          align-items: center;
          p {
            margin: 0;
          }
        }

        & > div {
          padding: 0 1em;
        }
      }
    }
  }
`;

const numberToFixed = (
  number: number | undefined,
  precision: number | undefined
): number | undefined => {
  return typeof precision === 'number' && number ? Number(number.toFixed(precision)) : number;
};

const KPISmallPanel = ({ isLoading, KPIData, precision }: Props): ReactElement => {
  const averageValue = numberToFixed(KPIData.average?.value?.value, precision?.average);
  const weightValue = numberToFixed(KPIData.weight?.value?.value, precision?.weight);
  const targetValue = numberToFixed(KPIData.target?.value?.value, precision?.target);

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : (
        <StyledContainer>
          {KPIData.weight ? (
            <KPICard
              cardTitle={`${KPIData.weight.id}`}
              measurement={`${KPIData.weight.unit}`}
              value={weightValue}
              valueUnit={`${KPIData.weight.unit}`}
            />
          ) : (
            <div style={{ height: '6.625rem' }}></div>
          )}
          {KPIData.target && (
            <KPICard
              cardTitle={`${KPIData.target.id}`}
              measurement={`${KPIData.target.unit}`}
              value={targetValue}
              valueUnit={`${KPIData.target.unit}`}
            />
          )}
          {KPIData?.average && (
            <KPICard
              cardTitle={`${KPIData.average.id}`}
              measurement={`${KPIData.average.unit}`}
              value={averageValue}
              valueUnit={`${KPIData.average.unit}`}
            />
          )}
        </StyledContainer>
      )}
    </Container>
  );
};

export default KPISmallPanel;

interface KPICardProps {
  cardTitle: string;
  measurement: string;
  value?: number;
  valueUnit: string;
}

export const KPICard = ({
  cardTitle,
  measurement,
  value,
  valueUnit
}: KPICardProps): JSX.Element => {
  const theme = useTheme();

  const cardData = (
    <KPISmallCard height="6.625rem">
      <Row>
        <CardContentContainer>
          <Cell>
            <Typography
              color="darkGrey"
              size="0.8125rem"
              mb="0.3125rem"
              style={{ textAlign: 'left', marginTop: '0.3125rem' }}
            >
              {cardTitle}
            </Typography>
            <Typography
              color="mediumGrey2"
              size="0.8125rem"
              mb="0.3125rem"
              style={{ textAlign: 'left' }}
            >
              {measurement}
            </Typography>
          </Cell>
          <StyledIcon color={theme.colors.darkGrey} icon={faAngleRight} />
        </CardContentContainer>
        <CardContentContainer>
          <Typography
            color={theme.colors.darkGray3}
            size={`${theme.typography.components.groupHeader.size}`}
            weight="bold"
          >
            {value?.toLocaleString()} {_.replace(valueUnit, '(day)', '')}
          </Typography>
          <StyledArrowIcon color={theme.colors.darkGray3} icon={faArrowUp} />
        </CardContentContainer>
      </Row>
    </KPISmallCard>
  );

  const widgetSettings = {
    Main: cardData
  };

  return <DashboardWidget {...widgetSettings} />;
};
