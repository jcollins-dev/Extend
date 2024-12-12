import React from 'react';
import styled from 'styled-components';
import {
  faTriangleExclamation,
  faCircleQuestion,
  faRotate,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Loader, Typography } from 'components';
import { default as theme } from 'themes';
import {
  useGetDiagramNoErpQuery,
  useGetDiagramNoImageQuery,
  useGetDiagramZeroPriceQuery
} from 'api';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { DataQualityInImage } from 'types/machine-management';
import saveAs from 'file-saver';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { JBTRoutes } from 'constants/routes';
import { useUpdateMachineOnboardingStatusMutation } from 'api';

const Container = styled.div`
  margin: 2rem 2rem 0rem 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 1rem;
`;

const Section = styled.div`
  max-height: 30rem;
  border: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-radius: 0.625rem;
  width: 33%;
  overflow-y: auto;
`;

const Title = styled.div`
  padding: 2rem 1rem 2rem 1rem;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  background-color: ${(props) => props.theme.colors.lightGrey1};
  text-align: center;

  h2 {
    margin: 0;
  }

  p {
    margin-top: 0.875rem;
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const Message = styled.div`
  padding: 0.625rem 1rem 0.625rem 1rem;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  display: flex;

  svg {
    margin-top: 0.1rem;
    margin-right: 0.4rem;
  }

  p {
    margin: 0;
  }
`;

const Row = styled.div`
  padding: 0.625rem 1rem 0.625rem 1rem;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  display: flex;

  :last-of-type {
    border: none;
  }

  p {
    margin: 0;
  }

  div {
    :first-of-type {
      width: 60%;
    }

    :last-of-type {
      width: 40%;
    }
  }
`;

const TopButtonsContainer = styled.div`
  width: 100%;
  margin-right: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    margin: 1rem;
    max-width: 20%;
  }
`;

const ButtonsContainer = styled.div`
  width: 100%;
  margin-right: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;

  button {
    margin: 1rem;
    max-width: 20%;

    svg {
      margin-right: 0.4rem;
    }
  }
