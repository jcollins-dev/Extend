import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faArrowDown, faArrowUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { BaseSelect } from 'components';
import {
  CustomContentRenderer,
  CustomDropdownRenderer
} from 'components/machine-health/configurator/WidgetTable/Dropdown';

// Types
import { Order, WidgetTableDropdownItem } from 'types/machine-health/widget-table';

// Styled Components
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

const StyledContentWrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  border: ${({ theme }) => theme.colors.borders.border02.border};
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
`;

const StyledIconWrapper = styled(IconHover)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledSelectWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem;
  width: 100%;

  &.tag_select {
    align-items: start;
  }

  label {
    font-size: ${({ theme }) => theme.typography.text.bodyMediumBold.size};
    font-weight: ${({ theme }) => theme.typography.text.bodyMediumBold.weight};
    margin: 0.8rem 0 0.3rem;

    &:first-child {
      margin-top: 0;
    }
  }
`;

interface Props {
  handleDelete: (index: number) => void;
  handleOrderChange: (order: Order, index: number) => void;
  handleSetSelectValue: (index: number, tag: TagProp | undefined) => void;
  index: number;
  tag?: TagProp | undefined;
  tagList: WidgetTableDropdownItem[] | null;
  total: number;
  valuesAreSet: boolean;
}

interface TagProp {
  id?: string;
  label?: string;
  meta?: {
    data_type?: string;
  };
  name?: string;
  type?: string;
  unit?: string;
  values?: [
    {
      timestamp?: string;
      value?: number;
    }
  ];
}

const TagSelect = ({
  handleDelete,
  handleOrderChange,
  handleSetSelectValue,
  index,
  tag,
  tagList,
  total,
  valuesAreSet
}: Props): JSX.Element => {
  const [selectedTag, setSelectedTag] = useState<TagProp | undefined>(tag);

  const handleSelect = (updateValue: { name?: string; id?: string } | undefined | TagProp) => {
    const value = typeof updateValue?.id === 'object' ? updateValue?.id : updateValue;
    setSelectedTag(value);
  };

  useEffect(() => {
    handleSetSelectValue(index, selectedTag);
  }, [selectedTag]);

  const isUPdisplayed = (index: number, totalTags: number) =>
    index !== 0 && totalTags !== 1 && valuesAreSet ? true : false;
  const isDOWNdisplayed = (index: number, totalTags: number) =>
    totalTags - 1 !== index && totalTags !== 1 && valuesAreSet ? true : false;

  return (
    <StyledContentWrapper>
      <StyledIconWrapper>
        {isUPdisplayed(index, total) ? (
          <FontAwesomeIcon icon={faArrowUp} onClick={() => handleOrderChange(Order.UP, index)} />
        ) : null}
        {isDOWNdisplayed(index, total) ? (
          <FontAwesomeIcon
            icon={faArrowDown}
            onClick={() => handleOrderChange(Order.DOWN, index)}
          />
        ) : null}
      </StyledIconWrapper>
      <StyledSelectWrapper className="tag_select">
        <BaseSelect
          contentRenderer={() => (
            <CustomContentRenderer item={tag as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          disabledLabel="Tag already assigned"
          handleChangeSearch={(
            value: (TagProp | string | Record<string, unknown> | undefined)[]
          ) => {
            // We need to account for the case when value = undefined ...
            // ... which can happen when the user clears the search field
            const updateValue = value[0] as unknown as TagProp | undefined;
            return updateValue && handleSelect(updateValue);
          }}
          labelField="id"
          options={tagList as { id: string; label: string }[]}
          placeholder="Select a tag..."
          searchable
          searchBy="label" // label is assigned as friendlyName value
          value={{
            label: tag,
            id: tag,
            name: tag
          }}
          valueField="id"
        />
      </StyledSelectWrapper>
      <StyledIconWrapper>
        <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(index)} />
      </StyledIconWrapper>
    </StyledContentWrapper>
  );
};

export default TagSelect;
