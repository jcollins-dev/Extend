// 3rd party libs
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

// Components
import { BaseSelect, Typography } from 'components';
import DSISiteTables from 'pages/DSI/DSISite/DSISiteTables';
import { DataRenderer } from 'components/machine-health';

// Types
import { SiteTableType } from 'types/protein';
import { BusinessUnit } from 'types/dsi';

import { useGetMachineStatusQuery } from 'api';

interface Props {
  plantId: string;
  type: SiteTableType;
  showEntireFleet: (isShowEntireFleet: boolean) => void;
  isShowEntireFleet: boolean;
}
const StyledFilter = styled.div`
  display: flex;
  max-width: 12.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  > p {
    margin-top: 0.5rem;
    margin-right: 0.625rem;
  }
`;

const DSISite = ({ plantId, type, showEntireFleet, isShowEntireFleet }: Props): ReactElement => {
  const [filterValue, setFilterValue] = useState('dsi');
  const filterOptions = [
    { value: 'dsi', label: 'DSI Only' },
    { value: 'entire', label: 'Entire Fleet' }
  ];
  const businessUnit = BusinessUnit.DSI;

  /**
   * Query site machines
   */
  const { data: machines, isLoading: machinesLoading } = useGetMachineStatusQuery(
    { plantId, businessUnit },
    { skip: !plantId, pollingInterval: 30000 }
  );

  useEffect(() => {
    showEntireFleet(false);
  }, []);

  return (
    <>
      <StyledFilter>
        <Typography weight="semi-bold" size="">
          View:
        </Typography>
        <BaseSelect
          variant="white"
          value={filterValue}
          handleChange={(e) => {
            showEntireFleet(!isShowEntireFleet);
            setFilterValue(e.target.value);
          }}
          options={filterOptions}
        />
      </StyledFilter>
      <DataRenderer isLoading={machinesLoading}>
        <DSISiteTables
          plantId={plantId}
          machines={machines ?? []}
          isLoading={machinesLoading}
          type={type}
        />
      </DataRenderer>
      {isShowEntireFleet && (
        <Typography size="1.25rem" weight="bold" mb="0.25">
          Other
        </Typography>
      )}
    </>
  );
};

export default DSISite;