`;

const dataText = {
  table1: {
    h2: 'Parts in diagram but not in ERP',
    message:
      'Compare part numbers ingested into OmniBlu with part numbers in ERP. Update part #’s number as appropriate to match ERP on previous screen.'
  },
  table2: {
    h2: 'Parts in diagram with “Contact JBT for Price”',
    message:
      'Check ERP flags to ensure applicable parts are active in customer portal and price is visible.'
  },
  table3: {
    h2: 'Parts in diagram without photos',
    message: 'Upload photos for photos missing parts. Ensure photo names match ERP part number.'
  }
};

export const DataQualityCheck = ({ machineId }: { machineId: string }): JSX.Element => {
  const history = useHistory();
  const goToPillars = (machineId: string) => {
    history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
  };
  const [updateMachineOnboardingStatus] = useUpdateMachineOnboardingStatusMutation();
  const {
    data: noErpData,
    isFetching: noErpFetching,
    refetch: noErpRefetch
  } = useGetDiagramNoErpQuery(
    machineId === ''
      ? skipToken
      : {
          machineId: machineId
        }
  );

  const {
    data: zeroPriceData,
    isFetching: zeroPriceFetching,
    refetch: zeroPriceRefetch
  } = useGetDiagramZeroPriceQuery(
    machineId === ''
      ? skipToken
      : {
          machineId: machineId
        }
  );

  const {
    data: noImageData,
    isFetching: noImageFetching,
    refetch: noImageRefetch
  } = useGetDiagramNoImageQuery(
    machineId === ''
      ? skipToken
      : {
          machineId: machineId
        }
  );

  function downloadQualityCheckCSV() {
    function SKUOrEmpty(list: DataQualityInImage[], index: number): string {
      if (index >= list.length) {
        return '';
      }
      return list[index].sku || '';
    }

    if (
      !noErpFetching &&
      !zeroPriceFetching &&
      !noImageFetching &&
      noErpData &&
      zeroPriceData &&
      noImageData
    ) {
      const numEntries = Math.max(noErpData.length, zeroPriceData.length, noImageData.length);
      const csv: BlobPart[] = [];
      csv.push(
        ',Parts in diagram but not in ERP,Parts in diagram with “Contact JBT for Price”,Parts in diagram without photos,\n'
      );
      csv.push(
        `Part number with Issues,${SKUOrEmpty(noErpData, 0)},${SKUOrEmpty(
          zeroPriceData,
          0
        )},${SKUOrEmpty(noImageData, 0)}\n`
      );
      for (let i = 1; i < numEntries; i++) {
        csv.push(
          `,${SKUOrEmpty(noErpData, i)},${SKUOrEmpty(zeroPriceData, i)},${SKUOrEmpty(
            noImageData,
            i
          )}\n`
        );
      }

      saveAs(new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }), `qa_check.csv`);
    } else {
      toast.error(`Please wait for all data to finish loading`);
    }
  }

  return (
    <div>
      <Container>
        {noErpFetching ? (
          <Loader margin="auto" />
        ) : (
          noErpData && (
            <TableSection dataText={dataText.table1} warnings={noErpData.length} data={noErpData} />
          )
        )}
        {zeroPriceFetching ? (
          <Loader margin="auto" />
        ) : (
          zeroPriceData && (
            <TableSection
              dataText={dataText.table2}
              warnings={zeroPriceData.length}
              data={zeroPriceData}
            />
          )
        )}
        {noImageFetching ? (
          <Loader margin="auto" />
        ) : (
          noImageData && (
            <TableSection
              dataText={dataText.table3}
              warnings={noImageData.length}
              data={noImageData}
            />
          )
        )}
      </Container>
      {noErpFetching || zeroPriceFetching || noImageFetching ? (
        <Loader margin="auto" />
      ) : (
        <>
          <ButtonsContainer>
            <Button
              variant="primary"
              onClick={() => {
                noErpRefetch();
                zeroPriceRefetch();
                noImageRefetch();
              }}
            >
              <FontAwesomeIcon icon={faRotate} />
              Refresh Lists
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                downloadQualityCheckCSV();
              }}
            >
              <FontAwesomeIcon icon={faDownload} />
              Download CSV
            </Button>
          </ButtonsContainer>
          <TopButtonsContainer>
            <Button
              onClick={() => {
                goToPillars(machineId);
              }}
            >
              Save & Exit
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await updateMachineOnboardingStatus({
                  machineId: machineId,
                  diagramsStatus: 'Done'
                })
                  .unwrap()
                  .then(() => {
                    toast.success(`Status of diagram onboarding updated successfully`);
                    goToPillars(machineId);
                  })
                  .catch((error) => {
                    toast.error(
                      `Failed to update the diagram status for the current machine${
                        error?.data?.detail ? `: ${error.data.detail}` : ''
                      }`
                    );
                    goToPillars(machineId);
                  });
              }}
            >
              Submit Final
            </Button>
          </TopButtonsContainer>
        </>
      )}
    </div>
  );
};

export const TableSection = ({
  dataText,
  warnings,
  data
}: {
  dataText: { h2: string; message: string };
  warnings: number;
  data: DataQualityInImage[];
}): JSX.Element => {
  return (
    <Section>
      <Title>
        <Typography variant="h2">{dataText.h2}</Typography>
        <Typography variant="modelheading">
          <FontAwesomeIcon icon={faTriangleExclamation} color={theme.colors.negativeRed} />
          {warnings} Issues
        </Typography>
      </Title>
      <Message>
        <FontAwesomeIcon icon={faCircleQuestion} />
        <Typography variant="body2">{dataText.message}</Typography>
      </Message>
      {data.map((dataQualityInImage, i) => {
        return (
          <Row key={i}>
            <div>
              <Typography variant="body2">
                {dataQualityInImage.partDescription || dataQualityInImage.description}
              </Typography>
            </div>
            <div>
              <Typography variant="body2">{dataQualityInImage.sku}</Typography>
            </div>
          </Row>
        );
      })}
    </Section>
  );
};
