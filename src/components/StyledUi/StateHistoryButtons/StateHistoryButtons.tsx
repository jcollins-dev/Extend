import React from 'react';
import {
  StateHistoryButtonContainer as Button,
  StateHistoryButtonsContainer,
  StateHistoryButtonContainerProps,
  stateHistoryButtonsBaseClass as baseClass
} from './StateHistoryButtons.elements';
import { useTranslation } from 'react-i18next';

export interface StateHistoryButtonsPropsSetting {
  disabled?: boolean;
  handleClick: () => void;
  label?: string;
  translateLabel?: string;
}

export interface StateHistoryButtonsProps extends StateHistoryButtonContainerProps {
  undo?: StateHistoryButtonsPropsSetting;
  redo?: StateHistoryButtonsPropsSetting;
  clear?: StateHistoryButtonsPropsSetting;
}

interface BtnProps extends StateHistoryButtonsPropsSetting {
  type: string;
  children: string;
}

const Btn = ({ type, handleClick, disabled, children }: BtnProps) => {
  const { t } = useTranslation(['mh']);

  const btnSettings: Record<string, string | boolean | (() => void)> = {
    className: `${baseClass}__button ${baseClass}__button--${type} font--caps`,
    ['aria-label']: children as string
  };

  if (disabled) {
    btnSettings['disabled'] = true;
    btnSettings['data-muted'] = true;
  } else {
    btnSettings.onClick = () => handleClick();
  }

  return <Button {...btnSettings}>{t(children)}</Button>;
};

export const StateHistoryButtons = ({
  undo,
  redo,
  clear,
  gridArea,
  className
}: StateHistoryButtonsProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  return (
    <StateHistoryButtonsContainer {...{ className, gridArea }}>
      {undo && (
        <Btn type="undo" {...undo}>
          undo
        </Btn>
      )}
      {redo && (
        <Btn type="redo" {...redo}>
          redo
        </Btn>
      )}
      {clear && (
        <Btn type="clear" {...clear}>
          clear
        </Btn>
      )}
    </StateHistoryButtonsContainer>
  );
};
