import React from 'react';
import { ActionWithRulesProps } from 'react-querybuilder';
import { DeleteRuleButton } from './index.elements';
import TrashIcon from '../icons/delete.svg';

interface CustomRemoveRuleBtnProps extends ActionWithRulesProps {
  getRulesLength: (data: number) => number;
}

const CustomRemoveRuleBtn = (props: CustomRemoveRuleBtnProps): JSX.Element => {
  return (
    <>
      <DeleteRuleButton
        style={{ cursor: props.getRulesLength(props.path[0]) > 1 ? 'pointer' : 'not-allowed' }}
        disabled={props.getRulesLength(props.path[0]) > 1 ? false : true}
        onClick={(e) => props.handleOnClick(e)}
      >
        <img src={TrashIcon} alt="Icon" height={20} />
      </DeleteRuleButton>
    </>
  );
};

export default CustomRemoveRuleBtn;
