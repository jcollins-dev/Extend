// 3rd party libs
import React, { ReactElement, SVGProps, useCallback, useMemo, useState } from 'react';
import { VictoryTooltip } from 'victory';

// Types
import { ProsealRecipeSegment } from 'types/proseal';

interface RecipeAxisProps extends SVGProps<SVGLineElement> {
  recipe: ProsealRecipeSegment;
  color: string;
}

const RecipeAxisSegment = ({ recipe, color, ...rest }: RecipeAxisProps): ReactElement => {
  const [isActive, setIsActive] = useState(false);
  const centerX = useMemo(() => {
    return (Number(rest.x1) + Number(rest.x2)) / 2;
  }, [rest.x1, rest.x2]);

  const toggleTooltip = useCallback(() => setIsActive((v) => !v), []);

  return (
    <>
      <line
        {...rest}
        onMouseOver={toggleTooltip}
        onMouseLeave={toggleTooltip}
        style={{ stroke: color, strokeWidth: 5 }}
      />
      <VictoryTooltip
        active={isActive}
        constrainToVisibleArea
        x={centerX}
        y={Number(rest.y1)}
        flyoutPadding={5}
        flyoutStyle={{
          stroke: color,
          fill: color
        }}
        style={{ fill: 'white' }}
        text={`${recipe.name} (${recipe.targetPacksPerMinute})`}
      />
    </>
  );
};

export default RecipeAxisSegment;
