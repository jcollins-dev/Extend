import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Button, Loader, Modal, Typography } from 'components';
import {
  ButtonBar,
  ModalCopyTable,
  ModalCopyWidget,
  WidgetTable,
  WidgetTableProvider
} from 'components/machine-health';
import SaveButton from './SaveButton';

// Types
import { ModalSize } from 'types';
import { WidgetTableDataItem, WidgetTableDropdownItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

// Constants
import { WidgetTableTagColumnConfigs } from 'constants/machineConfig';

// Hooks
import { useMachine } from 'hooks';
import { useLanguage } from 'providers';

// API
import {
  useGetBusinessUnitMasterTagListQuery,
  useGetMachineWidgetDataQuery,
  useUpdateMachineConfiguratorDataMutation,
  useGetMachineDataAnalysisTagsQuery
} from 'api';

// Helpers
import { mapBusinessUnitId } from 'helpers/machine';

const StyledTableWrapper = styled.div`
  padding: 0 3rem 3rem;
`;

interface Props {
  addImageRow?: boolean;
  hideInactive?: boolean;
  machineId: string;
  widgetId: string;
  isEditAdminPopupOpen: boolean;
  setIsEditAdminPopupOpen: (x: boolean) => void;
}

const AdminCardEditButton = ({
  addImageRow,
  hideInactive,
  machineId,
  widgetId,
  isEditAdminPopupOpen,
  setIsEditAdminPopupOpen
}: Props): JSX.Element => {
  const { machine, isLoading: isLoadingMachine, error: errorMachine } = useMachine();
  const { languageId } = useLanguage();
  const {
    data: machineTags,
    isFetching: isFetchingMachineTags,
    error: errorMachineTags
  } = useGetBusinessUnitMasterTagListQuery({
    businessUnitId: mapBusinessUnitId(machine?.businessUnit) || 3,
    languageId
  });

  const {
    data: tagValues,
    isFetching: isFetchingTagValues,
    error: errorTagValues
  } = useGetMachineDataAnalysisTagsQuery({ machineId });

  const {
    data: widgetData,
    isFetching: isFetchingWidgetData,
    error: errorWidgetData
  } = useGetMachineWidgetDataQuery({
    machineId,
    widgetId,
    includeTagValues: true,
    showInactive: !hideInactive,
    languageId: languageId
  });

  const [updateProductProcessingData, { isLoading: isUpdating, error: errorUpdate }] =
    useUpdateMachineConfiguratorDataMutation();

  const [isDirty, setIsDirty] = useState(false);
  const [showModalCopyWidget, setShowModalCopyWidget] = useState(false);
  const [showModalCopyTable, setShowModalCopyTable] = useState(false);
  const [copyMachineId, setCopyMachineId] = useState('');

  const tagList = useMemo(() => {
    const tags: WidgetTableDropdownItem[] = [];

    machineTags?.forEach((tag) => {
      const values = [];
      const foundValue = tagValues?.find((tagValue) => tagValue.tagId === tag.id);
      foundValue && values.push(foundValue);

      tags.push({
        id: tag.id as string,
        ...(tag.friendlyName ? { name: tag.friendlyName as string } : {}),
        type: WidgetType.State, // TODO this needs data from the backend
        label: (tag.friendlyName || tag.id) as string,
        values
      });
    });

    tags
      .sort((option1, option2) => {
        const typedOption1 = option1;
        const option1Values = typedOption1.values as { value: number }[];
        const typedOption2 = option2;
        const option2Values = typedOption2.values as { value: number }[];

        if (option1Values.length && !option2Values.length) {
          return -1;
        }
        if (!option1Values.length && option2Values.length) {
          return 1;
        }
        return 0;
      })
      .sort((option1, option2) => {
        const typedOption1 = option1;
        const option1Values = typedOption1.values as { value: number }[];
        const typedOption2 = option2;
        const option2Values = typedOption2.values as { value: number }[];
        if (
          (option1Values[0]?.value != undefined && option2Values[0]?.value != undefined) ||
          (option1Values[0]?.value == undefined && option2Values[0]?.value == undefined)
        ) {
          const option1Id = (typedOption1.id as string).toLowerCase();
          const option2Id = (typedOption2.id as string).toLowerCase();
          if (option1Id < option2Id) {
            return -1;
          }
          if (option1Id > option2Id) {
            return 1;
          }
          return 0;
        }
        return 0;
      });

    return tags;
  }, [machineTags, tagValues]);

  const isLoading =
    isFetchingMachineTags ||
    isFetchingWidgetData ||
    isUpdating ||
    isFetchingTagValues ||
    isLoadingMachine;

  const error =
    errorMachine || errorWidgetData || errorUpdate || errorTagValues || errorMachineTags;

  useEffect(() => {
    setIsDirty(false);
  }, []);

  const saveInfo = async (data: WidgetTableDataItem[]) => {
    const updatedWidget = data[0]?.members?.[0];

    // Do nothing if we have no widget data
    if (!widgetData || !updatedWidget) {
      return;
    }

    await updateProductProcessingData({
      machineId,
      widget: updatedWidget,
      languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Tags updated successfully`);
        setIsDirty(false);
      })
      .catch((error) => {
        toast.error(`Failed to update tags`);
        console.error(error?.data?.detail);
      });
  };

  const onCopyFromSelectedMachine = (id: string) => {
    setCopyMachineId(id);
    setShowModalCopyWidget(false);
    setShowModalCopyTable(true);
  };

  const handleModalClose = (): void => {
    setIsEditAdminPopupOpen(false);
    // we don't need to do anything else here, ...
    // ... if we don't make an update call the original data will not update ...
    // ... the next modal open will reset with original data
  };

  if (error) {
    console.error(error);
    <Typography color="negativeRed">Failed to load data</Typography>;
  }

  return (
    <WidgetTableProvider>
      <Modal
        allowContentScroll
        title={'Customize Machine States'}
        visible={isEditAdminPopupOpen}
        onClose={() => handleModalClose()}
        size={ModalSize.LARGE}
      >
        <StyledTableWrapper>
          <ButtonBar title="">
            <Button width="fit-content" onClick={() => setShowModalCopyWidget(true)}>
              Copy Widget from Machine
            </Button>
            <SaveButton isDirty={isDirty} saveCallBack={saveInfo} />
          </ButtonBar>
          <ModalCopyWidget
            onSelectMachine={onCopyFromSelectedMachine}
            setVisible={setShowModalCopyWidget}
            visible={showModalCopyWidget}
          />
          <ModalCopyTable
            closeModal={() => setShowModalCopyTable(false)}
            copyDestinationItem={widgetData}
            copyMachineId={copyMachineId}
            copyWidgetType={widgetData?.widgetType as WidgetType}
            setIsDirty={setIsDirty}
            setVisible={setShowModalCopyTable}
            visible={showModalCopyTable}
          />
          {isLoading ? (
            <Loader />
          ) : widgetData ? (
            <WidgetTable
              columnConfigs={WidgetTableTagColumnConfigs}
              data={[widgetData]}
              displayOnlyRows={
                addImageRow
                  ? [
                      {
                        id: 'machine-image-id',
                        key: uuidv4(),
                        name: 'Image',
                        tagType: 'Machine Image',
                        widgetType: WidgetType.MachineImage
                      }
                    ]
                  : null
              }
              parent={{
                ...widgetData,
                name: undefined
              }}
              setIsDirty={setIsDirty}
              shouldRenderTags
              tags={tagList}
            />
          ) : (
            <Typography>No Data</Typography>
          )}
        </StyledTableWrapper>
      </Modal>
    </WidgetTableProvider>
  );
};

export default AdminCardEditButton;
