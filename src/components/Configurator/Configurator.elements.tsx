import styled from 'styled-components';

interface ConfiguratorPageProps {
  className?: string;
}

export const Configurator = styled.section<ConfiguratorPageProps>`
  &.configurator {
    .no_config__page-view {
      padding: 1.5em 2.5em 1.5em 3.2em;
    }
  }
`;
