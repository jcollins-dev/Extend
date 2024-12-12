import React, { ReactNode, MouseEvent } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { RouterTabNavContainer, routerTabNavBaseClass } from './RouterTabNav.elements';

export interface RouterTabNavPropsTab {
  /** appears inside link or button */
  label: string;
  /** gets added to baseBath, or as is, for use when clicking */
  slug: string;
  /** this is the path that gets sent to router when clicking, slug is not used nor is baseBath */
  path?: string;
  /** is this a working button or link */
  isDisabled?: boolean;
  /** this string gets sent to the translation service and gets returned to populate link or button text */
  translateLabel?: string;
  /** overriding click handler for button or link, this will return the slug or label of the tab */
  handleClick?: (x: string) => void;
  //hasDatePicker?: boolean,
  hideDatePicker?: boolean;
  // custom class to be assigned to a tab
  tabClass?: string;
}

export type RouterTabNavTabProps = RouterTabNavPropsTab;

export type RouterTabNavPropsUiStyles = `pills` | `tabs` | `buttons` | undefined;

export interface RouterTabNavProps {
  /** array of tobs, in order */
  routerTabs?: RouterTabNavPropsTab[];
  /** base path is used for automatic linking, if base path is set and a tab is clicked
   *  the path /`basePath`/`slug` will get sent to the router */
  basePath?: string;
  /** style selection of tabs */
  uiStyle?: string; //RouterTabNavPropsUiStyles;
  /** custom className added to wrapper */
  className?: string;
  /** css grid-area assignment */
  gridArea?: string;
}

export const RouterTabNav = ({
  routerTabs,
  basePath,
  className,
  gridArea,
  uiStyle
}: RouterTabNavProps): JSX.Element => {
  const { pathname } = useLocation();
  const history = useHistory();

  // set default style to tabs
  uiStyle = uiStyle || `tabs`;

  // add custom className to baseClass if needed
  className = className ? `${routerTabNavBaseClass} ${className}` : routerTabNavBaseClass;

  // add uiStyle modifier for different link or button types
  className = `${className} ${routerTabNavBaseClass}--${uiStyle}`;

  if (!routerTabs) return <></>;

  const RouterTabs = routerTabs.map(
    ({
      label,
      slug,
      path,
      isDisabled,
      translateLabel,
      handleClick
    }: RouterTabNavPropsTab): JSX.Element | JSX.Element[] => {
      // TODO: add translation hook
      const translated = label || translateLabel;

      // start the object to be spread over link
      const settings: Record<string, ReactNode> = {
        className: `${routerTabNavBaseClass}__item ${
          slug || path ? `${routerTabNavBaseClass}__item--${slug || path}` : ``
        }`
      };

      if (isDisabled) {
        // set disabled
        settings[`data-disabled`] = 'true';
        settings.as = `span`;

        // finally, apply above settings to link
        return (
          <a key={label} {...settings}>
            {translated}
          </a>
        );
      } else {
        // check to make sure we have the correct settings
        if (!slug && !path) {
          // there is no slug or path for this link and it's not disabled, throw error and return empty
          console.error('Error in `RouterTabNav`: entry is missing `slug` or `path`');
          return <></>;
        } else {
          // thanks TS
          const search = (slug || path) as string;

          const isCurrent = pathname.includes(search);

          if (isCurrent) settings[`data-current`] = `true`;

          settings.href = handleClick
            ? undefined
            : path
            ? path
            : basePath
            ? `${basePath}/${slug}`
            : `${slug}`;

          settings.onClick = (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
            if (!isDisabled && !isCurrent)
              return handleClick
                ? handleClick(slug || label)
                : history.push(`${settings.href as string}`);
          };
        }
      }

      // finally, apply above settings to link
      return (
        <a key={label} {...settings}>
          {translated}
        </a>
      );
    }
  );

  return <RouterTabNavContainer {...{ className, gridArea }}>{RouterTabs}</RouterTabNavContainer>;
};
