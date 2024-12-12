import React from 'react';
import {
  GroupSelectListProps,
  SelectListProps,
  UseSelectListHandlerProps,
  SelectListItemProps
} from './SelectList.types';
import { ToggleContainer } from '../ToggleContainer';
import { SelectListItems } from './SelectList';
import { ColorCircle, SelectListContainer } from './SelectList.elements';
import { CountGroupSelectReturnProps } from './helpers/countGroupSelectItems';

interface GroupProps extends SelectListProps {
  label: string; // The label or groupKey value of the group
  handle?: UseSelectListHandlerProps; // The handler function to update the selected items,
  colors?: Record<string, string>;
  counter?: CountGroupSelectReturnProps;
}

const Group = ({ label, items, handle, colors, counter, ...rest }: GroupProps) => {
  // Count the number of selected items in the group
  const count =
    counter && counter[label]
      ? Object.values(counter[label]).reduce((acc, x) => (acc = x ? acc + Number(x) : acc), 0)
      : 0;
  // Check if none of the items are selected
  const noneSelected = !items
    ? true
    : Object.values(items).filter((x) => x).length == 0
    ? true
    : false;
  // Handler function to update the selected items
  const handleItem = (itemId: string) => handle?.('toggleItem', label, itemId);
  // Get color associated with group
  const color = colors?.[label.toLowerCase()];
  // Header component for the group, includes a checkbox to select/deselect all items in the group
  const Header = (
    <>
      <ColorCircle {...{ color }} className="group-header__color" />
      <div className="group-header__label">
        {label} <span className="group-header__count">{`(${count})`}</span>
      </div>
    </>
  );
  // the checkbox that appears before the toogle group header
  // this is done separate so if the user clicks a group checkbox,
  // the items don't expand or collapse (like they would if you clicked on the label)
  const HeaderBefore = (
    <input
      type="checkbox"
      checked={!noneSelected}
      onChange={() => handle?.(noneSelected ? 'selectGroupAll' : 'selectGroupNone', label)}
    />
  );
  return (
    <ToggleContainer
      title={Header}
      className="select-list-group"
      closed
      HeaderBefore={HeaderBefore}
    >
      <SelectListItems
        {...{
          items: items as SelectListItemProps,
          handleItem,
          count: !counter ? undefined : counter[label],
          ...rest
        }}
      />
    </ToggleContainer>
  );
};

export const GroupSelectLists = ({
  items,
  Container,
  className,
  ...rest
}: GroupSelectListProps): JSX.Element => {
  // Set the default container to div
  Container = Container || SelectListContainer;

  const cachedItems = items;

  // Create a list of group components
  const Groups =
    cachedItems &&
    Object.entries(cachedItems).map(([label, groupItems]) => (
      <Group key={label} {...{ label, items: groupItems, ...rest }} />
    ));

  return (
    <Container className={`select-list${className ? ` ${className} ` : ` `}select-list--group`}>
      {Groups}
    </Container>
  );
};
