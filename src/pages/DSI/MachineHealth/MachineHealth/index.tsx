// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Column, Row } from 'components';
import { MachineModesGraphWidget } from 'components/machine-health/linear-filler';
import { dsiMachineModesWidgetData } from 'constants/testdata/dsi';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

const MachineHealth = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  return (
    <Container>
      <Row>
        <Column size={12}>
          <MachineModesGraphWidget
            title={t('machine_state') as string}
            data={dsiMachineModesWidgetData}
          />
        </Column>
      </Row>
    </Container>
  );
};

export default MachineHealth;
