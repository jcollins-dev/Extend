// 3rd party libs
import React, { ReactElement, useState } from 'react';
import { isEmpty, lowerCase, sortBy } from 'lodash';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

// Components
import { DataRenderer } from 'components/machine-health';

import { UserManagementTableType } from 'types/user-management';
import { useGetUserManagementQuery } from 'api';
import Select from 'react-select';

interface Props {
  onChangeGroup: (groupElement: { value: string; label: string }) => void;
  isViewFilterIcon?: boolean;
}

const FilterIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0.9375rem;
  right: -1.5625rem;
  cursor: pointer;
`;

const GroupSelect = ({ onChangeGroup, isViewFilterIcon }: Props): ReactElement => {
  const { data: groups, isFetching: isFetchingGroups } = useGetUserManagementQuery({
    type: lowerCase(UserManagementTableType.GROUP)
  });
  const groupOptions = groups?.items
    ? groups?.items?.map((group) => ({
        label: group.name,
        value: group.id
      }))
    : [];
  const sortedOptions = sortBy(groupOptions, [
    (p) => {
      return lowerCase(p.label);
    }
  ]);

  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(
    null
  );

  const handleSelectChange = (option: { value: string; label: string } | null) => {
    setSelectedOption(option ?? null);
  };

  return (
    <DataRenderer isLoading={isFetchingGroups}>
      <Select
        options={sortedOptions}
        value={selectedOption}
        onChange={(option) => {
          onChangeGroup(option ? option : { value: '', label: '' });
          handleSelectChange(option);
        }}
        isSearchable
      />
      {isViewFilterIcon && (
        <FilterIcon
          icon={isEmpty(selectedOption?.value) ? faFilter : faFilterCircleXmark}
          onClick={() => {
            if (!isEmpty(selectedOption?.value)) {
              setSelectedOption(null);
              onChangeGroup({ value: '', label: '' });
            }
          }}
        />
      )}
    </DataRenderer>
  );
};

export default GroupSelect;
