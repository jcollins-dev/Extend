import styled from 'styled-components';

export const FilterSelectedDemoContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 1em;
  overflow: hidden;
  height: 100%;

  .demo-col-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 400px;
    grid-gap: inherit;
    border-bottom: solid 1px black;
    padding-bottom: 1em;
    overflow: hidden;
  }

  .demo-data-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: inherit;
    overflow: hidden;
  }

  .data-holder {
    overflow: hidden;
    font-size: 0.8em;
  }

  .item {
    padding-bottom: 4px;
    margin-bottom: 4px;
    border-bottom: dotted 1px rgba(0, 0, 0, 0.2);
  }

  .demo-col {
    overflow-x: auto;
  }
`;
