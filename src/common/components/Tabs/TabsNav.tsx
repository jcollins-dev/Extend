import React, { ReactNode, MouseEvent } from 'react';
import { TabsNavContainer, baseClass } from './TabsNav.elements';
import { UiContainerProps } from 'common/ui/StyledUi';

export interface TabsNavPropsTab {
  /** the slug for this tab */
  slug?: string;
  /** the full url path for this tab (aside from the main web .com) */
  path?: string;
  /** what displays on the buttom, this can be a component in case you want to add other stuff */
  label: ReactNode | ReactNode[];
  /** unique id */
  id?: string;
  /** custom handlers */
  handle?: {
    click?: (props: Record<string, unknown>) => void;
  };
  /** is this link active/current */
  isCurrent?: boolean;
  /** disable the link */
  isDisabled?: boolean;
}

export interface TabsNavProps extends UiContainerProps {
  tabs?: TabsNavPropsTab[];
  basePath?: string;
  handleClick?: (props: Record<string, unknown>) => void;
}

interface TabProps extends TabsNavPropsTab, TabsNavProps {}

const Tab = ({ slug, path, label, id, handle, handleClick, isDisabled, isCurrent }: TabProps) => {
  let className = `${baseClass}__nav-item`;

  if (isDisabled) {
    className += ` is-disabled`;
    path = '';
  }

  if (isCurrent) className += ` is-current`;

  const clickHandler = handle?.click || handleClick;

  const linkSettings: Record<string, unknown> = {
    className,
    href: slug,
    onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      if (isDisabled || isCurrent) return false;
      return clickHandler?.({ slug, path, label, id });
    }
  };

  return <a {...linkSettings}>{label}</a>;
};

export const TabsNav = ({ className, tabs }: TabsNavProps): JSX.Element => {
  if (!tabs) return <>Error: missing tabs in TabsNav</>;

  className = className ? `${baseClass} ${className}` : baseClass;

  return (
    <TabsNavContainer {...{ className }}>
      {tabs.map((tab, i) => (
        <Tab key={`tab${i}`} {...tab} />
      ))}
    </TabsNavContainer>
  );
};
