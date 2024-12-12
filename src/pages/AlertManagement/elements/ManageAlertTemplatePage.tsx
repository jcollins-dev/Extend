import React from 'react';

import { BlankPageAlertTemplateManagement } from './BlankPageAlertTemplates';
import { MenuAlertTemplates } from './Menu';

export const ManageAlertTemplatePage = (): JSX.Element => {
  return (
    <>
      <MenuAlertTemplates />
      <BlankPageAlertTemplateManagement />
    </>
  );
};
