// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Components
import { Flyout, FlyoutHeader } from 'components';
import { default as VersionRow } from './VersionRow';

// API
import { useGetTagListVersionsByMtlIdQuery } from 'api';

// Styling
const OuterContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 1.25rem;
`;
const VersionsContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey3};
`;

interface Props {
  masterTagListId?: string;
  onClose: () => void;
}
const VersionHistoryFlyout = ({ masterTagListId, onClose }: Props): JSX.Element => {
  const theme = useTheme();
  const { data: versions } = useGetTagListVersionsByMtlIdQuery(masterTagListId || skipToken);
  const sortedVersions = versions
    ? versions.map((version) => version).sort((a, b) => (a.version < b.version ? 1 : -1))
    : [];
  return (
    <Flyout width="33.125rem" visible={!!masterTagListId} onClose={onClose}>
      <FlyoutHeader heading="Version History" bgColor={theme.colors.lightGrey2} onClose={onClose} />
      <OuterContainer>
        <VersionsContainer>
          <VersionRow isHeader={true} />
          {versions
            ? sortedVersions.map((version) => (
                <VersionRow versionDetails={version} key={version.id} />
              ))
            : undefined}
        </VersionsContainer>
      </OuterContainer>
    </Flyout>
  );
};

export default VersionHistoryFlyout;
