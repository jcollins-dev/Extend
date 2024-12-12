import React, { ReactNode, Fragment } from 'react';
import {
  BreadCrumbsContainer,
  BreadCrumbsContainerProps,
  BreadCrumbsDividerIcon
} from './FleetBreadCrumbs.elements';

import { useHistory } from 'react-router-dom';

/**
 * The BreadCrumbs component accepts a list of breadcrumb items as props,
 * and each item can have a label, slug, isLoading status,
 * hasError status, and isCurrent status.
 *
 * It iterates over the list of breadcrumb items
 * and renders a PathItem component for each item. The PathItem component
 * checks the status of the item and displays a loading indicator,
 * error message, or link to the item's slug as appropriate.
 *
 * it also accepts optional children as props,
 * which will be rendered after the breadcrumb items.
 *
 * it uses CSS grid to position itself within the parent container, if required.
 * Insided, it uses flexbox for putting items inline and for spacing and alignment.
 */

// Props for a single breadcrumb item
export type BreadCrumbsItemProps = {
  slug?: string;
  label?: string;
  isLoading?: boolean;
  hasError?: string;
  isCurrent?: boolean;
  pathLabel?: string;
  path?: string;
};

// Base class name for it
const baseClass = 'bread-crumbs';

// Props for a single breadcrumb item including whether it's the last in the list
interface PathItemProps extends BreadCrumbsItemProps {
  isLast?: boolean;
}

// Renders a single breadcrumb item
const PathItem = ({
  slug,
  label,
  hasError,
  isLoading,
  pathLabel,
  isLast,
  path
}: PathItemProps): JSX.Element => {
  const history = useHistory();

  let innerContent = pathLabel || `Loading`;
  let className = `${baseClass}-item`;

  // If the item is currently loading, show a loading indicator
  if (isLoading) {
    className = `${className} ${className}--is-loading`;
    return (
      <div className={className}>
        <span>{innerContent}</span>
      </div>
    );
  }

  // If there's an error, show the error message. Otherwise, show the label.
  innerContent = hasError || label || innerContent;

  // If there's no label available and the item isn't currently loading, show an error message
  if (!label && !isLoading) {
    className = `${className} ${className}--has-error`;
    return <div className={className}>{pathLabel} error</div>;
  }

  // If there's no slug, just show the label
  if (!slug && !path)
    return (
      <div className={className}>
        {isLast ? <strong>{innerContent}</strong> : innerContent.toLowerCase()}
      </div>
    );

  // Otherwise, show a link to the slug
  className = `${className} ${className}--is-link`;

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        history.push(slug || path || '');
      }}
      className={className}
    >
      {isLast ? <strong>{innerContent}</strong> : innerContent.toLowerCase()}
    </a>
  );
};

// Props for the overall breadcrumbs component
export interface BreadCrumbsProps extends BreadCrumbsContainerProps {
  items?: BreadCrumbsItemProps[];
  children?: ReactNode | ReactNode[];
  /** Component to load inline before the breadcrumbs */
  Before?: ReactNode | ReactNode[];
}

// Renders the overall breadcrumbs component
export const BreadCrumbs = ({
  className,
  gridArea,
  items,
  Before,
  children
}: BreadCrumbsProps): JSX.Element => {
  // If there are no items, just show the children (if any)
  if (!items) return <>{children}</> || <></>;

  const containerSettings = {
    className: `${baseClass}${className ? `${className}` : ``}`,
    gridArea
  };

  // Map each item to a PathItem component and add a divider icon for every item except the first and last
  const pathItems = items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 && i < items.length && <BreadCrumbsDividerIcon />}
      <PathItem isLast={i === items.length - 1} {...item} />
    </Fragment>
  ));

  // Render the breadcrumbs container and all the path items, along with any children
  return (
    <BreadCrumbsContainer {...containerSettings}>
      {Before}
      {pathItems}
      {children}
    </BreadCrumbsContainer>
  );
};
