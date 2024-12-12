// 3rd party libs
import React, { ReactElement, useState } from 'react';
import { faAngleRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, replace } from 'lodash';
import Tooltip from 'rc-tooltip';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Component
import { Value } from 'components/KPICard/CardComponents';
import { Modal, Typography, KPICardWidgetMain, WidgetUi } from 'components';

// Theme
import theme from 'themes';
import styled from 'styled-components';
import { asepticOEEGuide } from 'constants/aseptic';
import { dsiOEEGuide } from 'constants/dsi';
import { JBTRoutes } from 'constants/routes';
import { MachineAccountInfoQueryParams } from 'types/protein';
import { MachineType } from 'types/machine-health';

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

const GuideContent = styled.div`
  padding: 1.5rem;
`;

const OeeWidget = ({
  data,
  machineType,
  ga,
  isLoadingOEE = false,
  isHideTooltip = false
}: Props): ReactElement => {
  const history = useHistory();
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const OEEGuide = machineType === MachineType.DSI ? dsiOEEGuide : asepticOEEGuide;
  const renderData = (sourcedata: OeeData, oeeKpi: oeeKpi) => {
    return (
      <>
        <div className="kpi-cell__value kpi-cell__value--xl">{sourcedata[oeeKpi].value}</div>
        <div className="kpi-cell__label">{t(oeeKpi)}</div>
        <div className="kpi-cell__title">{sourcedata.period}</div>
      </>
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

  const widgetUiSettings = {
    ga,
    className: `widget-ui--kpi-card widget-ui--oee`,
    isLoading: isLoadingOEE ? true : false,
    Header: (
      <header className="widget-ui-header widget-ui-header--oee">
        <FontAwesomeIcon
          icon={faCircleInfo}
          onClick={() => {
            setInfoModalOpen(true);
          }}
        />
        <span>{data.id}</span>

        <div className="oee-header__title">{data.status}</div>
      </header>
    ),
    AfterMain: (
      <>
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
        {!isHideTooltip && (
          <div className="widget-ui-main">
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
          </div>
        )}
      </>
    ),
    Main: (
      <KPICardWidgetMain flexCols>
        <div className="kpi-cell">{renderData(data, oeeKpi.AVAILABILITY)}</div>
        <div className="kpi-cell">{renderData(data, oeeKpi.PERFORMANCE)}</div>
        <div className="kpi-cell">{renderData(data, oeeKpi.QUALITY)}</div>
      </KPICardWidgetMain>
    )
  };

  return <WidgetUi {...widgetUiSettings} />;
};

export default OeeWidget;
