// 3rd Party
import { isEqual } from 'lodash';

// Types
import { AlarmType } from 'types/machine-health/alarms';

interface FilterHistoryEvent {
  selectedDate?: string;
  selectedType?: AlarmType;
  selectedId: string;
  selectedIdType?: AlarmType;
  searchQuery: string;
}

interface FilterState {
  present: FilterHistoryEvent;
  past: FilterHistoryEvent[];
  future: FilterHistoryEvent[];
}

type FilterAction =
  | { type: 'FILTER_BY_DATE'; date: string }
  | { type: 'FILTER_BY_ID'; id: string; alarmIdType: AlarmType }
  | { type: 'FILTER_BY_TYPE'; alarmType: AlarmType }
  | { type: 'FILTER_BY_SEARCH'; query: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

export const initialFilterState: FilterState = {
  present: {
    selectedDate: undefined,
    selectedType: undefined,
    selectedId: '',
    selectedIdType: undefined,
    searchQuery: ''
  },
  past: [],
  future: []
};

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  const { present, past, future } = state;

  switch (action.type) {
    case 'FILTER_BY_DATE': {
      if (isEqual(action.date, present.selectedDate)) return state;

      const newPresent: FilterHistoryEvent = { ...present, selectedDate: action.date };

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }

    case 'FILTER_BY_TYPE': {
      if (isEqual(action.alarmType, present.selectedType)) return state;

      const newPresent: FilterHistoryEvent = { ...present, selectedType: action.alarmType };

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }

    case 'FILTER_BY_ID': {
      if (
        isEqual(action.id, present.selectedId) ||
        isEqual(action.alarmIdType, present.selectedIdType)
      ) {
        return state;
      }

      const newPresent: FilterHistoryEvent = {
        ...present,
        selectedId: action.id,
        selectedIdType: action.alarmIdType
      };

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }

    case 'FILTER_BY_SEARCH': {
      if (isEqual(action.query, present.searchQuery)) return state;

      const newPresent: FilterHistoryEvent = { ...present, searchQuery: action.query };

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }

    case 'UNDO': {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }

    case 'REDO': {
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }

    case 'CLEAR': {
      return {
        past: [],
        present: {
          searchQuery: '',
          selectedId: '',
          selectedDate: undefined,
          selectedIdType: undefined,
          selectedType: undefined
        },
        future: []
      };
    }

    default: {
      return initialFilterState;
    }
  }
};
