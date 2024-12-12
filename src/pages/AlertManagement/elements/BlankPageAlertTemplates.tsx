import React from 'react';

import { default as CloudIcon } from '../icons/cloud.svg';
import { StartPage } from '../index.elements';
import { default as PlusIcon } from '../icons/plus_in_white.svg';
import { useTranslation } from 'react-i18next';

export const BlankPageAlertTemplateManagement = (): JSX.Element => {
  const { t } = useTranslation('mh');

  return (
    <StartPage>
      <div className="intro_page">
        <img src={CloudIcon} />
        <h1>{t('create_new_alert_template')}</h1>
        <p>{t('create_new_alert_template_welcome_text')}</p>
        <button className="btn default">
          <img src={PlusIcon} alt="create new alert teplate" /> {t('create_new_alert_template')}
        </button>
      </div>
    </StartPage>
  );
};
