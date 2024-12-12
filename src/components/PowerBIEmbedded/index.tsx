// 3rd party
import React, { useState } from 'react';
import styled from 'styled-components';
import { models, Report, Embed, service } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';

// Helpers
import { getEmbedReport } from 'helpers';

// Components
import { Button, Input, Flyout, Typography } from 'components';

// Types
import { ChangeEvent } from 'types';

// API
import { useGetPowerBiTokenQuery } from 'api';

// Styling
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: ${(props) => props.theme.colors.darkBlue};
  height: 3.4375rem;

  & > * {
    margin: 0.75rem;
    color: ${(props) => props.theme.colors.white};
  }
`;

const ReportContainer = styled.div`
  height: 100%;
  flex-grow: 1;

  & > div {
    height: 100%;
    width: 100%;
  }
`;

const StatusTextContainer = styled.div`
  color: ${(props) => props.theme.colors.black};
  text-align: center;
`;

const FlyoutContainer = styled.div`
  padding: 0.75rem;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  & > input {
    margin-bottom: 0.75rem;
  }
`;

const UIContainer = styled.div`
  width: 100%;

  & button {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

const ButtonContainer = styled(UIContainer)`
  text-align: center;
  display: flex;
  justify-content: center;
`;

const CtaButtonContainer = styled.div`
  width: 9.375rem;
`;

interface ReportDetails {
  reportId: string;
  workspaceId: string;
}

const defaultReportDetails = {
  reportId: '',
  workspaceId: ''
};

// Root Component to demonstrate usage of wrapper component
function PowerBIEmbedded(): JSX.Element {
  const [flyoutIsOpen, setFlyoutIsOpen] = useState<boolean>(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails>(defaultReportDetails);
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
        setMessage('The report is loading');
      }
    ],
    [
      'rendered',
      function () {
        console.log('Report has rendered');
        setMessage('The report is rendered');
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
      const report = await getEmbedReport(
        accessToken,
        reportDetails.reportId,
        reportDetails.workspaceId
      );
      setMessage('The access token is successfully set. Loading the Power BI report');

      setReportConfig({
        ...reportConfig,
        embedUrl: report.embedUrl,
        accessToken: report.token
      });
    } else {
      setMessage('⚠️ - issues generating access token');
    }
  };

  const handleClose = () => {
    setReportDetails(defaultReportDetails);
    setFlyoutIsOpen(false);
  };

  const handleRequestReport = async () => {
    if (reportDetails.reportId && reportDetails.workspaceId) await loadReport();
    handleClose();
  };

  const [displayMessage, setMessage] = useState(
    `The report is bootstrapped. Click the Retrieve a Report button to get started.`
  );

  return (
    <Container>
      <Header>
        <Typography variant="h2" color="white">
          Power BI Reports
        </Typography>
      </Header>
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
      <StatusTextContainer>
        <Typography variant="h3">{displayMessage}</Typography>
      </StatusTextContainer>
      <ButtonContainer>
        <CtaButtonContainer>
          <Button variant="primary" onClick={() => setFlyoutIsOpen(true)}>
            Retrieve a Report
          </Button>
        </CtaButtonContainer>
      </ButtonContainer>
      <Flyout width="22.5rem" visible={flyoutIsOpen} onClose={handleClose}>
        <FlyoutContainer>
          <Typography variant="h2">Report details</Typography>
          <UIContainer>
            <InputContainer>
              <Input
                type="text"
                placeholder="Report ID"
                onChange={(event: ChangeEvent) => {
                  const val = event.target.value as string;
                  setReportDetails({ ...reportDetails, reportId: val });
                }}
              />
              {/*
                TODO - Get list of workspaces for user to select, only when
                we can associate a user to a given workspace (do not want to
                reveal one customer's stuff ot another)
              */}
              <Input
                type="text"
                placeholder="Workspace ID"
                onChange={(event: ChangeEvent) => {
                  const val = event.target.value as string;
                  setReportDetails({ ...reportDetails, workspaceId: val });
                }}
              />
            </InputContainer>
            <Button
              variant="primary"
              onClick={handleRequestReport}
              disabled={!reportDetails.reportId || !reportDetails.workspaceId}
            >
              Request Report
            </Button>
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
          </UIContainer>
        </FlyoutContainer>
      </Flyout>
    </Container>
  );
}

export default PowerBIEmbedded;
