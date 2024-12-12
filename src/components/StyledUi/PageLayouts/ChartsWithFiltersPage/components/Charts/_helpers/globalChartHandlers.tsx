import { GlobalChartProps } from '../Charts.types';
import { VictoryBarProps } from 'victory';

export const globalChartHandlers = ({
  handleClick,
  handleHover
}: GlobalChartProps): VictoryBarProps['events'] => {
  const events: VictoryBarProps['events'] = [
    {
      target: 'data',
      eventHandlers: {
        onClick: () => ({
          // send slice data to click handler
          mutation: ({ datum }: { datum: Record<string, unknown> }) => {
            return handleClick?.(datum);
          }
        }),
        onMouseEnter: () => ({
          // send slice data to hover handler for tooltips
          mutation: (props: Record<string, unknown>) => {
            return handleHover?.(props);
          }
        }),
        onMouseLeave: () => ({
          // clear the tooltip on leave
          mutation: () => handleHover?.(undefined)
        })
      }
    }
  ];

  return events;
};
