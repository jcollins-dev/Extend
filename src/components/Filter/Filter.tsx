// 3rd Party
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'components';
import { Machine } from 'types';
import { useTranslation } from 'react-i18next';

import {
  MaintenanceEventArgs,
  MaintenanceScheduleArgs,
  MaintenanceEventGroup
} from 'types/maintenance';
import Collapse, { Panel } from 'rc-collapse';
import FilterHeaderNode from 'pages/MaintenanceServiceDashboard/MaintenanceFilterHeader';
import { checkScreenSize } from '../../helpers/screen';
import { handleCheckboxFilter, onLoadSelectedFilter } from 'helpers/filters';

interface FilterProps {
  items?: Machine[];
  setFilter: React.Dispatch<React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>>;
  filter: MaintenanceEventArgs | MaintenanceScheduleArgs;
  subitemsList: { value: string; label: string }[];
  eventGroupsList?: MaintenanceEventGroup[];
}

export interface SetFilterProps {
  value?: string;
  fnSetStateFilter: React.Dispatch<
    React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>
  >;
  arrFilter: MaintenanceEventArgs | MaintenanceScheduleArgs;
  arrSelectedValues?: string[];
}

export interface FilterOptionProps {
  value: string;
  label: string;
  checked: boolean;
}

interface Props {
  isSmallScreen: boolean;
}

const MenuPanel = styled(Panel)`
  margin-bottom: 1.5rem;
  width: 100%;
  display: inline-block;
`;

const FilterSection = styled.div`
  margin-top: 1rem;
`;

const ellipsisStyle = `& label {
  width: 9.3rem;
  overflow-x: hidden;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}`;

const ScrollItem = styled.div<Props>`
  max-height: 18rem;
  overflow-y: auto;
  overflow-x: hidden;
  ${(props) => (props.isSmallScreen ? ellipsisStyle : '')}
`;

function setMachineFilter({
  arrSelectedValues,
  fnSetStateFilter,
  arrFilter
}: SetFilterProps): void {
  fnSetStateFilter({ ...arrFilter, machineIds: arrSelectedValues });
}

function setSubComponentsFilter({
  arrSelectedValues,
  fnSetStateFilter,
  arrFilter
}: SetFilterProps): void {
  fnSetStateFilter({ ...arrFilter, subcomponents: arrSelectedValues });
}

const Filter = ({
  items,
  setFilter,
  filter,
  subitemsList,
  eventGroupsList
}: FilterProps): JSX.Element => {
  const [activePlantKeys, setActivePlantKeys] = useState<React.Key[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const handleResize = checkScreenSize(setIsSmallScreen);
  const { t } = useTranslation(['fpns']);

  const newArrMachines: FilterOptionProps[] | undefined = items?.map((item) => {
    return { value: item.id, label: item.description, checked: false };
  });
  const [arrMachines, setArrMachines] = useState<FilterOptionProps[] | undefined>(newArrMachines);
  const newArrSubcomponents: FilterOptionProps[] = subitemsList.map((item) => {
    return { ...item, checked: false };
  });
  const [arrSubcomponents, setArrSubcomponents] = useState<FilterOptionProps[] | undefined>(
    newArrSubcomponents
  );
  const newArrEventGroups: FilterOptionProps[] | undefined = eventGroupsList?.map((item) => {
    return {
      value: `${item.value} ${item.runMetric}`,
      label: `${item.value} ${item.runMetric}`,
      checked: false
    };
  });
  const [arrEventGroups, setArrEventGroups] = useState<FilterOptionProps[] | undefined>(
    newArrEventGroups
  );

  const handleMachineChange = handleCheckboxFilter(
    arrMachines,
    setArrMachines,
    setFilter,
    filter,
    setMachineFilter
  );

  const handleSubcomponentChange = handleCheckboxFilter(
    arrSubcomponents,
    setArrSubcomponents,
    setFilter,
    filter,
    setSubComponentsFilter
  );

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    onLoadSelectedFilter(filter, arrMachines, setArrMachines);
    onLoadSelectedFilter(filter, arrSubcomponents, setArrSubcomponents);
    onLoadSelectedFilter(filter, arrEventGroups, setArrEventGroups);
  });

  return (
    <Collapse
      destroyInactivePanel={true}
      activeKey={activePlantKeys}
      onChange={(key: React.Key | React.Key[]) =>
        setActivePlantKeys(Array.isArray(key) ? key : [key])
      }
    >
      {arrMachines && arrMachines.length > 0 && (
        <MenuPanel
          showArrow={true}
          collapsible="header"
          key="Machine"
          header={FilterHeaderNode(t('machine'), undefined, activePlantKeys?.includes('Machine'))}
        >
          <ScrollItem isSmallScreen={isSmallScreen}>
            {arrMachines.map((item, i) => {
              return (
                <FilterSection key={i}>
                  <Checkbox
                    key={item.value}
                    id={item.value}
                    width={20}
                    height={20}
                    label={item.label}
                    checked={item.checked}
                    onChange={() => {
                      handleMachineChange(item.value);
                    }}
                  />
                </FilterSection>
              );
            })}
          </ScrollItem>
        </MenuPanel>
      )}
      <MenuPanel
        showArrow={true}
        collapsible="header"
        key="Subcomponent"
        header={FilterHeaderNode(
          t('subcomponent'),
          undefined,
          activePlantKeys?.includes('Subcomponent')
        )}
      >
        <ScrollItem isSmallScreen={isSmallScreen}>
          {arrSubcomponents &&
            arrSubcomponents.map((item, i) => {
              return (
                <FilterSection key={i}>
                  <Checkbox
                    key={item.value}
                    id={item.value}
                    width={20}
                    height={20}
                    label={item.label}
                    checked={item.checked}
                    onChange={() => {
                      handleSubcomponentChange(item.value);
                    }}
                  />
                </FilterSection>
              );
            })}
        </ScrollItem>
      </MenuPanel>
    </Collapse>
  );
};

export default Filter;
