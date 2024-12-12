// 3rd party
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Icons
import { faCog } from '@fortawesome/free-solid-svg-icons';

// Components
import { Button, PageHeader, UserPrompt } from 'components';

// Hooks
import { useAuth, useAuthB2C } from 'hooks';

// Styling
const SettingsContainer = styled.div`
  width: 100%;
  padding: 3.375rem 3.0625rem 1.5rem 3.0625rem;
`;

const Settings = (): React.ReactElement => {
  const auth = useAuth();
  const authB2C = useAuthB2C();
  const { t } = useTranslation(['common']);
  const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    b2cflag ? authB2C.signout() : auth.signout();
  };

  return (
    <>
      <PageHeader heading={t('settings')} icon={{ iconElement: faCog, iconType: 'fa' }} />
      <SettingsContainer>
        <Button variant="primary" width="5.875rem" onClick={() => setLogoutModalOpen(true)}>
          {t('log_out')}
        </Button>
      </SettingsContainer>
      <UserPrompt
        visible={isLogoutModalOpen}
        message={t('logout_prompt')}
        subMessage={t('you_will_be_logged_out_in') as string}
        primaryActionLabel={t('continue_session')}
        secondaryActionLabel={t('log_out')}
        handleCancel={handleCancelLogout}
        handlePrimaryAction={handleCancelLogout}
        handleSecondaryAction={handleLogout}
        timeoutAction="secondary-action"
      />
    </>
  );
};

export default Settings;
