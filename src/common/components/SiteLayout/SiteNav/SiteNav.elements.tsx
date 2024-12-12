import styled from 'styled-components';

export const SiteNavContainer = styled.nav`
  background-color: rgb(229, 233, 237);
  width: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  justify-content: center;
  font-size: 0.9em;

  .site-nav-main {
    width: 200px;
  }

  .site-nav-main-item {
    display: grid;
    grid-template-columns: 25px 1fr;
    padding: 1em 0.5em;
    gap: 0.1em;
    text-align: left;
    width: 100%;
    background-color: transparent;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #c2c2c6;
  }
`;
