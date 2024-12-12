import React from 'react';

import { default as CloudIcon } from '../icons/cloud.svg';
import { StartPage } from '../index.elements';
import { ActionButtons } from './ActionButtons';
import { useTranslation } from 'react-i18next';

export const BlankPageAlertManagement = (): JSX.Element => {
  const { t } = useTranslation('mh');

  return (
    <StartPage>
      <div className="intro_page">
        <img src={CloudIcon} />
        <h1>{t('create_new_alert')}</h1>
        <p>
          Create a new Alert Create new alert and notifications in order to track device ...Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        </p>
      </div>
      <ActionButtons />
    </StartPage>
  );
};
