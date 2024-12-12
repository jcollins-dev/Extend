import styled from 'styled-components';

export const HeaderButtonContainer = styled.button.attrs(() => ({
  type: 'button'
}))`
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon-calendar {
    path {
      stroke: #0a70ff !important;
    }
  }
`;
