import { useState, useEffect } from 'react';
import { SelectListGroupItemProps } from '../js/selectListHelpers';

/**************************************************************
/*
/* This hook is to be used along site useSelectList
/*  see useSelectList for details.
/*
/* The useSelectListHistory hook takes the current value of the current selection
/*  obj from the useSelectListHistory return and adds it to an array.  
/*  each time the selected obj state changes, it adds the new state to an array
/*  and provides a way to undo, redo and clear the states.  Allowing the user 
/*  to navigate through the different selection states
/*
/************************************************************ */

export const useSelectListHistory = (
  selected: SelectListGroupItemProps // Accepts the `selected` object as its parameter.  See useSelectList
): [
  SelectListGroupItemProps, // Returns the current selected object
  (type: string) => void, // Returns a function called `handle` which takes a `type` parameter and returns `void`
  {
    // Returns an object called `stateMan`
    hasUndo: boolean; // A boolean value indicating whether there is an undo action available
    hasRedo: boolean; // A boolean value indicating whether there is a redo action available
    hasClear: boolean; // A boolean value indicating whether there is a clear action available
  }
] => {
  // Define state variables for the `history` array and the `current` index
  const [history, setHistory] = useState<SelectListGroupItemProps[]>([selected]);
  const [current, setCurrent] = useState(0);

  // Create variables for the `selected` object and the current selected object from `history`
  const newCurrent = JSON.stringify(history[current]);
  const newSelected = JSON.stringify(selected);

  // Create a variable for the first element of `history`
  const startSelected = JSON.stringify(history[history.length]);

  // Determine whether undo, redo, and clear actions are available based on the current state
  const hasUndo = current < history.length - 1 && history.length > 1 && current !== history.length;
  const hasRedo = current > 0 && current < history.length;
  const hasClear = hasUndo || hasRedo ? true : false; //newSelected !== startSelected

  // Use the `useEffect` hook to update the `history` array whenever the `selected` object changes
  useEffect(() => {
    if (current > 0) setCurrent(0); // Reset the `current` index if it is greater than 0
    if (newSelected !== newCurrent) {
      // Add the new `selected` object to `history` if it is different from the current selected object
      const newHistory = JSON.parse(JSON.stringify(history)); // Create a deep copy of `history` to prevent accidental mutations
      setHistory([selected, ...newHistory]); // Update `history` with the new `selected` object
    }
  }, [selected]);

  // Define the `handle` function which takes a `type` parameter and performs an action based on its value
  const handle = (type: string) => {
    switch (type) {
      case 'clear':
        return setHistory([JSON.parse(startSelected), ...history]); // Set the `history` array to a new array with the first element of `history` as its only element

      case 'undo':
        return setCurrent(current + 1); // Increment the `current` index by 1

      case 'redo':
        return setCurrent(current - 1); // Decrement the `current` index by 1
    }
  };

  // Define the `stateMan` object which contains the boolean values for `hasUndo`, `hasRedo`, and `hasClear`
  const stateMan = { hasUndo, hasRedo, hasClear };

  // Return an array containing the current selected object, the `handle` function, and the `stateMan` object
  return [history[current], handle, stateMan];
};
