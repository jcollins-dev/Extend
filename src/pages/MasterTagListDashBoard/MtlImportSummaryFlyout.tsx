// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { Flyout, FlyoutHeader, KPICard, Typography } from 'components';

// Types
import { MtlAttrError, TagListRowStatus, WipTagListRowData } from 'types/machine-management';

// Styling
const FlyoutContentWrapper = styled.div`
  height: 100vh;
`;

const OuterContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 1.25rem;
`;

const OverviewCard = styled(KPICard)`
  width: 100%;
  height: auto;
`;

const OverviewContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 1.25rem;
`;

const OverviewItemContainer = styled.div`
  height: auto;
  width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface OverviewItemNumberProps {
  status?: TagListRowStatus;
}
const OverviewItemNumber = styled.div<OverviewItemNumberProps>`
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 2.625rem;
  text-align: center;
  color: ${({ status, theme }) =>
    status === TagListRowStatus.Error
      ? theme.colors.negativeRed
      : status === TagListRowStatus.Valid
      ? theme.colors.onTrackGreen
      : theme.colors.black};
`;

const OverviewItemSubheading = styled.div`
  font-weight: normal;
`;

const ErrorsContainer = styled.div`
  width: 100%;
`;

const ErrorList = styled(KPICard)`
  width: 100%;
  height: calc(100vh - 19.9375rem);
`;

const ErrorRow = styled.tr`
  display: flex;
  height: 4.625rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey4};

  &:last-child {
    border-bottom: none;
  }
`;

const LabelRow = styled(ErrorRow)`
  height: 3.125rem;
  background-color: ${(props) => props.theme.colors.lightGrey2};
`;

interface ErrorCellProps {
  width: string;
}
const ErrorCell = styled.td<ErrorCellProps>`
  width: ${({ width }) => width};
  padding: 1.25rem 1rem;

  text-transform: capitalize;
  overflow: hidden;
  align-items: center;
  word-wrap: break-word;
  button {
    padding: 0;
  }
`;
const LabelCell = styled.th<ErrorCellProps>`
  width: ${({ width }) => width};
  padding: 1.25rem 1rem;
  text-align: left;
  text-overflow: ellipsis;
`;

interface IndividualError {
  row: number;
  rowLabel: string;
  errorDetails: MtlAttrError;
}
interface Props {
  onClose: () => void;
  visible: boolean;
  importData: WipTagListRowData[];
  onErrorSelect?: (rowNumber: number) => void;
}
const MtlImportSummaryFlyout = ({ onClose, visible, importData }: Props): JSX.Element => {
  const theme = useTheme();

  const totalTags = importData.length;
  const totalErrorRows = importData.reduce(
    (accum, current) => accum + (current.rowStatus === TagListRowStatus.Error ? 1 : 0),
    0
  );
  const totalValidRows = importData.reduce(
    (accum, current) => accum + (current.rowStatus === TagListRowStatus.Valid ? 1 : 0),
    0
  );
  let flattenedErrors: IndividualError[] = [];
  importData.forEach((rowData) => {
    if (rowData.errorMessage && rowData.errorMessage.length > 0) {
      const relatedDataItem = importData.find((item) => item.row === rowData.row);
      const rowLabel =
        relatedDataItem && relatedDataItem.data.omniblu_tag_name
          ? (relatedDataItem.data.omniblu_tag_name as string)
          : `Row ${rowData.row + 1}`;
      const individualErrorMessages: IndividualError[] = rowData.errorMessage.map(
        (errorMessage) => ({
          errorDetails: errorMessage,
          row: rowData.row,
          rowLabel: (rowData.data.master_tag_name as string) || rowLabel
        })
      );
      flattenedErrors = flattenedErrors.concat(individualErrorMessages);
    }
  });
  return (
    <Flyout width="33.125rem" visible={visible} onClose={onClose}>
      <FlyoutContentWrapper>
        <FlyoutHeader
          heading="Import Results"
          bgColor={theme.colors.lightGrey2}
          onClose={onClose}
        />
        <OuterContainer>
          <OverviewCard heading="Overall">
            <OverviewContent>
              <OverviewItemContainer>
                <OverviewItemNumber>{totalTags}</OverviewItemNumber>
                <OverviewItemSubheading>Tags in File</OverviewItemSubheading>
              </OverviewItemContainer>
              <OverviewItemContainer>
                <OverviewItemNumber status={TagListRowStatus.Error}>
                  {totalErrorRows}
                </OverviewItemNumber>
                <OverviewItemSubheading>Tags with Errors</OverviewItemSubheading>
              </OverviewItemContainer>
              <OverviewItemContainer>
                <OverviewItemNumber status={TagListRowStatus.Valid}>
                  {totalValidRows}
                </OverviewItemNumber>
                <OverviewItemSubheading>Valid</OverviewItemSubheading>
              </OverviewItemContainer>
            </OverviewContent>
          </OverviewCard>
          <ErrorsContainer>
            <Typography variant="h3">Errors</Typography>
            <ErrorList>
              <table>
                <tbody>
                  <LabelRow>
                    <LabelCell width="50%">Master Tag</LabelCell>
                    <LabelCell width="50%">Error Message</LabelCell>
                  </LabelRow>
                  {flattenedErrors.map((error, i) => (
                    <ErrorRow key={i}>
                      <ErrorCell width="50%">{error.rowLabel}</ErrorCell>
                      <ErrorCell width="50%">{`${error.errorDetails.columnName
                        .replaceAll('_', ' ')
                        .toLowerCase()} - ${error.errorDetails.errorMessage}`}</ErrorCell>
                    </ErrorRow>
                  ))}
                </tbody>
              </table>
            </ErrorList>
          </ErrorsContainer>
        </OuterContainer>
      </FlyoutContentWrapper>
    </Flyout>
  );
};

export default MtlImportSummaryFlyout;
