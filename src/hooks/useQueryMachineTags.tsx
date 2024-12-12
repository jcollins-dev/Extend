/*
 * Query machine tags history
 */
//3rd Party
import { useParams } from 'react-router-dom';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import moment from 'moment';

// Api
import { useGetMachineTagsHistoryQuery } from 'api';

// Helpers
import { toISO8601 } from 'helpers';

// Providers
import { useLanguage, useTimeZone } from 'providers';

// Types
import { BaseTag, BaseTagType } from 'types/protein';

type Props = {
  startDatetime: Date;
  endDatetime: Date;
  tagCodes: string[];
  limit?: number;
  pollingInterval?: number;
};

type Response = {
  tags?: BaseTag[];
  states?: BaseTag[];
  isLoading: boolean;
  isFetching: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
};

/**
 * Query machine tags history
 *
 * @param startDatetime
 * @param endDatetime
 * @param tagCodes array of tags codes to be queried (tagCode is tagId)
 * @param pollingInterval
 */

const useQueryMachineTags = ({
  startDatetime,
  endDatetime,
  tagCodes,
  limit,
  pollingInterval = 0
}: Props): Response => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<{ machineId: string }>();
  const { languageId } = useLanguage();
  const { data, isLoading, isFetching, error } = useGetMachineTagsHistoryQuery(
    {
      machineId,
      startDatetime: toISO8601(moment(startDatetime).startOf('day').toDate(), timeZone),
      endDatetime: toISO8601(moment(endDatetime).endOf('day').toDate(), timeZone),
      tagCodes,
      limit,
      languageId
    },
    { skip: tagCodes.length == 0, pollingInterval }
  );

  return {
    tags: data?.filter((tag) => tag.type == BaseTagType.Tag),
    states: data?.filter((tag) => tag.type == BaseTagType.State),
    isLoading,
    isFetching,
    error
  };
};

export default useQueryMachineTags;
