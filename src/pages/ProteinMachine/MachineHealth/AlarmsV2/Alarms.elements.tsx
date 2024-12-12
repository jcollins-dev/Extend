import styled from 'styled-components';

export const AlarmsViewContainer = styled.div`
  padding: 1em;
  grid-gap: 1em;
  display: grid;
  grid-template-rows: auto 1fr;

  .alarms-view__date-picker {
    display: flex;
    justify-content: flex-end;
  }
`;
