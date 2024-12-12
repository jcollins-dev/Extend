import React, { ReactNode } from 'react';
import { StyledLoader } from 'components/StyledUi/elements/StyledLoader';
import { WidgetUiProps } from './WidgetUi.types';
import { WidgetUiContainer, baseClass } from 'common/ui/WidgetUi.elements';
import { WidgetUiHeaderButtons } from './WidgetUiHeaderButtons';

export const WidgetUi = ({
  children,
  className,
  Footer,
  hasError,
  SubHeader,
  hasMessage,
  Header,
  isLoading,
  Main,
  title,
  hasButtons,
  styleType
}: WidgetUiProps): JSX.Element => {
  // define starting class
  className = className ? `${baseClass} ${className}` : `${baseClass}`;
  // start adding classes
  if (isLoading) className += `  is-loading`;
  if (hasMessage) className += ` has-message`;
  if (hasError) className += ` has-error`;
  if (styleType === 'v1') className += ` style-type--v1`;

  // check if there is a header
  let headerProps: Record<string, unknown> | undefined = undefined;
  // compbine header props to pass to header component
  if (Header || title || hasButtons) headerProps = { title, hasButtons, Header };
  // establesh main grid row that is full height
  let gridRows = `1fr`;
  // add header grid row
  if (headerProps) gridRows = `auto ${gridRows}`;
  // add SubHeader grid row
  // this appears below the header and above the main content
  // and is outside the scrolling overflow
  if (SubHeader) gridRows = `auto ${gridRows}`;
  // add footer grid row
  if (Footer) {
    gridRows = `${gridRows} auto`;
    className = `${className} has-footer`;
  }
  // define base settings
  const settings = {
    className,
    gridRows
  };
  // make a wrapper component that have the basics
  // to avoice rewriting the same code over and over
  const WidgetWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <WidgetUiContainer {...settings}>
        {headerProps && <WidgetHeader {...headerProps} />}
        {SubHeader}
        {children}
        {Footer}
      </WidgetUiContainer>
    );
  };

  // return early if data isn't ready or there are problems
  if (isLoading || hasMessage || hasError) {
    return (
      <WidgetWrapper>
        <div className={`${baseClass}__main`}>{hasError || hasMessage || <StyledLoader />}</div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      {
        // Main would be used if you want to style your own containing div.
        // make sure this component has a className of widget-ui__main to be
        // position correctly, and to get border styles.
        // you can also use grid-area: main; to position it in the grid for no styling
        Main
      }
      {
        // children render in the main section with styling and auto-scrolling
        children && <div className={`${baseClass}__main has-padding`}>{children}</div>
      }
    </WidgetWrapper>
  );
};

const WidgetHeader = ({ title, hasButtons }: WidgetUiProps) => {
  return (
    <header className={`${baseClass}__header`}>
      <h2>{title}</h2>
      {hasButtons?.headerRight &&
        hasButtons.headerRight.map((type) => (
          <WidgetUiHeaderButtons key={`btnLeft${type}`} {...{ type }} />
        ))}
    </header>
  );
};
