import styled from 'styled-components';

export const SiteHeaderContainer = styled.header`
  display: flex;
  background-color: rgb(0, 118, 204);
  min-height: 60px;
  color: white;
  align-items: center;
  justify-content: center;

  a {
    display: block;
    color: white;
    padding: 0.5em;
    flx-grow: 0;
  }

  button {
    flex-grow: 0;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }
`;
