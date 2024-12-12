export interface CalulateTotalsProps {
  countAll?: boolean;
  addKeys?: string[];
  countKeys?: string[];
  averageKeys?: string[];
  data?: Record<string, unknown>[];
}

export interface CalculateTotalsReturnProps {
  all?: number;
  totals?: Record<string, number>;
  averages?: Record<string, number>;
}

export const calculateTotals = ({
  data,
  countAll,
  countKeys,
  averageKeys,
  addKeys
}: CalulateTotalsProps): CalculateTotalsReturnProps | undefined => {
  let value: CalculateTotalsReturnProps = {};

  if (data?.length) {
    let counter: Record<string, { count: number; total: number }> = {};

    if (countAll) value = { all: data.length };

    if (addKeys || countKeys || averageKeys) {
      data.map((item) => {
        if (countKeys) {
          countKeys.map((key) => {
            if (Number(item?.[key])) {
              if (!counter[key]) counter = { ...counter, [key]: { count: 0, total: 0 } };
              counter[key].count = counter[key].count + 1;
            }
          });
        }
      });
    }
  }

  return value as CalculateTotalsReturnProps;
};
