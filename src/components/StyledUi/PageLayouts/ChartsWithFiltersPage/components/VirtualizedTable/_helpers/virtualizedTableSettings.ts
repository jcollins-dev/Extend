import { HeaderMouseEventHandlerParams } from 'react-virtualized';

export interface VirtualizedTableSettingsProps {
  //width: number,
  //height: number,
  //headerHeight: number,
  //rowHeight: number,
  handleHeaderClick: ({ dataKey }: HeaderMouseEventHandlerParams) => void;
  data: Record<string, unknown>[];
  id: string;
}

export const virtualizedTableSettings = ({
  data,
  handleHeaderClick,
  ...rest
}: VirtualizedTableSettingsProps): Record<string, unknown> => {
  return {
    headerHeight: 30,
    height: 300,
    rowCount: data?.length,
    rowGetter: (index: number) => data?.[index],
    onHeaderClick: handleHeaderClick,
    ...rest
  };
};
