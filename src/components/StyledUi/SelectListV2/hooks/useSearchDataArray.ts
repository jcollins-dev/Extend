export const xx = 'go';
/*
import React, { useMemo, useState } from 'react';
import { searchForString } from '../helpers/selectListDataHelpers';

type DataArray = Record<string, unknown>[];

interface SearchProps {
  data: DataArray;
  searchTerm?: string
}

export type UseSearchDataArrayReturnProps = [
  Record<string, unknown>,
  (searchTearm: string) => void
]
export const useSearchDataArray = ({ data, searchTerm }: SearchProps): UseSearchDataArrayReturnProps => {
  const cachedData = useMemo(() => data, [data])


  const filteredData = cachedData.filter(item => Object.values(item).some(value =>
    typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  return []
}
*/
