import styled from 'styled-components';

const CTAContainer = styled.div`
  display: flex;

  > * + * {
    margin-left: 0.5rem;
  }
`;

export const CTAsRight = styled(CTAContainer)`
  justify-content: flex-end;
`;

export const CTAsStretch = styled(CTAContainer)`
  justify-content: space-between;
`;

export const IndicatorContainer = styled.div`
  margin-top: 2rem;

  > * {
    margin-left: 0;
  }
`;

export const Table = styled.table<{ mb?: string }>`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '0'};

  td {
    padding: 0.5rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;
