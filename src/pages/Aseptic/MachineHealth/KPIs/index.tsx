// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

const KPIs = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  return <Container>{t('kpis')}</Container>;
};

export default KPIs;
