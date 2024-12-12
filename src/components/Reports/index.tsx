// 3rd party libs
import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { models, Report, Embed, service } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import { ShowMultipleReports } from 'components';
// Helpers
import { getEmbedReport } from 'helpers';

// API
import { useGetPowerBiTokenQuery } from 'api';

// Styling
const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0 1rem;

  h3 {
    font-weight: 700 !important;
  }
`;

const ReportContainer = styled.div`
  height: 100%;
  flex-grow: 1;
  margin: 1rem 1rem 0.5rem 1rem;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;

  & > div {
    height: 100%;
    width: 100%;
  }
`;

export interface UUId {
  reportId?: string;
  workspaceId?: string;
}

export interface PowerBiItem {
  machineDescription: string;
  machineId: string;
  reportId: string;
  workspaceId: string;
}

export interface reportDetails {
  reportId: string;
  workspaceId: string;
}

function createReportDetails(uuIDs: UUId): reportDetails | undefined {
  if (uuIDs.reportId && uuIDs.workspaceId) {
    return {
      reportId: uuIDs.reportId,
      workspaceId: uuIDs.workspaceId
    };
  }
}

interface Props {
  powerBiList?: PowerBiItem[];
}

const Reports = ({ powerBiList }: Props): ReactElement => {
  const initUUID = {
    reportId: powerBiList ? powerBiList[0].reportId : '',
    workspaceId: powerBiList ? powerBiList[0].workspaceId : ''
  };
  const reportDetails = createReportDetails(initUUID);
  if (!reportDetails) {
    return <div></div>;
  }
  const [currentReport, setCurrentReport] = useState<string>('');
  const [reportId, setReportId] = useState<string>(initUUID.reportId);
  const [workspaceId, setWorkspaceId] = useState<string>(initUUID.workspaceId);
  const [, /*report*/ setReport] = useState<Report>();
  const [reportConfig, setReportConfig] = useState<models.IReportEmbedConfiguration>({
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    // settings: undefined
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: true
        }
      },
      background: models.BackgroundType.Transparent
    }
  });
  const { data: accessToken, isLoading, error } = useGetPowerBiTokenQuery(undefined);

  const eventHandlersMap = new Map([
    [
      'loaded',
      function () {
        console.log('Report has loaded');
      }
    ],
    [
      'rendered',
      function () {
        console.log('Report has rendered');
      }
    ],
    [
      'error',
      function (event?: service.ICustomEvent<unknown>) {
        if (event) {
          console.error(event.detail);
        }
      }
    ]
  ]);

  const loadReport = async () => {
    if (!error && !isLoading && accessToken) {
      const report = await getEmbedReport(accessToken, reportId, workspaceId);

      setReportConfig({
        ...reportConfig,
        embedUrl: report.embedUrl,
        accessToken: report.token
      });
    }
  };

  const callReport = async () => {
    if (reportId && workspaceId) await loadReport();
  };

  useEffect(() => {
    callReport();
  }, [accessToken, reportId]);

  useEffect(() => {
    if (powerBiList) {
      setReportId(powerBiList[0].reportId);
      setWorkspaceId(powerBiList[0].workspaceId);
    }
  }, [powerBiList]);

  useEffect(() => {
    if (currentReport) {
      setReportId(currentReport.split('+')[0]);
      setWorkspaceId(currentReport.split('+')[1]);
    }
  }, [currentReport]);

  return (
    <Container>
      <ShowMultipleReports powerBiList={powerBiList} setCurrentReport={setCurrentReport} />
      <ReportContainer>
        <PowerBIEmbed
          embedConfig={reportConfig}
          eventHandlers={eventHandlersMap}
          getEmbeddedComponent={(embedObject: Embed) => {
            console.log(`Embedded object of type "${embedObject.embedtype}" received`);
            setReport(embedObject as Report);
          }}
        />
      </ReportContainer>
    </Container>
  );
};

export default Reports;
