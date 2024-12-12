// 3rd Part Libraries
import React, { useEffect, useRef } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

// Types
import { BaseTag } from 'types/protein';

// API
import { useQueryMachineTags } from 'hooks';

interface Props {
  currentTagValue: BaseTag | undefined;
  startTime: Date;
  endTime: Date;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setError: React.Dispatch<
    React.SetStateAction<Record<string, FetchBaseQueryError | SerializedError | undefined>>
  >;
  setStatesData: React.Dispatch<React.SetStateAction<BaseTag[]>>;
  setTagData: React.Dispatch<React.SetStateAction<BaseTag[]>>;
  tagId: string;
}

const ChartTagData = ({
  currentTagValue,
  setError,
  setLoading,
  setStatesData,
  setTagData,
  startTime,
  endTime,
  tagId
}: Props): null => {
  // Set a marker for the presence of data
  const hasTagsData = useRef(false);
  const hasStatesData = useRef(false);

  const { tags, states, isLoading, isFetching, error } = useQueryMachineTags({
    startDatetime: startTime,
    endDatetime: endTime,
    tagCodes: [tagId] || []
  });

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
    // If we already have state data, do nothing.
    if (hasStatesData.current) {
      return;
    }
    if (states && states.length > 0) {
      // Set hasStateData to true on the first render to prevent circular calls
      hasStatesData.current = true;
      setStatesData((prev) => [...prev.filter((item) => item.id !== states[0].id), ...states]);
    }
  }, [states]);

  useEffect(() => {
    setError((prev) => ({ ...prev, [tagId]: error }));
  }, [error]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, [tagId]: isLoading || isFetching }));
  }, [isLoading, isFetching]);

  return null;
};

export default ChartTagData;
