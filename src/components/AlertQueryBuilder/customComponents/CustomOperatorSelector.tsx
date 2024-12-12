import BaseSelect from 'components/BaseSelect/BaseSelect';
import React, { useMemo } from 'react';
import { OperatorSelectorProps } from 'react-querybuilder';
import { useTranslation } from 'react-i18next';
import { Loader } from 'components';
import { useGetAlertEnumsQuery } from 'api';

const CustomOperatorSelector = (props: OperatorSelectorProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const { data: EnumsTypes, isFetching: isAlertTypeFetching } = useGetAlertEnumsQuery();

  const operatorsList = useMemo(() => {
    if (!isAlertTypeFetching) {
      if (!EnumsTypes || !EnumsTypes.logicStatementComparisonOperator) {
        // Handle the case where EnumsTypes or its property is undefined
        return [{ label: 'No Logic Statement Operator', value: 'no_logic_statement_operator' }];
      }

      if (EnumsTypes && EnumsTypes.logicStatementComparisonOperator.length > 0) {
        return EnumsTypes.logicStatementComparisonOperator.map((item: string) => ({
          label: modifyLabel(item),
          value: item
        }));
      } else {
        return [{ label: 'No Logic Statement Operator', value: 'no_logic_statement_operator' }];
      }
    }

    return [];
  }, [EnumsTypes, isAlertTypeFetching]);

  if (isAlertTypeFetching) {
    return <Loader />;
  }

  // to modify the label for Operator Dropdown
  function modifyLabel(label: string) {
    if (label == 'EQUAL')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (=)`;
    if (label == 'NOT_EQUAL')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (!=)`;
    if (label == 'GREATER_THAN')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (>)`;
    if (label == 'GREATER_THAN_OR_EQUAL')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (>=)`;
    if (label == 'LESS_THAN')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (<)`;
    if (label == 'LESS_THAN_OR_EQUAL')
      return `${label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())} (<=)`;
    else
      return label
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  return (
    <>
      <BaseSelect
        // disabledLabel={'tag_already_assigned'}
        handleChange={(e) => {
          props.handleOnChange(e ? e.target.value : null);
        }}
        labelField="id"
        options={operatorsList ? operatorsList : []}
        placeholder={t('select_an_operator') as string}
        searchable={false}
        searchBy="label" // label is assigned as friendlyName value
        value={props?.value === '=' ? '' : (props?.value as string)}
        valueField="id"
        isRequied
        tooltipText="Operator Is Required"
      />
    </>
  );
};

export default CustomOperatorSelector;
