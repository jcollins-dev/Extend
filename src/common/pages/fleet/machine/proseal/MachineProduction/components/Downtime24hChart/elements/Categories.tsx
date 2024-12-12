import React from 'react';
import { CategoryLineProps } from './Chart.types';
import { categoryMapping } from '../../../../../../../../helpers/colorMapping';
import { uniqueId } from 'lodash';
import { Line } from './Categories.elements';

const CategoryLine = ({ category }: CategoryLineProps): JSX.Element => {
  const cat = (
    categoryMapping[category] ? categoryMapping[category] : categoryMapping['Undefined']
  ) as Record<string, unknown>;

  return (
    <Line className="bar-indicator--icon category">
      {cat.icon}
      <p style={{ color: cat.color as unknown as string }}> {category} </p>
    </Line>
  );
};

export const CategoriesList = (): JSX.Element => {
  const categoriesList = Object.keys(categoryMapping).map((category) => (
    <CategoryLine key={uniqueId()} {...{ category }} />
  ));

  return <>{categoriesList}</>;
};
