// 3rd party libraries
import React, { ReactElement, useState } from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

// Types
import { WidgetTableFormProps } from 'types/machine-health';

/* Styled components */

export const StyledTableForm = styled.form<{ isTitle?: boolean; isVertical?: boolean }>`
  align-items: ${({ isVertical }) => (isVertical ? 'start' : 'center')};
  display: flex;
  flex-grow: ${({ isTitle }) => isTitle && 1};
  flex-direction: ${({ isVertical }) => isVertical && 'column'};
  font-size: ${({ theme }) => theme.typography.components.tableHeader.size};

  gap: 1rem;
  justify-content: space-between;
  padding-right: ${({ isTitle }) => isTitle && '2rem'};
  width: 100%;
`;

export const StyledTableInput = styled.input<{ isTitle?: boolean }>`
  border-radius: 0.5rem;
  border: ${({ theme }) => theme.colors.borders.border02.border};
  color: ${(props) => props.theme.colors.table.primary};
  flex-grow: 1;
  font-size: ${({ isTitle }) => isTitle && '1rem'};
  font-weight: ${({ isTitle }) => isTitle && 'bold'};
  height: ${({ isTitle }) => (isTitle ? '3rem' : '2.25rem')};
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  transition: all 0.2s ease-in-out;
  outline: 0.125rem solid transparent;

  &:hover,
  :active,
  :focus {
    border: 0.0625rem solid ${({ theme }) => theme.colors.mediumBlue};
    outline: 0.125rem solid ${({ theme }) => theme.colors.mediumBlue3};
  }
`;

const IconHover = styled.div`
  cursor: pointer;

  svg {
    transition: all 0.3s ease-in-out;
  }

  & :hover {
    color: ${({ theme }) => theme.colors.mediumBlue};
    transition: all 0.3s ease-in-out;
  }
`;

const StyledTableFormButton = styled(IconHover)<{ isAccept?: boolean }>`
  color: ${({ isAccept, theme }) => (isAccept ? theme.colors.green : theme.colors.negativeRed)};
`;

/* End of styled components */

const TableForm = ({
  cancelCallback,
  id,
  isTitle,
  item,
  placeholder,
  submitCallback
}: WidgetTableFormProps): ReactElement => {
  const [value, setValue] = useState(item);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCallback?.(value || '');
    }
    if (e.key === 'Escape') {
      cancelCallback?.();
    }
  };

  return (
    <StyledTableForm isTitle={isTitle}>
      <StyledTableInput
        id={id}
        isTitle={isTitle}
        name={item}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <StyledTableFormButton isAccept={true}>
        <FontAwesomeIcon
          icon={faCheck}
          onClick={() => submitCallback?.(value || '')}
          type="submit"
        />
      </StyledTableFormButton>
      <StyledTableFormButton isAccept={false}>
        <FontAwesomeIcon icon={faXmark} onClick={cancelCallback} />
      </StyledTableFormButton>
    </StyledTableForm>
  );
};

export default TableForm;
