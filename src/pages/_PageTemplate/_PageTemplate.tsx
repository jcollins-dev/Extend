import React, { ReactNode } from 'react';
import { _PageTemplateContainer } from './_PageTemplate.elements';

export interface _PageTemplateProps {
  data?: Record<string, unknown>[];
}

interface Props extends _PageTemplateProps {
  children?: ReactNode | ReactNode[];
}

export const _PageTemplate = ({ children }: Props): JSX.Element => {
  return <_PageTemplateContainer>{children}</_PageTemplateContainer>;
};
