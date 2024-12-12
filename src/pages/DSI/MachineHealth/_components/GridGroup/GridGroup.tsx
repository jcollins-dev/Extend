import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GridGroupContainer } from './GridGroup.elements';
import { StyledUiContainerProps } from 'components';

export interface GridGroupProps extends StyledUiContainerProps {
  children?: ReactNode | ReactNode[];
  translateTitleKey?: string;
}

const baseClass = `grid-group`;

export const GridGroup = ({ children, translateTitleKey, gridArea, className }: GridGroupProps) => {
  className = className ? `${className} ${baseClass}` : baseClass;

  if (translateTitleKey) className = `${className} ${baseClass}--${translateTitleKey}`;

  const { t } = useTranslation();

  return (
    <GridGroupContainer {...{ gridArea, className }}>
      {translateTitleKey && <h2>{t(translateTitleKey)}</h2>}
    </GridGroupContainer>
  );
};
