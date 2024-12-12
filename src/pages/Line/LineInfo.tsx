// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Theme
import themes from 'themes';

// Components
import { KPICard, Typography } from 'components';

// Styling
const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  text-align: center;
`;

const renderer = (kpi: string, value: string) => {
  return (
    <Content>
      <Typography size="1.3125rem" weight="bold">
        {value}
      </Typography>
      <Typography size="0.8125rem" color={themes.colors.mediumGrey2}>
        {kpi}
      </Typography>
    </Content>
  );
};

const LineInfo = (): JSX.Element => {
  return (
    <KPICard heading={'Line Info'} style={{ height: '100%' }}>
      <Container>
        {/*renderer('Throughput (kg/hour)', '2,950')*/}
        {renderer('Uptime past 24hr', '70%')}
      </Container>
    </KPICard>
  );
};
export default LineInfo;
