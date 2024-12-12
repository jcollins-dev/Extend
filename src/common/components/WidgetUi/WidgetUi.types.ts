import { ReactNode } from 'react';
import { StyledUiContainerProps } from 'components';

export interface WidgetUiPropsHasButtons {
  headerRight?: string[];
  headerLeft?: string[];
}

export interface WidgetUiProps extends StyledUiContainerProps {
  title?: ReactNode | ReactNode[];
  Header?: JSX.Element;
  Main?: JSX.Element;
  /** to keep border styled, please add className 'widget-ui__sub-header' to wrapping container of incoming component */
  SubHeader?: JSX.Element;
  Footer?: JSX.Element;
  AfterMain?: JSX.Element;
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
  children?: ReactNode | ReactNode[];
  hasButtons?: WidgetUiPropsHasButtons;
  styleType?: string;
}
