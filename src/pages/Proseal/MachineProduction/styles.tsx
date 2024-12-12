// 3rd Party Libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import theme from 'themes';

// Components
import { ActionButton } from 'components';

export enum actionTypes {
  EXCEL = 'excel'
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.375rem 3.25rem;
`;

export const DayRangePickerContainer = styled.div`
  margin-left: auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row-reverse;
`;

export const ActionsDropdownButton = styled(ActionButton)`
  width: 5rem;
  margin-right: 1rem;
`;

export const ActionButtonStyled = styled(ActionButton)`
  width: 12rem;
  background-color: ${theme.colors.white};
  border-radius: 0;
  border: 1px solid ${theme.colors.lightGrey2};
  height: 3rem;
`;

export const ActionButtonIcon = styled(FontAwesomeIcon)`
  margin-left: 0.125rem;
  margin-top: 0.1875rem;
  margin-right: 0.55rem;
`;

export const ActionButtonListContainer = styled.div`
  position: absolute;
  right: 16.25rem;
  top: 23.5rem;
  border-radius: 2px;
  margin-right: 1rem;
  box-shadow: 0 0.0625rem 7rem 11px rgb(0 0 0 / 5%);
`;
