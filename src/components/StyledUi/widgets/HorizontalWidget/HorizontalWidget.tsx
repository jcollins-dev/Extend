import React, { ReactNode } from 'react';

import { HorizontalWidgetProps } from './HorizontalWidget.types';
import { HorizontalWidgetContainer } from './HorizontalWidget.elements';
import { StyledLoader } from 'components/StyledUi/elements/StyledLoader';

import {
  DimensionsContainer,
  DimensionsContainerReturnProps
} from 'components/StyledUi/DimensionsContainer';

interface Props extends HorizontalWidgetProps {
  children?: ReactNode | ReactNode[];
  Chart?: DimensionsContainerReturnProps;
}

const LoaderSection = ({ isLoading, children, hasError, hasMessage }: Props): JSX.Element => {
  return hasError ? (
    <div className="horizontal-widget-main is-centered status--error">{hasError}</div>
  ) : isLoading ? (
    <div className="horizontal-widget-main is-centered">
      <StyledLoader />
    </div>
  ) : hasMessage ? (
    <div className="horizontal-widget-main is-centered">{hasMessage}</div>
  ) : (
    <>{children}</>
  );
};

export const HorizontalWidget = ({
  className,
  children,
  Chart,
  subTitle,
  title,
  gridArea,
  isLoading,
  hasError,
  hasMessage,
  hasOverflow
}: Props): JSX.Element => {
  className = className ? `${className} horizontal-widget` : `horizontal-widget`;

  if (hasOverflow) className = `${className} has-overflow`;

  return (
    <HorizontalWidgetContainer {...{ className, gridArea }}>
      <header className="horizontal-widget-header">
        <h2>{title}</h2>
        {subTitle && <div className="horizontal-widget-header__sub-title">{subTitle}</div>}
      </header>
      <LoaderSection {...{ isLoading, hasError, hasMessage }}>
        {children && <div className="horizontal-widget-main">{children}</div>}
        {Chart && (
          <DimensionsContainer
            className="horizontal-widget-main"
            Component={(props) => <Chart {...props} />}
          />
        )}
      </LoaderSection>
    </HorizontalWidgetContainer>
  );
};
