import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningStepCategoriesPieChart, { groupData } from '.';
import { mockCleaningStepGroup } from 'constants/testdata/protein';

describe('CleaningStepCategoriesPieChart', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CleaningStepCategoriesPieChart
          data={mockCleaningStepGroup}
          selectedSteps={[]}
          onSelectSteps={jest.fn}
          getColorById={jest.fn()}
        />
      </ThemeProvider>
    );
  });

  it('Groups data correctly', () => {
    const expectedResult = [
      {
        stepId: '2',
        name: 'Drying',
        percent: 30,
        duration: 30_000,
        tooltipLines: [{ label: 'Drying', percent: 30, duration: 30_000, id: '2' }],
        constituentSteps: ['2']
      },
      {
        stepId: '5',
        name: 'Foaming',
        percent: 30,
        duration: 30_000,
        tooltipLines: [{ label: 'Foaming', percent: 30, duration: 30_000, id: '5' }],
        constituentSteps: ['5']
      },
      {
        stepId: '3',
        name: 'Rinse',
        percent: 15,
        duration: 15_000,
        tooltipLines: [{ label: 'Rinse', percent: 15, duration: 15_000, id: '3' }],
        constituentSteps: ['3']
      },
      {
        stepId: '4',
        name: 'Defrost',
        percent: 15,
        duration: 15_000,
        tooltipLines: [{ label: 'Defrost', percent: 15, duration: 15_000, id: '4' }],
        constituentSteps: ['4']
      },
      {
        stepId: 'other',
        name: 'Other',
        percent: 10,
        duration: 10_000,
        tooltipLines: [
          { label: 'Disinfection', percent: 3.5, duration: 3_500, id: '6' },
          { label: 'Equipment defrost', percent: 2.5, duration: 2_500, id: '1' },
          { label: 'Circuit rinse', percent: 2, duration: 2_000, id: '7' },
          {
            label: 'Foaming of belt, evaporator and equipment',
            percent: 2,
            duration: 2_000,
            id: '8'
          }
        ],
        constituentSteps: ['6', '1', '7', '8']
      }
    ];

    const result = groupData(mockCleaningStepGroup);

    expect(result).toEqual(expectedResult);
  });
});
