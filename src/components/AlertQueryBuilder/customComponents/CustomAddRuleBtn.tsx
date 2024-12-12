import React from 'react';
import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { useTranslation } from 'react-i18next';
import { AddButton } from './index.elements';
import AddButtonIcon from '../icons/plus.svg';

const CustomAddRuleBtn = (props: ActionWithRulesAndAddersProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  if (props.level === 0) {
    return <></>;
  }
  return (
    <>
      <AddButton onClick={(e) => props.handleOnClick(e)}>
        <img src={AddButtonIcon} alt="Icon" />
        {t('add_rule') as string}
      </AddButton>
    </>
  );
};

export default CustomAddRuleBtn;
