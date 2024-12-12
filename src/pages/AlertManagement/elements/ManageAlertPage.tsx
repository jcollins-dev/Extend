import React from 'react';

import { BlankPageAlertManagement } from './BlankPageAlertManagement';
import { MenuAlerts } from './Menu';

export const ManageAlertPage = (): JSX.Element => {
  return (
    <>
      <MenuAlerts />
      <BlankPageAlertManagement />
    </>
  );
};
