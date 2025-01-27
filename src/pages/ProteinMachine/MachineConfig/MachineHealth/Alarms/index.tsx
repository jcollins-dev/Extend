// Third Party
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Components
import { Button, Loader, Typography, Switch } from 'components';
import { ButtonBar, ModalCopyWidget, TutorialButton } from 'components/machine-health';

// Types
import { WidgetTableDataItem } from 'types/machine-health';
import { MachineHealthTabs, TopLevelTabs } from 'types/protein';

// Providers
import { useLanguage } from 'providers';

// API
import {
  useCopyMachineConfigurationDataMutation,
  useGetMachineConfiguratorDataQuery,
  useUpdateMachineConfiguratorDataMutation
} from 'api';

// Constants
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

// Helpers
import { updateDeeplyNestedIds } from 'helpers/machine-health';

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 6rem;
  padding-right: 6rem;
  width: 100%;
`;

interface Props {
  hasWidgets?: boolean;
  hideTabToggler?: boolean;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

const MachineConfigAlarms = ({
  hasWidgets,
  hideTabToggler,
  isDirty,
  setIsDirty
}: Props): ReactElement => {
  const theme = useTheme();
  const { machineId } = useParams<{ machineId: string }>();
  const { languageId } = useLanguage();

  const {
    data,
    isFetching: fetching,
    error
  } = useGetMachineConfiguratorDataQuery({
    machineId,
    labels: [MachineHealthTabs.Alarms],
    languageId: languageId,
    showInactive: true
  });

  const [updateProductCleaningData, { isLoading: updating, error: errorUpdate }] =
    useUpdateMachineConfiguratorDataMutation();

  const [
    copyMachineConfigurationData,
    { isLoading: updatingConfiguration, error: errorUpdateConfiguration }
  ] = useCopyMachineConfigurationDataMutation();

  const [tabData, setTabData] = useState<WidgetTableDataItem | undefined>(data?.[0]);
  const [isActive, setIsActive] = useState(!!data?.[0]?.active);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copyMachineId, setCopyMachineId] = useState('');
  const [skip, setSkip] = useState(true);
  const [copiedConfiguration, setCopiedConfiguration] = useState<
    WidgetTableDataItem[] | undefined
  >();
  const [isCopying, setIsCopying] = useState(false);

  const {
    data: copyData,
    isFetching: copyFetching,
    error: errorCopy
  } = useGetMachineConfiguratorDataQuery(
    {
      machineId: copyMachineId,
      labels: [],
      languageId: languageId,
      showInactive: true
    },
    { skip }
  );

  const saveInfo = async () => {
    // Do nothing if we have no tab data
    if (!tabData) {
      return;
    }
    // Reconstruct data to send to server
    const updatedProductProcessingTab = {
      ...tabData,
      active: isActive
    };

    await updateProductCleaningData({
      machineId,
      widget: updatedProductProcessingTab,
      languageId: languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Alarms updated successfully`);
      })
      .catch((error) => {
        toast.error(`Failed to update alarms`);
        console.error(error?.data?.detail);
      });
    setIsDirty(false);
  };

  const copyConfiguration = async () => {
    // Do nothing if we have no copied configuration data
    if (!copiedConfiguration) {
      return;
    }

    await copyMachineConfigurationData({
      machineId,
      configuration: copiedConfiguration,
      languageId: languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Configuration copied successfully`);
        setIsDirty(false);
      })
      .catch((error) => {
        toast.error(`Failed to copy configuration`);
        console.error(error?.data?.detail);
      });
  };

  const onCopyFromSelectedMachine = (id: string) => {
    setCopyMachineId(id);
    setSkip(false);
    setCopyModalOpen(false);
  };

  useEffect(() => {
    setTabData(data?.[0]);
    setIsActive(!!data?.[0]?.active);
  }, [data]);

  useEffect(() => {
    setIsDirty(false);
  }, []);

  useEffect(() => {
    if ((!copyData || !copyData?.[0]) && isCopying && !copyModalOpen && !copyFetching) {
      toast.error('No configuration data found, try another machine');
      setIsCopying(false);
    } else if (copyData && copyData.length > 0 && !tabData) {
      const nextCopiedConfiguration = copyData.map((item) =>
        updateDeeplyNestedIds(item, 'members')
      );

      setTabData(
        nextCopiedConfiguration
          ?.find((item) => item.label === TopLevelTabs.MachineHealth)
          ?.members?.find((member) => member.label === MachineHealthTabs.Alarms)
      );
      setCopiedConfiguration(nextCopiedConfiguration);
      setSkip(true);
      setIsDirty(true);
      setIsCopying(false);
    }
  }, [copyData, tabData, isCopying, copyModalOpen, copyFetching]);

  const handleEnableClick = () => {
    setIsActive((prev) => !prev);
    setIsDirty(true);
  };

  const isFetching = fetching || updating || copyFetching || updatingConfiguration;
  const isError = error || errorUpdate || errorCopy || errorUpdateConfiguration;

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    console.error(isError);
    <Typography color="negativeRed">Failed to load data</Typography>;
  }

  return (
    <Container>
      <ButtonBar columnGap="1.5rem" title="" padding="1.375rem 0">
        {tabData && !copiedConfiguration && (
          <>
            {!hideTabToggler && tabData.toggleActive && (
              <Switch
                checked={isActive}
                handleDiameter={22}
                height={14}
                onChange={handleEnableClick}
                width={40}
                offColor={theme.colors.mediumGrey2}
                offHandleColor={theme.colors.mediumGrey3}
              />
            )}

            <Button
              disabled={!isDirty}
              onClick={() => saveInfo()}
              variant={'primary'}
              width="fit-content"
            >
              Save
            </Button>
          </>
        )}

        {(!hasWidgets || copiedConfiguration) && (
          <>
            <Button
              disabled={!copiedConfiguration || copiedConfiguration.length === 0}
              onClick={() => copyConfiguration()}
              variant={'primary'}
              width="fit-content"
            >
              Save
            </Button>

            <Button
              onClick={() => {
                setCopyModalOpen(true);
                setIsCopying(true);
              }}
              width="fit-content"
            >
              Copy Configuration from Machine
            </Button>

            <ModalCopyWidget
              nextText="Copy"
              onSelectMachine={onCopyFromSelectedMachine}
              setVisible={setCopyModalOpen}
              visible={copyModalOpen}
            />
          </>
        )}
        <TutorialButton stepsData={tutorialPlaceholderStepsData} />
      </ButtonBar>
    </Container>
  );
};

export default MachineConfigAlarms;
