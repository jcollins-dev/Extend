import styled from 'styled-components';

export interface Value {
  valueTitle?: string;
  value: string | React.ReactNode;
  unit?: string;
  unitSize?: string;
  unitTitle?: string;
  unitTitleColor?: string;
  status?: string;
  duration?: string;
  color?: string;
  weight?: 'normal' | 'bold' | 'medium' | undefined;
  size?: string | number | undefined;
  mb?: string | number | undefined;
  key?: string;
  values?: Value[];
  target?: boolean;
}

export const Row = styled.div.attrs(() => ({ className: 'ui-row ui-row--oee-vals' }))`
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
