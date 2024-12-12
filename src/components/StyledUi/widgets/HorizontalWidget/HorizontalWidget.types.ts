import { ReactNode } from 'react';

export interface HorizontalWidgetProps {
  title?: string;
  subTitle?: string;
  Main?: ReactNode;
  className?: string;
  gridArea?: string;
  SubHeader?: ReactNode | ReactNode[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  hasOverflow?: boolean;
}
