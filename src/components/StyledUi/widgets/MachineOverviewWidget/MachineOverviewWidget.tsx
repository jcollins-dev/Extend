import React, { ReactNode } from 'react';
import { WidgetUiProps, WidgetUi } from 'components/StyledUi/WidgetUi';
import { MachineOverviewWidgetMain } from './MachineOverviewWidget.elements';
export interface MachineOverviewWidgetPropsContentRow {
  /* if this row is a header, set to true and it will be styled as such */
  isHeader?: boolean;
  /* the text that appears in the label (left side) of the row */
  label?: ReactNode;
  /* the text that appears in the value (right side) of the row, this is not needed for isHeaders */
  value?: ReactNode;
}
import { TooltipWrapper } from 'components/StyledUi/TooltipWrapper';
import { default as editPencil } from '../../../../icons/EditPencil.svg';

export interface MachineOverviewWidgetProps extends WidgetUiProps {
  /** the click handler for the edit button that appears at the top of the header
  if you want to send a custom Icon and click handler, you can send it VIA the IconLeft prop
  found in WidgetUi */
  handleHeaderIconClick?: () => void;
  /**  Text for the tooltip */
  tooltipText?: string;
  /** the text content and settings to populate the table-like layout in the main section of the widget */
  contentRows?: MachineOverviewWidgetPropsContentRow[];
  /** component to render in the footer of the widget.  this will be aligened to the bottom of the widget */
  Footer?: ReactNode | ReactNode[];
  /** URL path to add to img tag */
  imagePath?: string;
  /** image component to render, this overrides image path */
  MachineImage?: ReactNode;
}

const ContentRow = ({ isHeader, label, value }: MachineOverviewWidgetPropsContentRow) => {
  let className = 'machine-overview-widget__content-row';

  if (isHeader) className = `${className} machine-overview-widget__content-row--header`;

  // return nothing if missing both label and value
  if (!label && !value) return <></>;

  return (
    <div className={className}>
      {label && <div className="machine-overview-widget__content-row__label">{label}</div>}
      {value && <div className="machine-overview-widget__content-row__value">{value}</div>}
    </div>
  );
};

export const MachineOverviewWidget = ({
  className,
  title,
  handleHeaderIconClick,
  tooltipText,
  contentRows,
  Footer,
  imagePath,
  ...widgetProps
}: MachineOverviewWidgetProps): JSX.Element => {
  const widgetSettings = {
    className: className
      ? `${className} widget-ui--machine-overview-widget`
      : `widget-ui--machine-overview-widget`,
    ...widgetProps
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <MachineOverviewWidgetMain>
          {(title || handleHeaderIconClick) && (
            <header>
              {title}
              {handleHeaderIconClick && (
                <TooltipWrapper Tooltip={tooltipText}>
                  <button type="button" className=" " onClick={() => handleHeaderIconClick?.()}>
                    <img src={editPencil} alt="Edit widget" />
                  </button>
                </TooltipWrapper>
              )}
            </header>
          )}

          {imagePath && (
            <div className="machine-overview-widget__image-container">
              <img src={imagePath} alt={title?.toString()} />
            </div>
          )}
          <div className="machine-overview-widget__content-rows">
            {contentRows?.map((row, i) => (
              <ContentRow key={i} {...row} />
            ))}
          </div>
          {Footer && <footer>{Footer}</footer>}
        </MachineOverviewWidgetMain>
      }
    />
  );
};
