import React, { ReactNode, useState, createContext } from 'react';

export interface TooltipContextReturnProps {
  tooltip?: Record<string, unknown>;
  setTooltip: (x?: Record<string, unknown>) => void;
}

export const TooltipContext = createContext<TooltipContextReturnProps>({
  tooltip: undefined,
  setTooltip: (props?) => console.log(props, 'props not set')
});

export interface ChartTooltipWrapperProps {
  children?: ReactNode | ReactNode[];
}

export const ChartTooltipWrapper = ({ children }: ChartTooltipWrapperProps): JSX.Element => {
  const [tooltip, setTooltip] = useState<Record<string, unknown> | undefined>(undefined);
  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>{children}</TooltipContext.Provider>
  );
};
