// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Icons
import { AddFileIcon } from 'icons';

// Theme
import theme from 'themes';

interface NewTemplateProps {
  onClick: () => void;
}

const NewTemplateDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.25rem 5rem 1.75rem;
  background: ${theme.colors.white};
  border-radius: 0.375rem;
  width: 32rem;
  height: 18.3125rem;
  align-items: center;
  margin: 1.25rem 0;
`;

const NewTemplateIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  width: 3.5rem;
  margin-bottom: 1.25rem;
  background: ${theme.colors.primaryBlue4};
  border: 0.625rem solid ${theme.colors.lightPurple};
  border-radius: 1.75rem;
  align-items: center;
`;

const NewTemplateTitle = styled.div`
  color: #101828;
  margin-bottom: 0.5rem;
  font-size: 1.3125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5625rem;
  letter-spacing: 0em;
  text-align: center;
`;

const NewTemplateMessage = styled.div`
  color: #667085;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6875rem;
  letter-spacing: 0em;
  text-align: center;
  margin-bottom: 1.625rem;
`;

const NewTemplateButton = styled.button`
  border: none;
  background: ${theme.colors.primaryBlue4};
  border-radius: 0.5rem;
  text-align: center;
  padding: 0.75rem 1.375rem;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 1rem;
  text-align: center;
  color: ${theme.colors.darkGrey};
`;

const NewTemplate = ({ onClick }: NewTemplateProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <NewTemplateDiv>
      <NewTemplateIconContainer>
        {(AddFileIcon as (color?: string) => JSX.Element)(theme.colors.mediumBlue)}
      </NewTemplateIconContainer>
      <NewTemplateTitle>{t('new_template')}</NewTemplateTitle>
      <NewTemplateMessage>{t('new_template_message')}</NewTemplateMessage>
      <NewTemplateButton onClick={onClick}>{t('select_properties')}</NewTemplateButton>
    </NewTemplateDiv>
  );
};

export default NewTemplate;
