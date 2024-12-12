import styled from 'styled-components';
import { default as theme } from 'themes';

export const ChevronLeftContainer = styled.div`
  float: left;
  position: absolute;
  top: 50%;
  left: 20px;
  z-index: 1;
`;
export const ChevronRightContainer = styled.div`
  float: right;
  position: absolute;
  top: 50%;
  right: 10px;
  z-index: 1;
`;

export const ChevronBox = styled.div`
  width: 1.875rem;
  height: 1.875rem;
  text-align: center;
  padding-top: 0.313rem;
  border: 0.063rem solid #0a70ff;
  border-radius: 100%;
  cursor: pointer;
  background: ${theme.colors.white};
  &:hover {
    background-color: ${({ theme }) => theme.colors.mediumBlue2};
  }
`;
