// TODO: support multiple currencies
export default (value: number, currency?: string): string => {
  // TODO - catch dollar sign, as the backend is currently returning that symbol
  const checkedCurrency = currency ? (currency === '$' ? 'USD' : currency) : 'USD';
  // TODO: test that this formats correctly in other locales
  // Use `undefined` to specify in user's locale
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: checkedCurrency
  });
  return formatter.format(value);
};
