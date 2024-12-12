import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { Card } from 'components';
import Icon from '../../img/Frame.svg';
import { useTranslation } from 'react-i18next';

interface Props {
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
  icon?: ReactElement;
  // Custom header
  component?: JSX.Element;
}

const Heading = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: Roboto;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const HeadingIconContainer = styled.div`
  display: flex;
  gap: 0.313rem;
  align-items: center;
  padding-top: 1.5rem;
`;

const Content = styled.div`
  display: block;
  justify-content: space-between;
  align-items: center;
`;

const ContactCard = ({ heading, children, component }: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);

  return (
    <Card borderColor={theme.colors.mediumGrey1}>
      {component ? (
        component
      ) : (
        <>
          <Heading>{t('contact_information')}</Heading>
          <HeadingIconContainer>
            <img src={Icon} alt="Icon" />
            <Heading>{heading}</Heading>
          </HeadingIconContainer>
        </>
      )}
      <Content>{children}</Content>
    </Card>
  );
};
export default ContactCard;
