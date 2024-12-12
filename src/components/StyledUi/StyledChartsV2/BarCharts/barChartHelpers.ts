export const calculateBarWidth = ({ width, count }: { width?: number; count?: number }): number => {
  // return 0 if width or count is not defined or less than 1
  // that probably means its still loading
  if (!width || !count || width < 1 || count < 1) return 0;
  // max bar width
  let barWidth = 15;
  const chartColWidth = Math.floor(width / count);

  if (chartColWidth < barWidth) {
    return (barWidth = chartColWidth);
  }

  return barWidth - chartColWidth / (width / count);
};
