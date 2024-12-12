import React from 'react';

import { Button } from 'components';

// Context
import { useWidgetTableContext } from 'components/machine-health';

// Types
import { WidgetTableDataItem } from 'types/machine-health';

interface SaveButtonProps {
  saveCallBack: (data: WidgetTableDataItem[]) => void;
  isDirty: boolean;
}

const SaveButton = ({ isDirty, saveCallBack }: SaveButtonProps): JSX.Element => {
  const { localTableRows } = useWidgetTableContext();

  return (
    <Button
      disabled={!isDirty}
      variant={'primary'}
      width="5.25rem"
      onClick={() => saveCallBack(localTableRows)}
    >
      Save
    </Button>
  );
};

export default SaveButton;
