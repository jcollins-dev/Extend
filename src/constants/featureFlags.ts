export const sfEnabled = (): boolean => {
  return process.env.REACT_APP_ENABLE_SF === 'true';
};
