// 3rd party libs
import React, { ReactNode } from 'react';
import { UiDashboardWidget } from '../elements/UiDashboardWidget.elements';
import { default as LoaderBase } from 'react-loader-spinner';

export interface HeaderIconProps {
  Icon: ReactNode | ReactNode[];
  handleClick?: () => void;
  label: string;
  toolTip?: string;
}

export interface DashboardWidgetUiProps {
  Header?: ReactNode | ReactNode[];
  AfterMain?: ReactNode | ReactNode[];
  Footer?: ReactNode | ReactNode[];
  hasStatus?: string;
  isLoading?: boolean;
  hasError?: string;
  IconLeft?: HeaderIconProps;
  IconRight?: HeaderIconProps;
  Main?: ReactNode | ReactNode[];
  SubHeader?: ReactNode | ReactNode[];
  SubTitle?: ReactNode | ReactNode[];
  title?: string;
}

interface Props extends DashboardWidgetUiProps {
  children?: ReactNode | ReactNode[];
}

const HeaderIcon = ({ Icon, handleClick, label }: HeaderIconProps): JSX.Element => {
  return handleClick ? (
    <button className="ui-icon" onClick={() => handleClick()} type="button">
      <span className="sr-only">{label}</span>
      {Icon}
    </button>
  ) : (
    <div className="ui-icon">
      <span className="sr-only">{label}</span>
      {Icon}
    </div>
  );
};

const LoaderSection = ({
  AfterMain,
  children,
  Footer,
  hasStatus,
  Main,
  SubHeader,
  hasError
}: Props): JSX.Element => {
  switch (hasStatus) {
    case 'loading':
      return (
        <div className="ui-main has-status">
          <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
        </div>
      );
    case 'error':
      return <div className="ui-main has-status has-error">{hasError}</div>;
    default:
      return (
        <>
          {SubHeader && <div className="ui-sub-header">{SubHeader}</div>}
          {children && <div className="ui-main">{children}</div>}
          {Main}
          {/* must be grid-area: main, used for area outside of overflow */}
          {AfterMain}
          {Footer && <footer className="ui-footer">{Footer}</footer>}
        </>
      );
  }
};

export const DashboardWidgetUi = ({
  Header,
  AfterMain,
  children,
  Footer,
  hasStatus,
  IconLeft,
  IconRight,
  Main,
  SubHeader,
  SubTitle,
  title,
  isLoading,
  hasError
}: Props): JSX.Element => {
  hasStatus = hasStatus ? hasStatus : isLoading ? 'loading' : hasError && 'error';

  const hasHeader = title || IconLeft || IconRight ? true : false;
  const hasSubHeader = !hasStatus && SubHeader ? true : false;
  const hasFooter = !hasStatus && Footer ? true : false;

  const h3ClassName = Header ? `ui-title ui-title--flex` : `ui-title`;

  return (
    <UiDashboardWidget
      {...{ hasFooter, hasHeader, hasStatus, hasSubHeader, className: 'ui-dashboard-widget' }}
    >
      {hasHeader && (
        <header className="ui-header">
          {!hasStatus && IconLeft && <HeaderIcon {...IconLeft} />}
          <h3 className={h3ClassName}>
            {title || Header}
            {!hasStatus && SubTitle && <span className="ui-sub-title">{SubTitle}</span>}
          </h3>
          {!hasStatus && IconRight && <HeaderIcon {...IconRight} />}
        </header>
      )}
      <LoaderSection {...{ AfterMain, children, Main, Footer, hasStatus, hasError, SubHeader }} />
    </UiDashboardWidget>
  );
};
