/*
 * Query machine data
 */

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useGetMachineByIdQuery } from 'api';
import { useParams } from 'react-router-dom';
import { Machine } from 'types';

type Payload = {
  machine?: Machine;
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
};

const useMachine = (skip?: boolean): Payload => {
  const { machineId } = useParams<{ machineId: string }>();
  const { data: machine, isLoading, error } = useGetMachineByIdQuery(machineId, { skip });
  return { machine, isLoading, error };
};

export default useMachine;
