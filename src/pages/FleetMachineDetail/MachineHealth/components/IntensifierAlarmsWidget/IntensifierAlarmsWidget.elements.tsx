import styled from 'styled-components';

export const IntensifierAlarmsTableContainer = styled.table`
  width: 100%;

  th {
    text-align: left;
  }

  td,
  th {
    padding: 0.6em 1em 0.6em 0;
  }

  tbody td {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }

  .auto {
    width: max-content;
  }

  .full {
    width: auto;
  }
`;
