import { ReactNode, ElementType } from 'react';

// The properties for a single item in the select list
export type SelectListItemProps = Record<string, boolean>;
// The properties for a group of items in the select list
export type SelectListGroupItemProps = Record<string, SelectListItemProps>;
// The properties for a data item that is used to generate the select list
export type SelectListDataItemProps = Record<string, unknown>;

export type UseSelectListHandlerTypes =
  | 'toggleItem'
  | 'toggleGroup'
  | 'selectGroupAll'
  | 'selectGroupNone'
  | 'selectListAll'
  | 'selectListNone';
export type UseSelectListHandlerProps = (
  type: UseSelectListHandlerTypes,
  groupId: string,
  itemId?: string
) => void;

// prop types for a custom ItemContainer component.
// this will wrap the selcet list item in it's own component for
// custom styling and usage
export interface SelectListItemCustomProps {
  count?: number | undefined;
  label?: ReactNode;
  value?: ReactNode;
  isSelected?: boolean;
  i?: number;
  children?: React.ReactNode;
  handleClick?: () => void;
}

export interface SelectListGroupCustomProps {
  items: SelectListItemProps;
  label: string;
}

export type SelectListItemContainerProps = (props: SelectListItemCustomProps) => JSX.Element;
export type SelectListGroupContainerProps = (props: SelectListGroupCustomProps) => JSX.Element;

export interface SelectListBaseProps {
  className?: string;
  gridArea?: string;
  handle?: UseSelectListHandlerProps;
  // Wrapper for the Select list This is a custom wrapper only, it only accepts plain html or a styled component
  // does no provide any data so it's only used as a styled wrapper
  Container?: ElementType;
  // custom react component that uses the values of SelectListCustomProps
  // use this if you want to use your own item component
  ItemContainer?: SelectListItemContainerProps;
  // custom react component that uses the values of SelectListGroupCustomProps
  // use this if you want to use your own component to display the group/data/options
  GroupContainer?: SelectListGroupContainerProps;
}

export interface SelectListProps extends SelectListBaseProps {
  items?: SelectListItemProps;
  handleItem?: (itemId: string) => void;
}

export interface GroupSelectListProps extends SelectListBaseProps {
  items?: SelectListGroupItemProps;
  colors?: Record<string, string>;
}
