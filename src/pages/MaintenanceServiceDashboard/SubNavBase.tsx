// 3rd party libs
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SecondaryTabViews } from './MaintenanceServiceDashboardContents';

import { Pill } from 'components';

interface Props {
  changeSecondaryTab: (secondaryTabView: SecondaryTabViews) => void;
  secondaryTab: {
    value: SecondaryTabViews;
    selected: boolean;
    label: string;
  }[];
}

const SubNavBase = ({ changeSecondaryTab, secondaryTab }: Props): JSX.Element => {
  const { t } = useTranslation(['fpns']);
  return (
    <>
      {secondaryTab.map((tab) => (
        <Pill key={tab.value} onClick={() => changeSecondaryTab(tab.value)} selected={tab.selected}>
          {t(tab.label)}
        </Pill>
      ))}
    </>
  );
};

export default SubNavBase;
