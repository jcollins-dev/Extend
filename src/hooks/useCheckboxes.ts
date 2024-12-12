import { useState } from 'react';

const useCheckboxes = (
  defaultCheckedCheckboxes: string[]
): {
  checkedCheckboxes: string[];
  onCheckboxChange: (id: string, checked: boolean) => void;
} => {
  const [checkedCheckboxes, setCheckedCheckboxes] = useState<string[]>(defaultCheckedCheckboxes);

  const onCheckboxChange = (legendId: string, value: boolean): void => {
    setCheckedCheckboxes((state) => {
      if (value && !state?.includes(legendId)) {
        return [...(state ?? []), legendId];
      } else if (!value) {
        return state?.filter((id) => id !== legendId);
      } else {
        return state;
      }
    });
  };

  return {
    checkedCheckboxes,
    onCheckboxChange
  };
};

export default useCheckboxes;
