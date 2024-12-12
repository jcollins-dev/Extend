// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Components
import { KPICard, Typography } from 'components';

// Utils
import DataRenderer from '../../machine-health/DataRenderer';
import { mockContactInfo } from 'constants/testdata';
import { Clipboard } from './Clipboard';

// Types
import { ContactInfo } from 'types/protein';

// Styling
const Content = styled.div`
  padding: 1.25rem;
`;

const Info = styled.td(({ theme }) => ({
  verticalAlign: 'top',
  padding: '0.5rem',
  '& > p': { color: theme.colors.darkGrey },
  '& > div > div': { color: theme.colors.mediumBlue, cursor: 'pointer' }
}));

const Icons = styled.div`
  display: flex;
  gap: 1rem;
`;

const contactInfoRenderer = (info: ContactInfo) => {
  const { name, role, phone, email } = info;
  return (
    <Info key={`${name}-${phone}-${email}`}>
      <Typography mb={'0.5rem'}>{name}</Typography>
      <Typography>{role}</Typography>
      <Icons>
        <Clipboard data={phone}>
          <FontAwesomeIcon icon={faPhone} />
        </Clipboard>
        <Clipboard data={email}>
          <FontAwesomeIcon icon={faEnvelope} />
        </Clipboard>
      </Icons>
    </Info>
  );
};

const LabelRenderer = (label: string) => {
  return (
    <Info>
      <Typography weight="bold">{label}</Typography>
    </Info>
  );
};

const Contact = (): JSX.Element => {
  const { jbt, customer } = mockContactInfo;
  return (
    <KPICard heading="Site information">
      <DataRenderer isLoading={false} error={undefined}>
        <Content>
          <table>
            <tbody>
              <tr>
                {LabelRenderer('JBT contact')}
                {jbt.map(contactInfoRenderer)}
              </tr>
              <tr>
                {LabelRenderer('Customer contact')}
                {customer.map(contactInfoRenderer)}
              </tr>
            </tbody>
          </table>
        </Content>
      </DataRenderer>
    </KPICard>
  );
};

export default Contact;
