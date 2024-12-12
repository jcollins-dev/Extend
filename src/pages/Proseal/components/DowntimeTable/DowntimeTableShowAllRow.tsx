import React from 'react';
import styled from 'styled-components';
import { Button } from 'components';

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
`;

const StyledButtton = styled(Button)`
  justify-content: flex-start !important;
`;

type DowntimeTableShowAllRowProps = {
  displayText: string;
  onClick: () => void;
};

export const DowntimeTableShowAllRow = (props: DowntimeTableShowAllRowProps): JSX.Element => {
  return (
    <Container>
      <StyledButtton variant={'link'} onClick={props.onClick}>
        {props.displayText}
      </StyledButtton>
    </Container>
  );
};
