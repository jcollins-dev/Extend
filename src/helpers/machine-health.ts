import { v4 as uuidv4 } from 'uuid';

// Helpers
import { formatDate } from 'helpers/dates';

// Types
import { CleaningSession } from 'types/protein';
import { PieSliceDatum } from 'components/PieChart';

export const formatSessionName = (
  session: CleaningSession | undefined,
  timeZone: string | undefined
): string => {
  if (!session) {
    return 'Select session';
  }
  let name = `${formatDate(new Date(session?.startTimestamp), 'long', timeZone)} - `;
  if (session?.endTimestamp) {
    name += formatDate(new Date(session?.endTimestamp), 'long', timeZone);
  }
  return name;
};

/*
  Sort pie chart data by percentage in descending order
  while moving hidden slices to the end of the array. 
  The goal is to have the chart slices grouped by type and by id
  appear at the same position in the chart.
*/

export const sortPieChartData = (a: PieSliceDatum, b: PieSliceDatum): number => {
  if (a.hidden) return 1;
  if (b.hidden) return -1;

  return b.percent - a.percent;
};

/*
  Recursively update an object's id and maps through its specified key to update its children's ids.
  e.g.
  {
    ...object,
    id: uuidv4(),
    [key]: object[key].map((child) => updateDeeplyNestedIds(child, key))
  }
*/

export const updateDeeplyNestedIds = <T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  key: K
): T => {
  let updatedObject = { ...object };

  if (updatedObject[key] && Array.isArray(updatedObject[key])) {
    const updatedKey = (updatedObject[key] as T[]).map((item) => {
      if (typeof item === 'object') {
        return updateDeeplyNestedIds(item, key);
      }
      return item;
    });
    updatedObject[key] = updatedKey as T[K];
  }

  updatedObject = { ...updatedObject, id: uuidv4() };

  return updatedObject;
};
