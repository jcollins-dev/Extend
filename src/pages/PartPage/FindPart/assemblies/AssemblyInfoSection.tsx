// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Typography } from 'components';

interface Props {
  title: string;
  onClickButton: () => void;
}

const Container = styled.div`
  padding: 1.25rem;
  background-color: ${theme.colors.onTrackGreen5};
`;

const StyledButton = styled(Button)`
  color: ${theme.colors.white};
  margin-top: 0.9375rem;
`;

const AssemblyInfoSection = ({ title, onClickButton }: Props): ReactElement => {
  const { t } = useTranslation(['fpns']);
  return (
    <Container>
      <Typography variant="h2" mb={'2.5625rem'}>
        {title}
      </Typography>
      <StyledButton
        onClick={onClickButton}
        color={theme.colors.white}
        bgColor={theme.colors.onTrackGreen}
        borderColor={theme.colors.onTrackGreen}
        arrow={true}
      >
        {t('open_sub_parts_diagram')}
      </StyledButton>
    </Container>
  );
};

export default AssemblyInfoSection;
