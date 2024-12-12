interface DecimalFormatOptionsProps {
  minimumSignificantDigits?: number;
}

export function formatDecimal(
  value: number,
  { minimumSignificantDigits }: DecimalFormatOptionsProps = {}
): string {
  // const formatterLocale = userLocale ?? getCurrentLocal();
  const formater = Intl.NumberFormat(undefined, { style: 'decimal', minimumSignificantDigits });

  return formater.format(value);
}

export function formatPercentage(value: number): string {
  const formater = Intl.NumberFormat(undefined, { style: 'percent' });

  return formater.format(value);
}

export const validateNumber = (value: number): boolean => {
  return !isNaN(value);
};
