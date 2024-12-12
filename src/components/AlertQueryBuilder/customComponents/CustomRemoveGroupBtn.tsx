import React from 'react';
import { ActionWithRulesProps } from 'react-querybuilder';
import { useTranslation } from 'react-i18next';
import { DeleteGroupButton } from './index.elements';

interface CustomRemoveRuleBtnProps extends ActionWithRulesProps {
  getGroupsLength: () => number;
}

const CustomRemoveGroupBtn = (props: CustomRemoveRuleBtnProps): JSX.Element => {
  const { t } = useTranslation(['mh']);

  return (
    <>
      <DeleteGroupButton
        style={{ cursor: props.getGroupsLength() > 1 ? 'pointer' : 'not-allowed' }}
        disabled={props.getGroupsLength() > 1 ? false : true}
        onClick={(e) => props.handleOnClick(e)}
      >
        {t('delete_group') as string}
      </DeleteGroupButton>
    </>
  );
};

export default CustomRemoveGroupBtn;
