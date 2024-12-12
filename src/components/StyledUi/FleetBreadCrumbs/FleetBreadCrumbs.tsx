import React, { ReactNode } from 'react';
import { BreadCrumbs, BreadCrumbsItemProps } from './BreadCrumbs';
import { TooltipWrapper } from '../TooltipWrapper';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MachineStatusIconStatusProps } from '../MachineStatusIconV2';
import { BreadCrumbsPaddingFixer } from './FleetBreadCrumbs.elements';
import { useTranslation } from 'react-i18next';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MachineStatusIndicator } from 'components/MachineStatus/MachineStatusIndicator';

export interface FleetBreadCrumbsPathsProps {
  /** for the first level (customer name) fleet/x */
  customer?: BreadCrumbsItemProps;
  /** second level fleet/site/x */
  site?: BreadCrumbsItemProps;
  /** third level fleet/line/x */
  line?: BreadCrumbsItemProps;
  /** fourth level fleet/machine/x */
  machine?: BreadCrumbsItemProps;
}

const baseClass = 'bread-crumbs';

// Provide a button with the pencil icon and also a tooltip
const EditButton = ({
  handle,
  isLoading
}: {
  handle: () => void;
  isLoading?: boolean;
}): JSX.Element => {
  const loaded = !isLoading ? true : false;

  let className = `${baseClass}__edit`;

  if (!loaded) className = `${className} ${className}--is-loading`;

  return (
    <TooltipWrapper Tooltip="Configure Machine" bottom>
      <button
        disabled={!loaded}
        type="button"
        className={className}
        onClick={() => loaded && handle()}
      >
        <FontAwesomeIcon icon={faPencil} />
        <span className="sr-only">edit settings</span>
      </button>
    </TooltipWrapper>
  );
};

export interface FleetBreadCrumbsProps {
  machineStatus?: MachineStatusIconStatusProps;
  handleEdit?: () => void;
  plantId?: string;
  paths?: FleetBreadCrumbsPathsProps;
  children?: ReactNode | ReactNode[];
  /** shows the machine details bar that contains the status, s/n, and order number */
  showMachineDetails?: boolean;
  needsPadding?: boolean;
  /** is this a config page */
  isConfig?: boolean;
  /** will this have a back button (arrow) */
  hideBackArrow?: boolean;
  isDisconnected?: boolean;
  businessUnit?: string;
  productionState?: string;
}

export const FleetBreadCrumbs = ({
  machineStatus,
  handleEdit,
  paths,
  needsPadding,
  isConfig,
  hideBackArrow,
  isDisconnected,
  businessUnit,
  productionState,
  ...rest
}: FleetBreadCrumbsProps): JSX.Element => {
  const pathItems = [];

  const { t } = useTranslation(['mh']);

  if (!paths) return <></>;

  if (paths.customer)
    pathItems.push({
      ...paths.customer,
      pathLabel: t('retrieving_customer')
    } as BreadCrumbsItemProps);
  if (paths.site)
    pathItems.push({ ...paths.site, pathLabel: t('retrieving_site') } as BreadCrumbsItemProps);
  if (paths.line)
    pathItems.push({ ...paths.line, pathLabel: t('retrieving_line') } as BreadCrumbsItemProps);
  if (paths.machine)
    pathItems.push({
      ...paths.machine,
      pathLabel: t('retrieving_machine')
    } as BreadCrumbsItemProps);
  if (isConfig) pathItems.push({ label: t('config'), pathLabel: t('config') });

  const Before = hideBackArrow ? undefined : (
    <a href="/fleet" className={`${baseClass}__btn-back`}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </a>
  );

  const machineStatusSettings = {
    machineStatus: productionState || machineStatus?.productionState,
    lastConnected: machineStatus?.lastConnected,
    isLoading: machineStatus?.isLoading,
    isDisconnected,
    businessUnit: businessUnit
  };

  const CurrentBreadCrumbs = (
    <BreadCrumbs {...rest} items={pathItems} Before={Before}>
      <MachineStatusIndicator {...{ ...machineStatusSettings }} />
      {handleEdit && <EditButton handle={handleEdit} />}
    </BreadCrumbs>
  );

  // needsPadding is a fix for incorrectly coded pages, this should be removed when site is cleaned up
  if (needsPadding) return <BreadCrumbsPaddingFixer>{CurrentBreadCrumbs}</BreadCrumbsPaddingFixer>;
  else return CurrentBreadCrumbs;
};
