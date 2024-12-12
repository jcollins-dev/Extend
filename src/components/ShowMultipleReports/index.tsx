// 3rd Party
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

// Components
import BaseSelect from 'components/BaseSelect/BaseSelect';

// Api

// Types
import { SelectChangeHandler } from 'types';

const ShowMultipleReportsContainer = styled.div`
  cursor: pointer;
  position: relative;
  color: ${(props) => props.theme.colors.darkGrey};
  right: 1.125rem;
  height: 2rem;
  top: 0.25rem;
  width: 20%;
  float: right;
  margin-left: auto;
  select {
    padding-right: 2rem;
  }
`;

export interface PowerBiItem {
  machineDescription: string;
  machineId: string;
  reportId: string;
  workspaceId: string;
}

interface Props {
  powerBiList?: PowerBiItem[];
  setCurrentReport: (currentReport: string) => void;
}

const ShowMultipleReports = ({ powerBiList, setCurrentReport }: Props): ReactElement => {
  const multiReports = powerBiList
    ? powerBiList.map((report) => ({
        value: `${report.reportId}+${report.workspaceId}`,
        label: report.machineDescription
      }))
    : [];

  const [mainReport, setMainReport] = useState(multiReports[0].value);

  const onClickReportChange: SelectChangeHandler = (event): void => {
    const mainReport = typeof event.target.value === 'string' ? event.target.value : '';
    setCurrentReport(mainReport);
    setMainReport(mainReport);
  };

  return (
    <>
      <ShowMultipleReportsContainer>
        <BaseSelect
          value={mainReport}
          handleChange={onClickReportChange}
          options={multiReports}
          variant="white"
        />
      </ShowMultipleReportsContainer>
    </>
  );
};

export default ShowMultipleReports;
