import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  downArrow?: boolean;
  hideArrow?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  marginTop?: string;
}

const StyledButton = styled.button`
  width: 100%;
  background: ${({ theme, disabled }) => {
    return disabled ? theme.colors.lightGrey3 : theme.colors.primaryBlue4;
  }};
  color: ${({ theme, disabled }) => {
    return disabled ? theme.colors.mediumGrey2 : theme.colors.darkGrey;
  }};
  border-radius: 0.5rem;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4375rem 0.625rem;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 18px;
  vertical-align: center;
  cursor: ${({ disabled }) => {
    return disabled ? 'not-allowed' : 'pointer';
  }};
  &:hover {
    background: ${({ theme, disabled }) => {
      return disabled ? '' : theme.colors.mediumBlue3;
    }};
  }
`;

const Label = styled.div`
  text-align: left;
`;

const ActionButton = ({
  children,
  downArrow,
  hideArrow,
  disabled,
  icon,
  marginTop = '0.1875rem',
  ...rest
}: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <StyledButton {...{ disabled: disabled, ...rest }}>
      <Label>{children}</Label>
      {icon}
      {!hideArrow && (
        <FontAwesomeIcon
          style={{ marginLeft: '0.125rem', marginTop }}
          icon={downArrow ? faCaretDown : faCaretRight}
          color={disabled ? theme.colors.mediumGrey2 : theme.colors.darkGrey}
        />
      )}
    </StyledButton>
  );
};

export default ActionButton;
