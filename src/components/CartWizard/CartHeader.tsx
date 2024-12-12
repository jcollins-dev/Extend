// 3rd party
import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'react-i18next';
// Components
import { Typography, ArrowButtonBar } from 'components';

// Styling
const Header = styled.div`
  background-color: ${(props) => props.theme.colors.lightGrey2};
  width: 100%;
  height: 9.25rem;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-top-left-radius: 0.625rem;
  border-top-right-radius: 0.625rem;

  h2 {
    font-weight: bold;
    line-height: 1.5625rem;
    margin-bottom: 0.625rem;
  }
`;
const WarnMessage = styled.div``;
interface StepProps {
  header: string;
  description: string;
}

interface Props {
  stepHeaders: StepProps[];
  displayItemLossWarning: boolean;
  displayDraftQuoteWarning: boolean;
}
const CartHeader = ({
  stepHeaders,
  displayItemLossWarning,
  displayDraftQuoteWarning
}: Props): ReactElement => {
  const theme = useTheme();
  const { activeStep, goToStep } = useWizard();
  const { t } = useTranslation(['fpns']);
  const handlePress = (index: number) => {
    if (index < activeStep) {
      goToStep(index);
    }
  };

  const buttonContents = (i: number) => {
    return (
      <Typography variant="stepheading">
        {t(stepHeaders[i].header, { ns: ['fpns', 'common'] })}
      </Typography>
    );
  };

  return (
    <>
      <Header>
        <Typography variant="h2">
          {t(stepHeaders[activeStep].header, { ns: ['fpns', 'common'] })}
        </Typography>
        <Typography variant="helper" mb="0.0625rem">
          {t(stepHeaders[activeStep].description, { ns: ['fpns', 'common'] })}
        </Typography>
        {displayItemLossWarning && (
          <WarnMessage>
            <Typography color={theme.colors.darkRed} weight="medium" size="0.625rem" as="span">
              {t('cart_warning_message')}
            </Typography>
          </WarnMessage>
        )}
        {displayDraftQuoteWarning && (
          <WarnMessage>
            <Typography color={theme.colors.darkRed} weight="medium" size="0.625rem" as="span">
              {t('cart_warning_message_draft')}
            </Typography>
          </WarnMessage>
        )}
      </Header>

      <ArrowButtonBar
        numButtons={stepHeaders.length}
        activeButton={activeStep}
        handlePress={handlePress}
        buttonContents={buttonContents}
      />
    </>
  );
};

export default CartHeader;
