// 3rd Party components
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Flyout, FlyoutHeader, TabNav } from 'components';
import AlertSingleTagForm from './AlertTagForm';
import AlertConfigTagForm from './AlertConfigTagForm';
import { AlertConfig } from 'types/machine-health/alerts';

const AlertTagForm =
  process.env.REACT_APP_ALERT_CREATOR_MULTI_CONDITION === 'true'
    ? AlertConfigTagForm
    : AlertSingleTagForm;

// Styling
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

enum Tabs {
  Tag,
  KPI
}

interface Props {
  alertToEdit: AlertConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * This component houses alert navigation and form components.
 * @param alertToEdit Alert to edit, or null if creating a new alert
 * @param isOpen Whether the flyout is open
 * @param onClose Callback to close the flyout
 */

const CreateEditAlertFlyout = ({ alertToEdit, isOpen, onClose }: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Tag);

  return (
    <Flyout onClose={onClose} visible={isOpen} width="40%">
      <StyledContainer tabIndex={0}>
        <FlyoutHeader
          bgColor={theme.colors.lightGrey1}
          heading={
            !alertToEdit?.id
              ? (t('create_new_alert') as string)
              : `${t('edit_alert') as string} ${alertToEdit?.name}`
          }
          onClose={onClose}
        />
        <TabNav
          items={[
            {
              active: activeTab === Tabs.Tag,
              isTabEnabled: true,
              label: t('tag'),
              onClick: () => setActiveTab(Tabs.Tag)
            },
            {
              active: activeTab === Tabs.KPI,
              isTabEnabled: false,
              label: t('kpi'),
              onClick: () => console.log('KPI tab not enabled') //setActiveTab(Tabs.KPI)
            }
          ]}
        />

        <>
          {activeTab === Tabs.Tag && <AlertTagForm alertToEdit={alertToEdit} onClose={onClose} />}
          {/* TODO: Implement KPI tab */}
          {/* {activeTab === Tabs.KPI && <CreateOrEditAlertKPIForm />} */}
        </>
      </StyledContainer>
    </Flyout>
  );
};

export default CreateEditAlertFlyout;
