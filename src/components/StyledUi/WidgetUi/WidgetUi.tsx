import React, { ReactNode } from 'react';

import { WidgetUiContainer } from './WidgetUi.elements';
import { WidgetUiProps, WidgetUiIconProps } from './WidgetUi.types';
import { default as LoaderBase } from 'react-loader-spinner';
import { TooltipWrapper } from 'components';

interface HeaderIconProps extends WidgetUiIconProps {
  label?: string;
}

const HeaderIcon = ({
  Icon,
  handleClick,
  label,
  tooltip,
  className,
  left
}: HeaderIconProps): JSX.Element => {
  /* setup base css class */
  className = className ? `${className} widget-ui-header__icon` : `widget-ui-header__icon`;

  /* add modifier class for left or right */
  className = `${className} widget-ui-header__icon--${left ? `left` : `right`}`;

  /* add modifier class to tooltip for any custom styling */
  const tooltipClassName = `widget-ui-header__tootltip widget-ui-header__tooltip--${
    left ? `left` : `right`
  }`;

  return handleClick ? (
    <TooltipWrapper Tooltip={tooltip} className={tooltipClassName}>
      <button className={className} onClick={() => handleClick()} type="button">
        <span className="sr-only">{label}</span>
        {Icon}
      </button>
    </TooltipWrapper>
  ) : (
    <div className={className}>
      <span className="sr-only">{label}</span>
      {Icon}
    </div>
  );
};

const LoaderSection = ({
  AfterMain,
  children,
  Footer,
  isLoading,
  Main,
  SubHeader,
  hasError,
  hasMessage
}: Props): JSX.Element => {
  return hasError ? (
    <div className="widget-ui-main widget-ui-main--center status--error">{hasError}</div>
  ) : isLoading ? (
    <div className="widget-ui-main widget-ui-main--center">
      <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
    </div>
  ) : hasMessage ? (
    <div className="widget-ui-main widget-ui-main--center">{hasMessage}</div>
  ) : (
    <>
      {SubHeader && <div className="widget-ui-sub-header">{SubHeader}</div>}
      {children && <div className="widget-ui-main ">{children}</div>}
      {
        // must be grid-area: main for positioning
        /* or className widget-ui-main for paddiong and positioning */
      }
      {Main}
      {/* must be grid-area: main, used for area outside of overflow */}
      {AfterMain}
      {Footer && <footer className="widget-ui-footer">{Footer}</footer>}
    </>
  );
};

interface Props extends WidgetUiProps {
  children?: ReactNode | ReactNode[];
}

export const WidgetUi = ({
  children,
  title,
  isLoading,
  hasStatus,
  className,
  hasError,
  hasMessage,
  IconLeft,
  IconRight,
  SubHeader,
  Footer,
  Header,
  SubTitle,
  Main,
  AfterMain,
  ga,
  gridArea,
  styleType
}: Props): JSX.Element => {
  // generate base css class ui-dashboard-widget and add incoming class if there
  className = className ? `widget-ui ${className}` : `widget-ui`;
  className = styleType ? className + ` ${styleType}` : className;

  // add machine status class
  className =
    !isLoading && !hasError && !hasMessage && hasStatus
      ? `status--${hasStatus} ${className}`
      : className;

  // add loader status class
  className = isLoading
    ? `is-loading ${className}`
    : hasError
    ? `has-error ${className}`
    : hasMessage
    ? `has-message ${className}`
    : className;

  // loading state
  const isLoaded = !isLoading && !hasError && !hasMessage;

  const hasHeader = Header || title || IconLeft || IconRight ? true : false;
  const hasSubHeader = isLoaded && SubHeader ? true : false;
  const hasFooter = isLoaded && Footer ? true : false;

  const HeaderToUse =
    hasHeader &&
    (Header || (
      <header className="widget-ui-header">
        {IconLeft && <HeaderIcon {...IconLeft} />}
        <h3 className="widget-ui-header__title">
          {title}
          {!hasStatus && SubTitle && (
            <span className="widget-ui-header__sub-title">{SubTitle}</span>
          )}
        </h3>
        {!isLoading && !hasError && IconRight && <HeaderIcon {...IconRight} />}
      </header>
    ));

  return (
    <WidgetUiContainer
      {...{ hasHeader, hasSubHeader, hasFooter, className, ga, gridArea, styleType }}
    >
      {HeaderToUse}
      <LoaderSection
        {...{ AfterMain, Main, Footer, hasMessage, hasStatus, hasError, isLoading, SubHeader }}
      >
        {children}
      </LoaderSection>
    </WidgetUiContainer>
  );
};
