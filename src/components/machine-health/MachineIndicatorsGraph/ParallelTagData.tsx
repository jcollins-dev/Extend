// 3rd Part Libraries
import React, { useEffect, useRef } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

// Types
import { BaseTag } from 'types/protein';

// Providers
import { useLanguage } from 'providers';

// API
import { useGetMachineTagsHistoryQuery } from 'api';

interface Props {
  currentTagValue: BaseTag | undefined;
  endDatetime: string;
  machineId: string;
  setError: React.Dispatch<
    React.SetStateAction<Record<string, FetchBaseQueryError | SerializedError | undefined>>
  >;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setTagData: React.Dispatch<React.SetStateAction<BaseTag[]>>;
  startDatetime: string;
  tagId: string;
}

const ParallelTagData = ({
  currentTagValue,
  endDatetime,
  machineId,
  setError,
  setLoading,
  setTagData,
  startDatetime,
  tagId
}: Props): null => {
  // Set a marker for the presence of data
  const hasTagsData = useRef(false);
  const { languageId } = useLanguage();

  const {
    data: tags,
    isFetching: isFetching,
    isLoading: isLoading,
    error: error
  } = useGetMachineTagsHistoryQuery(
    {
      machineId,
      startDatetime,
      endDatetime,
      tagCodes: [tagId],
      interpolation: false,
      languageId
    },
    { skip: !machineId }
  );

  const isTagEqual = tags && isEqual(tags[0], currentTagValue);
  useEffect(() => {
    // If we already have tag data, do nothing.
    if (hasTagsData.current && isTagEqual) {
      return;
    }
    if (tags && tags.length > 0) {
      // Set hasTagsData to true on the first render to prevent circular calls
      hasTagsData.current = true;
      setTagData((prev) => [...prev.filter((item) => item.id !== tags[0].id), ...tags]);
    }
  }, [isTagEqual, tags]);

  useEffect(() => {
    setError((prev) => ({ ...prev, [tagId]: error }));
  }, [error]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, [tagId]: isLoading || isFetching }));
  }, [isLoading, isFetching]);

  return null;
};

export default ParallelTagData;
