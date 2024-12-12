import styled from 'styled-components';

// Styled components
export const AddButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #0076cc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.1rem;
`;

export const DeleteGroupButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #ab091e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:before {
    content: url('/assets/imgs/icons/trash.svg');
  }
`;

export const DeleteRuleButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;
