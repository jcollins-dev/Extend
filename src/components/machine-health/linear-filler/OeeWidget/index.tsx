// 3rd party libs
import React, { ReactElement, useState } from 'react';
import { faAngleRight, faCircle, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, replace } from 'lodash';
import Tooltip from 'rc-tooltip';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Component
import { Cell, Row as CardRow, Value } from 'components/KPICard/CardComponents';
import { Column, KPICard, Modal, Row, Typography } from 'components';

// Theme
import theme from 'themes';
import styled from 'styled-components';
import { asepticOEEGuide } from 'constants/aseptic';
import { dsiOEEGuide } from 'constants/dsi';
import { JBTRoutes } from 'constants/routes';
import { MachineAccountInfoQueryParams } from 'types/protein';
import { MachineType } from 'types/machine-health';

// hooks
import { DataRenderer } from 'components/machine-health';

export type OeeData = {
  id: string;
  status: string;
  period: string;
  availability: Value;
  performance: Value;
  quality: Value;
};

export enum oeeKpi {
  AVAILABILITY = 'availability',
  PERFORMANCE = 'performance',
  QUALITY = 'quality'
}

type Props = {
  machineType?: MachineType.Aseptic | MachineType.DSI | undefined;
  height?: string;
  data: OeeData;
  isLoadingOEE: boolean;
  isHideGuide?: boolean;
  isHideTooltip?: boolean;
  ga?: string;
};

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

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.3125rem solid ${theme.colors.darkGrey};
`;

const StyledStatus = styled(Typography)`
  margin-left: -0.9375rem;
`;

interface GaProps {
  ga?: string;
}
const StyledOeeWidget = styled.div<GaProps>`
  width: 100%;
  margin-top: ${({ ga }) => !ga && '1rem'};
  grid-area: ${({ ga }) => ga};
`;

const ClickableCell = styled(Cell)`
  cursor: pointer;
`;

const ClickableItem = styled.span`
  cursor: pointer;
`;

const GuideContent = styled.div`
  padding: 1.5rem;
