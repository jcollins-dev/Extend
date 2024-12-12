// 3rd party libs
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { faCaretDown, faCaretRight, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { Button } from 'components';

// Types
import { MasterTagListVersion } from 'types/machine-management';

// Helpers
import { formatDate } from 'helpers';
import { JBTRoutes } from 'constants/routes';

// Styling
interface RowProps {
  isHeader?: boolean;
  expanded?: boolean;
}

const Row = styled.div<RowProps>`
  width: 100%;
  display: flex;
  height: ${(props) => (props.expanded ? 'auto' : '4.25rem')};
  min-height: 4.25rem;
  transition: height 0.5s;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightGrey3};
  padding: 0.875rem 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const LabelRow = styled(Row)`
  background-color: ${(props) => props.theme.colors.lightGrey2};
  height: 3.625rem;

  div {
    font-weight: 700;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  overflow: hidden;
  padding: 0 0.75rem;
`;

const ArrowCell = styled(Cell)`
  width: 2.625rem;
  svg {
    cursor: pointer;
  }
`;

const DateCell = styled(Cell)`
  width: 6.8125rem;
`;

const VersionCell = styled(Cell)`
  width: 4.5rem;
`;

const DetailsCell = styled(Cell)`
  width: 9.875rem;
`;

const ButtonCell = styled(Cell)`
  width: 6.8125rem;
`;

const ActiveButton = styled(Button)`
  padding: 0.3125rem 0.5rem;
  font-weight: 500;
  line-height: 1.125rem;
`;

const PreviewButton = styled(Button)`
  padding: 0.3125rem 0.5rem;
  font-weight: 500;
  line-height: 1.125rem;
  border: none;
`;

interface VersionRowProps {
  isHeader?: boolean;
  versionDetails?: MasterTagListVersion;
}

const VersionRow = ({ isHeader, versionDetails }: VersionRowProps): JSX.Element => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<boolean>(false);
  const editVersion = () => {
    window.location.replace(
      `${JBTRoutes.machineMasterTagListDashBoard}?mtlId=${
        versionDetails?.masterTagListId || ''
      }&versionId=${versionDetails?.id || ''}`
    );
  };
  const mostRecentversion = () => {
    window.location.replace(
      `${JBTRoutes.machineMasterTagListDashBoard}?mtlId=${versionDetails?.masterTagListId || ''}`
    );
  };
  const row = isHeader ? (
    <LabelRow>
      <ArrowCell />
      <DateCell>Date</DateCell>
      <VersionCell>Version</VersionCell>
      <DetailsCell>Details</DetailsCell>
      <ButtonCell />
    </LabelRow>
  ) : (
    <Row expanded={expanded}>
      <ArrowCell>
        <FontAwesomeIcon
          icon={expanded ? faCaretDown : faCaretRight}
          fontSize="1.25rem"
          onClick={() => setExpanded(!expanded)}
        />
      </ArrowCell>
      <DateCell>
        {versionDetails
          ? versionDetails?.updatedAt
            ? formatDate(versionDetails.updatedAt, 'short')
            : formatDate(versionDetails.createdAt, 'short')
          : ''}
      </DateCell>
      <VersionCell>{versionDetails ? versionDetails.version : ''}</VersionCell>
      <DetailsCell>{versionDetails ? versionDetails.description : ''}</DetailsCell>
      <ButtonCell>
        {versionDetails && versionDetails.active ? (
          <ActiveButton
            onClick={mostRecentversion}
            bgColor={theme.colors.onTrackGreen}
            variant="primary"
            width="5.1875rem"
            style={{ border: 'none' }}
          >
            Current
          </ActiveButton>
        ) : (
          <PreviewButton
            bgColor={theme.colors.primaryBlue4}
            width="5.1875rem"
            onClick={editVersion}
          >
            Preview
            <FontAwesomeIcon
              style={{ marginLeft: '0.3125rem' }}
              icon={faChevronRight}
              color={theme.colors.black}
            />
          </PreviewButton>
        )}
      </ButtonCell>
    </Row>
  );

  return row;
};

export default VersionRow;
