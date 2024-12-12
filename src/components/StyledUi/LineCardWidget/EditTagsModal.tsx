// 3rd party libs
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Components
import { Button, Loader, Modal, Typography } from 'components';
import { WidgetTableDropdownItem } from 'types/machine-health';
import TagSelect from './TagSelect';

// Types
import { ModalSize } from 'types';
import { LineViewMachine, Tag, WidgetType } from 'types/protein';
import { LineViewWidgetTableDataItem, Order } from 'types/machine-health/widget-table';

// Providers
import { useLanguage } from 'providers';

// API
import {
  useGetBusinessUnitMasterTagListQuery,
  useGetMachineConfiguratorDataQuery,
  useUpdateMachineConfiguratorDataMutation
} from 'api';

// Styled Components
const StyledContainer = styled.div`
  padding: 0rem 3rem 2rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const MAX_TAG_COUNT = 8;

interface Props {
  businessUnitId: number;
  currentTagData: TagProp[] | [];
  isOpen: boolean;
  machineId: string;
  onCloseCallback: () => void;
  rawTagData: Tag[];
  tagList?: WidgetTableDropdownItem[] | null;
}
export interface TagProp {
  type?: string;
  id?: string;
  name?: string;
  unit?: string;
  meta?: {
    data_type?: string;
    dataType?: string;
  };
  values?: [
    {
      timestamp?: string;
      value?: number;
    }
  ];
}

const EditTagsModal = ({
  businessUnitId,
  currentTagData,
  isOpen,
  machineId,
  onCloseCallback,
  rawTagData
}: Props): JSX.Element => {
  const [tags, setTags] = useState<(TagProp | undefined)[] | []>(currentTagData);
  const [valuesAreSet, setValuesAreSet] = useState<boolean>(false);
  const [filteredTagList, setFilteredTagList] = useState<WidgetTableDropdownItem[]>([]);
  const { languageId } = useLanguage();

  const {
    data: machineTags,
    isFetching: isFetchingMachineTags,
    error: errorMachineTags
  } = useGetBusinessUnitMasterTagListQuery({
    businessUnitId,
    languageId
  });

  // Attach tag values to selected tags
  useEffect(() => {
    const nextTags: (TagProp | undefined)[] = [];
    currentTagData.forEach((tag) => {
      const values = [];
      const foundValue = rawTagData?.find((tagValue) => tagValue.tagId === tag.id);
      foundValue && values.push(foundValue);

      nextTags.push({
        ...tag,
        values: values as unknown as [
          { timestamp?: string | undefined; value?: number | undefined }
        ]
      });
    });

    setTags(nextTags);
  }, [currentTagData, rawTagData]);

  const tagList = useMemo(() => {
    const tags: WidgetTableDropdownItem[] = [];

    machineTags?.forEach((tag) => {
      const values = [];
      const foundValue = rawTagData?.find((tagValue) => tagValue.tagId === tag.id);
      foundValue && values.push(foundValue);

      tags.push({
        id: tag.id as string,
        ...(tag.friendlyName ? { name: tag.friendlyName as string } : {}),
        type: WidgetType.State,
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
  }, [machineTags, rawTagData]);

  // Mark tags that are already in use as disabled
  useEffect(() => {
    const nextList = [...(tagList || [])];
    nextList.forEach((tag) => {
      tag.disabled = false;
    });

    tags.forEach((tag) => {
      const targetTag = nextList?.find((item) => item.id === tag?.id);
      if (targetTag) {
        targetTag.disabled = true;
      }
    });

    setFilteredTagList(nextList);
  }, [tagList, tags]);

  const {
    data: machineData,
    isFetching: fetching,
    error: machineError
  } = useGetMachineConfiguratorDataQuery({
    machineId,
    labels: [LineViewMachine.LineViewMachine],
    languageId: languageId,
    showInactive: false
  });

  const saveTags = async () => {
    // Do nothing if we have no tags data
    if (!tags || !(machineData && machineData[0])) {
      return;
    }

    const data = machineData[0] as LineViewWidgetTableDataItem;

    const tagArray: TagProp[] | undefined = [];
    tags.forEach((tag) => {
      if (tag) tagArray.push(tag);
    });

    const updateTags = {
      ...data,
      tags: tagArray
    };

    await updateMachineLineViewTags({
      machineId,
      widget: updateTags,
      languageId: languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Tags updated successfully`);
        onCloseCallback();
      })
      .catch((error) => {
        toast.error(`Failed to update tags`);
        console.error(error?.data?.detail);
      });
  };

  const [updateMachineLineViewTags, { isLoading: updating, error: errorUpdate }] =
    useUpdateMachineConfiguratorDataMutation();

  const handleOrderChange = (order: Order, index: number) => {
    const reorderTags = (order: Order, index: number, items: (TagProp | undefined)[]) => {
      const itemsCopy = [...(items || [])];
      const item = itemsCopy.splice(index, 1)[0];
      itemsCopy.splice(
        order === Order.DOWN ? Math.min(itemsCopy.length + 1, index + 1) : Math.max(0, index - 1),
        0,
        item
      );
      return itemsCopy;
    };

    const newOrderTags = reorderTags(order, index, tags);
    setTags(newOrderTags);
  };

  const addTag = () => {
    setTags((prev) => [...prev, undefined]);
  };

  const handleDelete = (index: number) => {
    if (tags.length === 1) {
      setTags([]);
      return;
    }

    setTags([...tags.slice(0, index), ...tags.slice(index + 1)]);
  };

  const isAllValuesSet = () => {
    const tagsWithValues = tags.filter((item) => !!item);
    setValuesAreSet(tagsWithValues.length === tags.length);
  };

  useEffect(() => {
    isAllValuesSet();
  }, [tags]);

  const handleSetSelectValue = (index: number, tag: TagProp | undefined) => {
    setTags((prev) => {
      const newTags = [...prev];
      newTags[index] = tag;
      return newTags;
    });
  };

  const isLoading = updating || fetching || isFetchingMachineTags;
  const error = errorUpdate || machineError || errorMachineTags;

  if (error) {
    console.error(error);
  }

  return (
    <Modal
      allowContentScroll
      hasDropdowns={true}
      maxWidth="36rem"
      onClose={onCloseCallback}
      size={ModalSize.SMALL}
      title="Edit Machine Tag List"
      visible={isOpen}
      showScrollBar={true}
    >
      {error ? (
        <Typography color="negativeRed">Failed to load data</Typography>
      ) : isLoading ? (
        <Loader />
      ) : (
        <StyledContainer>
          {tags?.map((tag, i) => (
            <TagSelect
              handleOrderChange={handleOrderChange}
              handleDelete={handleDelete}
              handleSetSelectValue={handleSetSelectValue}
              key={`tag-select-${i}`}
              index={i}
              total={tags.length}
              valuesAreSet={valuesAreSet}
              tag={tag}
              tagList={filteredTagList}
            />
          ))}
          <StyledButtonContainer>
            <Button
              disabled={tags ? tags.length >= MAX_TAG_COUNT : true}
              onClick={() => addTag()}
              variant="secondary"
              width="7.25rem"
            >
              Add Tag
            </Button>
            <Button
              disabled={!valuesAreSet}
              onClick={() => saveTags()}
              variant="primary"
              width="5.25rem"
            >
              Save
            </Button>
          </StyledButtonContainer>
        </StyledContainer>
      )}
    </Modal>
  );
};

export default EditTagsModal;