`;
const OeeWidget = ({
  data,
  machineType,
  ga,
  isLoadingOEE = false,
  isHideGuide = false,
  isHideTooltip = false
}: Props): ReactElement => {
  const history = useHistory();
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const OEEGuide = machineType === MachineType.DSI ? dsiOEEGuide : asepticOEEGuide;
  const renderData = (sourcedata: OeeData, oeeKpi: oeeKpi) => {
    return (
      <ClickableCell>
        <Typography
          className="kpi-card__value"
          mb={sourcedata[oeeKpi].mb ?? '0.625rem'}
          size={sourcedata[oeeKpi].size ?? '1.3125rem'}
          color={sourcedata[oeeKpi].color ?? 'darkGrey'}
          weight={'bold'}
        >
          {sourcedata[oeeKpi].value}
        </Typography>
        <Typography mb={0} color="darkGrey" size="0.8125rem" weight="bold">
          {t(oeeKpi)}
        </Typography>
        <Typography mb="0.4375rem" color="mediumGrey2" size="0.8125rem">
          {sourcedata.period}
        </Typography>
      </ClickableCell>
    );
  };
  const renderGuide = (text: string, linkText: string, link: string) => {
    return (
      <>
        {!isEmpty(text) && (
          <>
            <Typography size="0.75rem" color={theme.colors.darkGrey}>
              {text}
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              as="h4"
              weight="bold"
              color={theme.colors.darkGrey}
              onClick={() => {
                if (!isEmpty(link)) {
                  history.push(link);
                }
              }}
            >
              {linkText} <FontAwesomeIcon color={theme.colors.darkGrey} icon={faAngleRight} />
            </Typography>
          </>
        )}
      </>
    );
  };
  const [isOpenInfoModal, setInfoModalOpen] = useState(false);
  const guideUrl = '/assets/imgs/guide.jpg';
  return (
    <DataRenderer isLoading={isLoadingOEE}>
      <StyledOeeWidget ga={ga}>
        <Modal
          visible={isOpenInfoModal}
          onClose={() => {
            setInfoModalOpen(false);
          }}
        >
          <GuideContent>
            <Typography size="1.125rem" color="darkGrey" weight="bold">
              {t(OEEGuide.details.overall.title)}
            </Typography>
            <Typography color="darkGrey" size="0.8125rem" mb="1rem">
              {t(OEEGuide.details.overall.text)}
            </Typography>
            <Typography size="1rem" color="darkGrey" weight="bold">
              {t(OEEGuide.details.availability.title)}
            </Typography>
            <Typography color="darkGrey" size="0.8125rem" mb="1rem">
              {t(OEEGuide.details.availability.text)}
            </Typography>
            <Typography size="1rem" color="darkGrey" weight="bold">
              {t(OEEGuide.details.performance.title)}
            </Typography>
            <Typography color="darkGrey" size="0.8125rem" mb="1rem">
              {t(OEEGuide.details.performance.text)}
            </Typography>
            <Typography color="darkGrey" size="1rem" weight="bold">
              {t(OEEGuide.details.quality.title)}
            </Typography>{' '}
            <Typography color="darkGrey" size="0.8125rem" mb="1rem">
              {t(OEEGuide.details.quality.text)}
            </Typography>
            {machineType !== MachineType.DSI && <img src={guideUrl} alt="guide" />}
          </GuideContent>
        </Modal>
        <KPICard
          className="kpi-card--oee-widget"
          component={
            <StyledHeader>
              <CardRow>
                <Cell>
                  <CardRow>
                    <Cell>
                      <Typography color="darkGrey" size="0.8125rem" mb="0.625rem">
                        {data.id}{' '}
                        {!isHideGuide && (
                          <ClickableItem>
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              onClick={() => {
                                setInfoModalOpen(true);
                              }}
                            />
                          </ClickableItem>
                        )}
                      </Typography>
                      <Row>
                        <Column size={1}>
                          {machineType === MachineType.DSI && (
                            <StyledIconContainer>
                              <FontAwesomeIcon
                                color={theme.colors.darkGrey}
                                icon={faCircle}
                                size="xs"
                              />
                            </StyledIconContainer>
                          )}
                        </Column>
                        <Column size={11}>
                          <StyledStatus
                            color={theme.colors.darkGrey}
                            size="1.25rem"
                            weight="bold"
                            mb="0.3125rem"
                          >
                            {data.status}
                          </StyledStatus>
                        </Column>
                      </Row>
                    </Cell>
                  </CardRow>
                </Cell>
                <Cell />
              </CardRow>
            </StyledHeader>
          }
        >
          <CardRow>
            {isHideTooltip ? (
              <>
                <>{renderData(data, oeeKpi.AVAILABILITY)}</>
                <>{renderData(data, oeeKpi.PERFORMANCE)}</>
                <>{renderData(data, oeeKpi.QUALITY)}</>
              </>
            ) : (
              <>
                <Tooltip
                  overlayClassName="information-tooltip"
                  placement="top"
                  trigger={'click'}
                  overlay={
                    <span>
                      {renderGuide(
                        OEEGuide.indications.availability.text,
                        OEEGuide.indications.availability.linkText,
                        replace(JBTRoutes.machineHealthChangeOver, ':machineId', machineId)
                      )}
                    </span>
                  }
                  overlayStyle={{
                    width: '18rem',
                    fontSize: '0.75rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '0.875rem',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    backgroundColor: theme.colors.lightGrey1
                  }}
                >
                  {renderData(data, oeeKpi.AVAILABILITY)}
                </Tooltip>
                <Tooltip
                  overlayClassName="information-tooltip"
                  placement="top"
                  visible={false}
                  overlay={
                    <span>
                      {' '}
                      {renderGuide(
                        OEEGuide.indications.performance.text,
                        OEEGuide.indications.performance.linkText,
                        replace(JBTRoutes.machineHealthAlarms, ':machineId', machineId)
                      )}
                    </span>
                  }
                  overlayStyle={{
                    width: '18rem',
                    fontSize: '0.75rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '0.875rem',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    backgroundColor: theme.colors.lightGrey1
                  }}
                >
                  {renderData(data, oeeKpi.PERFORMANCE)}
                </Tooltip>
                <Tooltip
                  overlayClassName="information-tooltip"
                  placement="top"
                  visible={false}
                  overlay={
                    <span>
                      {renderGuide(
                        OEEGuide.indications.quality.text,
                        OEEGuide.indications.quality.linkText,
                        // the route is TBD
                        ''
                      )}
                    </span>
                  }
                  overlayStyle={{
                    width: '18rem',
                    fontSize: '0.75rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '0.875rem',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    backgroundColor: theme.colors.lightGrey1
                  }}
                >
                  {renderData(data, oeeKpi.QUALITY)}
                </Tooltip>
              </>
            )}
          </CardRow>
        </KPICard>
      </StyledOeeWidget>
    </DataRenderer>
  );
};

export default OeeWidget;
