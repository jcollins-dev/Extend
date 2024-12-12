import React, { useState } from 'react';
import { CombinatorSelectorProps } from 'react-querybuilder';
import { useTranslation } from 'react-i18next';
import '../style.css';
import DownArrowIcon from '../icons/down.svg';
type CombinatorOperator = 'AND' | 'OR';

const CustomCombinatorSelector = (props: CombinatorSelectorProps): JSX.Element => {
  const [selectedOperator, setSelectedOperator] = useState<CombinatorOperator>(
    props?.value as CombinatorOperator
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation(['mh']);

  return (
    <>
      <ul className="menu alertLogic">
        <li>
          {selectedOperator}
          <button className="button dropmenu">
            <img onClick={() => setIsOpen(!isOpen)} src={DownArrowIcon} />
          </button>
        </li>
        {isOpen ? (
          <ul className="sc-doTJkw cyyftz">
            <li className="dropdown--item">
              <button
                className="li-btn"
                onClick={() => {
                  setSelectedOperator('AND');
                  props.handleOnChange('AND');
                  setIsOpen(false);
                }}
              >
                {t('combinator_and')}
              </button>
            </li>
            <li className="dropdown--item">
              <button
                className="li-btn"
                onClick={() => {
                  props.handleOnChange('OR');
                  setSelectedOperator('OR');
                  setIsOpen(false);
                }}
              >
                {t('combinator_or')}
              </button>
            </li>
          </ul>
        ) : (
          ''
        )}
      </ul>
    </>
  );
};

export default CustomCombinatorSelector;
