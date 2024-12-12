// 3rd party libs
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;

const Alarms = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  return <Container>{t('alarms')}</Container>;
};

export default Alarms;
