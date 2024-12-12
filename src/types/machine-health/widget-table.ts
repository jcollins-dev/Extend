import { BaseType, TableProps } from 'types';
import { ProteinMachineStateCategoryName, WidgetType } from 'types/protein';

interface DropdownItem {
  disabled?: boolean;
  id: string;
  name?: string;
  label?: string;
  order?: number;
  friendlyName?: string;
  dataType?: string;
  value?: number | string | null;
  values?: {
    value?: string | number | null;
    name?: ProteinMachineStateCategoryName | string | null;
  }[];
}

export interface WidgetTableDropdownItem extends DropdownItem {
  type: WidgetType;
}

export interface TagsDropdownItems extends DropdownItem {
  type?: WidgetType;
}

export interface AlertsTableDropdownItem extends BaseType {
  id: string;
  label?: string;
  friendlyName: string;
  language?: string;
  unitClassId?: string;
  unitClassName?: string;
  dataType?: string;
  values?: {
    value?: string | number | null;
    name?: ProteinMachineStateCategoryName | string | null;
  }[];
}

export enum Order {
  UP = 'up',
  DOWN = 'down'
}

export interface CreateNewWidgetItemProps {
  isTag?: boolean;
  parentId?: string;
  tabId: string;
  value: string;
  widgetType: WidgetType;
}

export interface WidgetRowCrudProps {
  active?: boolean;
  deleteable?: boolean;
  editable?: boolean;
  handleCopyCallback?: () => void;
  isChild?: boolean;
  isCopyTable: boolean;
  itemIds: {
    id: string;
    tabId: string;
    tagGroupId?: string;
    widgetGroupId?: string;
    widgetId?: string;
  };
  orderable?: boolean;
  setEditRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingName?: React.Dispatch<React.SetStateAction<boolean>>;
  shouldRenderTags?: boolean;
  toggleActive?: boolean;
  typeMatch?: boolean;
}

export interface WidgetTableCustomExpandIcon {
  expanded?: boolean;
  onExpand?: (
    record: Record<string, string>,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => void;
  record: Record<string, string>;
}

export interface WidgetTableDataItem extends BaseType {
  active?: boolean;
  children?: WidgetTableDataItem[] | null;
  deleteable?: boolean;
  editable?: boolean;
  id: string;
  key?: string;
  label?: string;
  members?: WidgetTableDataItem[] | null;
  name?: string;
  tags?: WidgetTableDropdownItem[] | null;
  tagsZones?: string;
  toggleActive?: boolean;
  widgetClass?: string;
  widgetType?: WidgetType;
}

export interface LineViewWidgetTableDataItem extends BaseType {
  active?: boolean;
  children?: WidgetTableDataItem[] | null;
  deleteable?: boolean;
  editable?: boolean;
  id: string;
  key?: string;
  label?: string;
  members?: WidgetTableDataItem[] | null;
  name?: string;
  tags?:
    | string[]
    | { setPoint: string | undefined; tag: string | undefined }[]
    | WidgetTableDropdownItem[]
    | LineViewWidgetTableDropdownItem[];
  tagsZones?: string;
  toggleActive?: boolean;
  widgetClass?: string;
  widgetType?: WidgetType;
}

export interface LineViewWidgetTableDropdownItem {
  disabled?: boolean;
  id?: string;
  name?: string;
  label?: string;
  order?: number;
  unit?: string;
  meta?: {
    data_type?: string;
  };
  type?: string;
  values?: {
    value?: string | number | null;
    name?: ProteinMachineStateCategoryName | string | null;
    timestamp?: string;
  }[];
}

export interface WidgetTableFormProps {
  cancelCallback?: () => void;
  id: string;
  isTitle?: boolean;
  item?: string;
  placeholder?: string;
  submitCallback?: (value: string) => void;
}

export interface WidgetTableProps extends TableProps {
  copyTable?: {
    copyWidgetType?: WidgetType;
    handleCopyCallback?: (item: WidgetTableDataItem) => void;
    isCopyTable?: boolean;
  };
  data?: WidgetTableDataItem[] | null;
  displayOnlyRows?: WidgetTableDataItem[] | null;
  hideCrudButtons?: boolean;
  parent: WidgetTableDataItem;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
  shouldRenderTags: boolean; //determine if tags are displayed as children
  tags?: WidgetTableDropdownItem[] | null;
}

export interface WidgetTableTitleProps {
  editable?: boolean;
  id: string;
  isExpanded?: boolean;
  name: string;
  isEditingName: boolean;
  onExpandCallback?: () => void;
  setEditRow: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingName: React.Dispatch<React.SetStateAction<boolean>>;
  toggleActive?: boolean;
}

export interface TableRowProps {
  actions: {
    props: {
      itemIds: {
        id: string;
        tabId?: string;
        widgetGroupId?: string;
        widgetId?: string;
      };
    };
  };
  id: string;
  name: string;
  values?: {
    value?: string;
    name?: ProteinMachineStateCategoryName | string;
  }[];
  widgetType: WidgetType;
}
