// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Pill, Typography } from 'components';
import { DataRenderer } from 'components/machine-health';

// Types
import { MachineHealthTabs, TopLevelTabs } from 'types/protein';

// Hooks
import { useConfiguredSubNav } from 'hooks';

interface Props {
  parentSection?: MachineHealthTabs;
  baseUrl: string;
  showMe?: boolean;
  labels?: TopLevelTabs[];
  slugMap?: Record<string, string>;
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

/**
 * Renders configured navigation tabs.
 */
const ConfiguredSubNav = ({
  baseUrl,
  labels,
  slugMap,
  parentSection,
  showMe
}: Props): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation(['mh']);
  const { isLoading, error, tabs } = useConfiguredSubNav(parentSection, labels, slugMap);

  const isActive = (subRoute: string) => location.pathname.includes(`${baseUrl}/${subRoute}`);

  return (
    <DataRenderer width="auto" isLoading={isLoading} error={error && 'Failed to load sub pages'}>
      <Container>
        {showMe && (
          <Typography color="mediumBlue" mb={0} weight="bold">
            {t('show_me')}:
          </Typography>
        )}

        {tabs?.map((tab, index) => {
          const showName = (tab.label?.split('_').length as number) > 2 ? true : false;
          return (
            <Pill
              onClick={() => history.push(`${baseUrl}/${tab.slug}`)}
              key={`${tab.id}-${index}`}
              selected={isActive(tab.slug)}
            >
              {showName ? tab.name : t(tab.label as string)}
            </Pill>
          );
        })}
      </Container>
    </DataRenderer>
  );
};

export default ConfiguredSubNav;
