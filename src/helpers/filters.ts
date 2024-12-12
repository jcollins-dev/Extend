import { FilterOptionProps, SetFilterProps } from 'components/Filter/Filter';
import { Alarm, AlarmLocation } from 'types/machine-health/alarms';
import { MaintenanceEventArgs, MaintenanceScheduleArgs } from 'types/maintenance';

export function handleRadioButtonFilter(
  setFilter: React.Dispatch<React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>>,
  filter: MaintenanceEventArgs | MaintenanceScheduleArgs,
  arrayFilter: FilterOptionProps[],
  setCurrentFilter: ({ value, fnSetStateFilter, arrFilter }: SetFilterProps) => void
): (value: string) => void {
  return (value: string) => {
    setCurrentFilter({ value, fnSetStateFilter: setFilter, arrFilter: filter });

    Object.assign(
      arrayFilter,
      arrayFilter.map((obj) =>
        obj.value === value ? { ...obj, checked: true } : { ...obj, checked: false }
      )
    );
  };
}

export function handleCheckboxFilter(
  arrItems: FilterOptionProps[] | undefined,
  setArrItems: React.Dispatch<React.SetStateAction<FilterOptionProps[] | undefined>>,
  setFilter: React.Dispatch<React.SetStateAction<MaintenanceEventArgs | MaintenanceScheduleArgs>>,
  filter: MaintenanceEventArgs | MaintenanceScheduleArgs,
  setCurrentFilter: ({ arrSelectedValues, fnSetStateFilter, arrFilter }: SetFilterProps) => void
): (value: string) => void {
  return (value: string) => {
    const updatedMachines = arrItems?.map((obj) =>
      obj?.value === value ? { ...obj, checked: !obj.checked } : { ...obj, checked: obj.checked }
    );
    setArrItems(updatedMachines);

    const arrSelectedValues: string[] = [];

    updatedMachines?.forEach((obj) => {
      if (obj.checked) {
        arrSelectedValues.push(obj.value);
      }
    });
    setCurrentFilter({ arrSelectedValues, fnSetStateFilter: setFilter, arrFilter: filter });
  };
}

export function onLoadSelectedFilter(
  filters: MaintenanceEventArgs | MaintenanceScheduleArgs,
  filterArray: FilterOptionProps[] | undefined,
  setFilterArray: React.Dispatch<React.SetStateAction<FilterOptionProps[] | undefined>>
): void {
  filters.machineIds?.forEach((id) => {
    const foundIndex = filterArray?.findIndex((item) => item.value == id);
    if (filterArray && foundIndex && foundIndex > -1) filterArray[foundIndex].checked = true;
  });
  setFilterArray(filterArray);
}

export const isAlarmVisible = (alarm: Alarm): boolean => alarm.location !== AlarmLocation.Hidden;
