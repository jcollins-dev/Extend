import React from 'react';
import {
  SelectListProps,
  SelectListItemProps,
  SelectListItemContainerProps,
  SelectListItemCustomProps
} from './SelectList.types';
import { SelectListWrapper } from './ListWrapper';
import { CountGroupSelectItemProps } from './helpers/countGroupSelectItems';

// This component renders a selectable list using the provided props
export const SelectList = ({
  items,
  className,
  gridArea,
  ItemContainer, // optional custom component to display each item in the list
  Container, // optional custom component to wrap the entire list
  handleItem // function that handles when an item in the list is clicked
}: SelectListProps): JSX.Element => {
  // if there are no items, return an empty element
  if (!items) return <></>;
  // otherwise, render the list inside a wrapper component, passing in any provided custom components and the handleItem function
  return (
    <SelectListWrapper {...{ Container, className, gridArea }}>
      <SelectListItems {...{ items: items as SelectListItemProps, ItemContainer, handleItem }} />
    </SelectListWrapper>
  );
};

// Props for SelectListItems component
interface SelectListItemsProps {
  items: SelectListItemProps; // the items to display in the list
  handleItem?: (id: string) => void; // function that handles when an item in the list is clicked
  ItemContainer?: SelectListItemContainerProps; // optional custom component to display each item in the list
  count?: CountGroupSelectItemProps; // the number of items for each category (itemkey)
}

// This component renders the individual items in the SelectList component
export const SelectListItems = ({
  items,
  handleItem,
  ItemContainer, // optional custom component to display each item in the list
  count
}: SelectListItemsProps): JSX.Element => {
  // This component renders each item in the list

  const Item = ({ label, isSelected, i }: SelectListItemCustomProps) => {
    // If no label is provided, return an empty element
    if (!label) return <></>;
    // Determine the appropriate class name based on whether or not the item is selected
    const className = `select-list-item${isSelected ? ` select-list-item--is-selected` : ``}`;
    // Render the item with a checkbox, label, and optional counter
    return (
      <li className={`${className} select-list-item--index-${i}`}>
        <label onClick={() => handleItem?.(label as string)}>
          <input name={label as string} type="checkbox" defaultChecked={isSelected} />
          <span className="select-list-item__label">{label}</span>
          {count && (
            <span className="select-list-item_counter">{`(${count[label as string]})`}</span>
          )}
        </label>
      </li>
    );
  };

  // Map over the items and render either the custom ItemContainer or the default Item component for each item in the list
  const Items = Object.entries(items).map(([label, isSelected], i) =>
    ItemContainer ? (
      <ItemContainer
        key={label}
        {...{ label, isSelected, i: i + 1, handleClick: () => handleItem?.(label) }}
      />
    ) : (
      <Item key={label} {...{ label, isSelected, i: i + 1 }} />
    )
  );
  // Render the list of items
  return <ul className="select-list-items">{Items}</ul>;
};
