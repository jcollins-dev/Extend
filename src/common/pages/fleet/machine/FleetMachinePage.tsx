import React from 'react';
import { ProsealMachinePage } from './proseal';
import { TabsNav } from 'common/components';
import { useCustomerInfo } from '../hooks/useCustomerInfo';

const pageTabSettings = {
  tabs: [
    {
      label: 'Machine Production',
      slug: 'machine-production',
      // this normally gets set automatically
      isCurrent: true,
      handle: {
        click: (): void => alert('routing is disabled for demo')
      }
    },
    {
      label: 'Machine Performance',
      slug: 'machine-performance',
      isDisabled: true,
      handle: {
        click: (): void => alert('routing is disabled for demo')
      }
    },
    {
      label: 'Alerts',
      slug: 'alerts',
      isDisabled: true,
      handle: {
        click: (): void => alert('routing is disabled for demo')
      }
    }
  ]
};

export const FleetMachinePage = (): JSX.Element => {
  const { bu } = useCustomerInfo();
  return (
    <>
      <TabsNav {...pageTabSettings} />
      {bu === 1 ? (
        <ProsealMachinePage />
      ) : (
        <section>invalide bu: bunsiness unit {bu} does not exist.</section>
      )}
    </>
  );
};
