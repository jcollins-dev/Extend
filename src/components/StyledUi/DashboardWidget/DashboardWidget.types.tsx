import { RefObject, ReactNode } from 'react';

export interface IconLinkProps {
  Icon?: ReactNode | ReactNode[];
  label: string;
  handleClick?: () => void;
  tooltip?: string;
}

export interface RefProps {
  refMain?: RefObject<HTMLDivElement>;
  refHeader?: RefObject<HTMLDivElement>;
  refContainer?: RefObject<HTMLDivElement>;
}

export interface Props {
  refs?: RefProps;
  title?: string;
  showDateRange?: boolean; // shows date range in header
  linksToPath?: string; // links to routed path
  hasDatePicker?: boolean; // shows the calendar icon
  dayRanges?: number[]; // for date picker to show the grouped days on the side of calendar
  hasStatusIcon?: boolean; // has a status icon in the header
  hasFlyOut?: () => void; // function to load flyout
  subtractDaysCount?: number; // set if you want a custom date range for this widget, this value will count back the number of days for the widget date range
  iconLeft?: IconLinkProps; // add a custom icon with a custom link on the left of header, this is overwritten by hasStatus
  iconRight?: IconLinkProps; // add a custom icon with a custom link on the right of header this is overwritten by hasDatePicker, hasFlyOut or linksToPath
  Header?: ReactNode | ReactNode[]; // Component to load header
  SubHeader?: ReactNode | ReactNode[]; // Component to load after header
  SubTitle?: ReactNode | ReactNode[]; // Component or text to load under headline in Header
  Main?: ReactNode | ReactNode[]; // Component to load in main area (replaces childen)
  AfterMain?: ReactNode | ReactNode[]; // Copmonent to load after main area, if you want to break out of overflow
  Footer?: ReactNode | ReactNode[]; // Component to load in footer
  isLoading?: boolean; // status of data/component
  hasError?: string; // if there's an error getting data, have this set to the message, if no error, have this undefined
  isCentered?: boolean; // set if you want main wrapper to be centered
  isAdminWidget?: boolean; // set if you want to show the admin edit icon
  onAdminButtonClickCallback?: () => void; // callback for admin edit icon click
  tooltipProperties?: {
    // https://www.npmjs.com/package/rc-tooltip
    offsetX?: number; // x offset for tooltip
    offsetY?: number; // y offset for tooltip
    placement?: string; // placement of tooltip (top, bottom, left, right)
  };
  timeZone?: string; // timezone for date range
  /** Chart component or victory component that requires the width and height of main section */
  Load?: ({ width, height }: { width: number; height: number }) => JSX.Element;
}
