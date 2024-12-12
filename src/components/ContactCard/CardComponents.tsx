import styled from 'styled-components';

export interface Value {
  value: string | React.ReactNode;
  unit: string;
  color?: string;
  weight?: 'normal' | 'bold' | 'medium' | undefined;
  size?: string | number | undefined;
  mb?: string | number | undefined;
}

export const Row = styled.div`
  display: flex;
  padding-bottom: 1.25rem;

  :first-of-type {
    padding-top: 1.25rem;
  }
`;

export const Cell = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
