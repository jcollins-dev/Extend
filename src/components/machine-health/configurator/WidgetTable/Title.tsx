// 3rd party libraries
import React, { ReactElement } from 'react';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCircleUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';

// Components
import { Switch } from 'components';
import TableForm from './Form';

// Types
import { WidgetTableTitleProps } from 'types/machine-health';

// Context
import { useWidgetTableContext } from 'components/machine-health';

/* Styled components */

const TableTitle = styled.div``;

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

const TableTitleButtonGroup = styled(IconHover)`
  align-items: center;
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
`;

const RotateIconWrapper = styled.div<{ isExpanded?: boolean }>`
  transition: transform 0.3s ease-in-out;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(0deg)' : 'rotate(180deg)')};
`;

const IconWrapper = styled.div``;

const TableTitleRow = styled.div<{ isExpanded?: boolean }>`
  align-items: center;
  background-color: ${(props) => props.theme.colors.background.background2};
  border-bottom-left-radius: ${({ isExpanded }) => !isExpanded && '0.5rem'};
  border-bottom-right-radius: ${({ isExpanded }) => !isExpanded && '0.5rem'};
  border-bottom: ${({ theme }) => theme.colors.borders.border01.border};
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  color: ${(props) => props.theme.colors.table.primary};
  display: flex;
  font-weight: bold;
  height: 4rem;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;

  border-bottom-color: ${({ isExpanded, theme }) =>
    isExpanded ? theme.colors.disabled.dark.fill : 'transparent'};
`;

/* End of styled components */

const Title = ({
  editable,
  id,
  isExpanded,
  name,
  isEditingName,
  onExpandCallback,
  setEditRow,
  setIsDirty,
  setIsEditingName,
  toggleActive
}: WidgetTableTitleProps): ReactElement => {
  const theme = useTheme();
  const { localTableActive, setLocalTableActive, setLocalTableNames } = useWidgetTableContext();

  const handleEnableClick = () => {
    setLocalTableActive((prev) => {
      const nextActive = {
        id,
        active: !prev.find((item) => item.id === id)?.active
      };
      return [...prev.filter((item) => item.id !== id), nextActive];
    });
    setIsDirty?.(true);
  };

  const handleEditClick = () => {
    setEditRow(null);
    setIsEditingName((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditingName(false);
  };

  const handleSubmit = (value: string) => {
    // local name
    setLocalTableNames((prev) => {
      const nextName = {
        id,
        name: value
      };
      return [...prev.filter((item) => item.id !== id), nextName];
    });

    setIsDirty?.(true);
    setIsEditingName(false);
  };

  return (
    <TableTitleRow isExpanded={isExpanded}>
      {isEditingName ? (
        <TableForm
          cancelCallback={handleCancel}
          id={id}
          isTitle
          item={name}
          placeholder="Table name"
          submitCallback={handleSubmit}
        />
      ) : (
        <TableTitle>{name}</TableTitle>
      )}
      <TableTitleButtonGroup>
        {toggleActive && (
          <Switch
            onChange={handleEnableClick}
            offHandleColor={theme.colors.mediumGrey3}
            offColor={theme.colors.mediumGrey2}
            checked={!!localTableActive.find((item) => item.id === id)?.active}
            height={10}
            handleDiameter={16}
            width={30}
          />
        )}
        {editable && (
          <IconWrapper>
            <FontAwesomeIcon icon={faPen} onClick={handleEditClick} size="lg" />
          </IconWrapper>
        )}
        <RotateIconWrapper isExpanded={isExpanded}>
          <FontAwesomeIcon icon={faCircleUp} onClick={onExpandCallback} size="lg" />
        </RotateIconWrapper>
      </TableTitleButtonGroup>
    </TableTitleRow>
  );
};

export default Title;
