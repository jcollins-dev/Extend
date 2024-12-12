import React, { ReactNode, useState } from 'react';
import { SelectListContainer } from './SelectLists.elements';

export interface SelectListSelectedItemProps {
  [key: string]: { [id: string]: boolean };
}

export interface SelectListGroupsCounterProps {
  [key: string]: { [items: string]: number };
}

export interface SelectListProps {
  items: SelectListSelectedItemProps;
  className?: string;
  gridArea?: string;
  listType?: string;
  showGroupOptions?: boolean;
  counter?: SelectListGroupsCounterProps;
  handle?: (type: string, groupId?: string, itemId?: string) => void;
}

export const SelectGroupsList = ({
  items,
  listType,
  showGroupOptions,
  counter,
  handle
}: SelectListProps): JSX.Element => {
  const Items = Object.entries(items).map(([groupId, items], i) => {
    return (
      <ListGroup
        key={i}
        i={i + 1}
        label={groupId}
        groupSelects={items}
        {...{ groupId, items: Object.keys(items), handle, listType, showGroupOptions }}
        counter={counter && counter[groupId]}
      />
    );
  });
  return <SelectListContainer>{Items}</SelectListContainer>;
};

interface ListGroupProps {
  label: string;
  groupId: string;
  items: string[];
  groupSelects: { [id: string]: boolean };
  handle?: (type: string, groupId?: string, itemId?: string) => void;
  listType?: string;
  showGroupOptions?: boolean;
  i?: number;
  counter?: { [items: string]: number };
}

export const ListGroup = ({
  label,
  groupId,
  items,
  groupSelects,
  handle,
  listType,
  showGroupOptions,
  counter
}: ListGroupProps): JSX.Element => {
  // count the number of items
  const selectedCounter = Object.values(groupSelects);

  const groupTotalResults =
    counter && Object.values(counter).reduce((acc, val) => (acc = acc + val), 0);

  // count the number of selected items
  const ct = selectedCounter.filter((x) => x).length;

  // do the math
  const allSelected = selectedCounter.length == ct;
  const noneSelected = ct < 1;
  const hasSelected = !noneSelected && !allSelected;

  const [open, setOpen] = useState<boolean | undefined>(false);

  const Items = (): JSX.Element => (
    <>
      {items.map((itemId, i) => (
        <ListGroupItem
          count={counter && counter[itemId]}
          isCustom={listType === 'custom'}
          key={itemId + i}
          label={groupId}
          value={itemId}
          handleClick={() => handle?.('toggleItem', groupId, itemId)}
          isSelected={groupSelects[itemId]}
          i={i + 1}
        />
      ))}
    </>
  );

  const GroupOptions = (): JSX.Element => (
    <div className="select-list-group-options">
      {(hasSelected || noneSelected) && (
        <button
          type="button"
          className="select-list-group-options__btn select-list-group-options__btn--all"
          onClick={() => [setOpen(false), handle?.('selectGroupAll', groupId)]}
        >
          select all
        </button>
      )}
      {(hasSelected || allSelected) && (
        <button
          type="button"
          className="select-list-group-options__btn select-list-group-options__btn--none"
          onClick={() => [setOpen(false), handle?.('selectGroupNone', groupId)]}
        >
          select none
        </button>
      )}
    </div>
  );

  const isOpen = open === undefined || open ? true : false;

  //const handleGroupSelect = (checked: boolean) => checked ? handle('selectGroupAll', groupId) : handle('selectGroupNone', groupId);

  const ListContainer = ({ children }: { children: ReactNode }) =>
    listType === 'cusom' ? (
      <div className="select-list-group-items">{children}</div>
    ) : listType !== 'ul' ? (
      <ol className="select-list-group-items">{children}</ol>
    ) : (
      <ul className="select-list-group-items">{children}</ul>
    );

  return (
    <div className={`select-list-group ${isOpen ? `select-list-group--is-open` : ``}`}>
      <div className="select-list-group-header">
        <input
          type="checkbox"
          onChange={() => handle?.(!allSelected ? 'selectGroupAll' : 'selectGroupNone', groupId)}
          checked={hasSelected || allSelected ? true : false}
        />
        <span className="select-list-group-header__label" onClick={() => setOpen(!open)}>
          {label}
        </span>
        [{groupTotalResults}]
        {/*<IcoChevRight className='select-list-group-header__icon' size='md' />*/}
      </div>

      {showGroupOptions && <GroupOptions />}

      <ListContainer>
        <Items />
      </ListContainer>
    </div>
  );
};

interface ListGroupItemProps {
  label: string;
  isSelected: boolean;
  handleClick: () => void;
  isCustom?: boolean;
  value?: string;
  i: number;
  count?: number;
}
const ListGroupItem = ({
  isCustom,
  //label,
  value,
  isSelected,
  handleClick,
  count
}: //i
ListGroupItemProps) => {
  const ItemContainer = ({ children }: { children: ReactNode }) =>
    isCustom ? (
      <div className="select-list-group-item">{children}</div>
    ) : (
      <li className="select-list-group-item">{children}</li>
    );

  return (
    <ItemContainer>
      <label>
        <input type="checkbox" onChange={() => handleClick()} checked={isSelected} />
        <span className="select-list-group-item__label">
          {value} [{count}]
        </span>
      </label>
    </ItemContainer>
  );
};
