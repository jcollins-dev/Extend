// 3rd party libs
import { ReactNode } from 'react';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';

export interface WidgetUiIconProps extends StyledUiContainerProps {
  Icon: ReactNode | ReactNode[];
  handleClick?: () => void;
  tooltip?: string;
  label?: string;
}

export interface WidgetUiProps extends StyledUiContainerProps {
  Header?: ReactNode | ReactNode[];
  AfterMain?: ReactNode | ReactNode[];
  Footer?: ReactNode;
  /* good, bad, ok, success, warning, error */
  hasStatus?: string;
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  IconLeft?: WidgetUiIconProps;
  IconRight?: WidgetUiIconProps;
  /** gets put directly into grid-area-main.  if you're using Main, make sure the containing div
   * has grid-area: main; this is good to load things outside of the overflow and with custom styling.
   */
  Main?: ReactNode | ReactNode[];
  /** div section under header section */
  SubHeader?: ReactNode | ReactNode[];
  /** component or string or number for display in h3 tag but underneath as a styled sub */
  SubTitle?: ReactNode | ReactNode[];
  title?: string | HTMLElement;
  /** grid area */
  ga?: string;
  styleType?: string;
}
