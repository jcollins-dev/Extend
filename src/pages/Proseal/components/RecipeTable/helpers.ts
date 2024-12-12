import theme from 'themes';

export const GET_FEED_FACTOR_COLOR = (
  feedFactor: number
): { backgroundColor: string; color: string } => {
  if (feedFactor > 1.2) {
    return { backgroundColor: theme.colors.atRiskYellow4, color: theme.colors.atRiskYellow };
  } else if (feedFactor > 0.8) {
    return { backgroundColor: theme.colors.onTrackGreen5, color: theme.colors.darkGreen };
  } else if (feedFactor > 0.4) {
    return { backgroundColor: theme.colors.atRiskYellow4, color: theme.colors.atRiskYellow };
  } else {
    return { backgroundColor: theme.colors.negativeRed4, color: theme.colors.darkRed };
  }
};

export const GET_PACKS_PER_MINUTE_COLOR = (
  actual: number,
  target: number
): { backgroundColor: string; color: string } => {
  return actual >= target
    ? { backgroundColor: theme.colors.onTrackGreen5, color: theme.colors.darkGreen }
    : { backgroundColor: theme.colors.negativeRed4, color: theme.colors.darkRed };
};
