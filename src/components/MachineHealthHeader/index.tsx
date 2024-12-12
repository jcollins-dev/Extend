import React from 'react';
import styled from 'styled-components';
import { Indicator, Typography } from 'components';

interface Props {
  heading: string;
  alertMessage?: string;
  alertColor: string;
  charts: React.ReactNode;
  pb?: string;
}

const HeaderContainer = styled.div<{ pb?: string }>`
  display: flex;
  flex-direction: row;
  padding: 0 3.15625rem 3.15625rem 3.15625rem;
  ${({ pb }) => pb && `padding-bottom: ${pb};`}
  justify-content: space-between;
  background: linear-gradient(
    0deg,
    ${(props) => props.theme.colors.lightGrey2} 0%,
    rgba(241, 243, 244, 0) 100%
  );
`;

const TitlesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlertContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const AlertMessageContainer = styled.div`
  padding-top: 0.25rem;
`;

const IndicatorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const MachineHealthHeader = ({
  heading,
  alertMessage,
  alertColor,
  charts,
  pb
}: Props): JSX.Element => (
  <HeaderContainer pb={pb}>
    <TitlesContainer>
      <Typography variant="h1">{heading}</Typography>
      {alertMessage && (
        <AlertContainer>
          <StyledIndicator color={alertColor} />
          <AlertMessageContainer>
            <Typography mb={0} size="1.125rem" weight="bold" color={alertColor}>
              {alertMessage}
            </Typography>
          </AlertMessageContainer>
        </AlertContainer>
      )}
    </TitlesContainer>
    <IndicatorsContainer>{charts}</IndicatorsContainer>
  </HeaderContainer>
);

export default MachineHealthHeader;
