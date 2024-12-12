import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AlertQueryBuilder, { ConvertedRuleGroup, LogicGroup2 } from 'components/AlertQueryBuilder';
import { Loader, TooltipWrapper } from 'components';
import { useGetMachineByIdQuery } from 'api';
import { AlertLogicTitle, Container, HideToggleButton } from './index.elements';
import {
  LogicGroup,
  QueryBuilderRule,
  RuleCondition,
  RuleGroup,
  queryBuilderDesireRule
} from 'types/machine-health/alerts';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import ToolTipIcon from '../assets/info_logo.svg';
import { useParams } from 'react-router-dom';
export interface AlertLogicProps {
  onQueryDataChange: (data: queryBuilderDesireRule) => void;
  queryData?: LogicGroup2;
}

const defaultQuery: ConvertedRuleGroup = {
  id: 'root',
  combinator: 'AND',
  rules: [
    {
      id: 'ruleGroup',
      combinator: 'AND',
      rules: [{ field: '', operator: '=', value: '' }]
    }
  ]
};

const AlertLogic: React.FC<AlertLogicProps> = ({ onQueryDataChange, queryData }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { t } = useTranslation(['mh']);
  const { machineId } = useFleetMachineAccountData();
  const params: {
    alertId: string;
    machineId: string;
  } = useParams();
  const MACHINE_ID = machineId;
  const { data: currentMachine, isFetching } = useGetMachineByIdQuery(
    MACHINE_ID ? MACHINE_ID : skipToken
  );

  const handleQueryChange = (data: string) => {
    onQueryDataChange(convertJsonToDesiredFormat(JSON.parse(data)));
  };

  function convertRule(
    rule: RuleGroup,
    position: number,
    parentId?: string | undefined
  ): queryBuilderDesireRule {
    const logicStatements = rule.rules.map((rule: RuleCondition, index: number) => {
      const ruleValueInString = String(rule.value);
      if (rule.operator === 'BETWEEN' || rule.operator === 'NOT_BETWEEN') {
        const logic_statement_values: {
          value?: string | number;
          value_type?: string;
          business_unit_id?: number | undefined;
          tag_id?: string;
          relativity?: string;
          id?: string;
          logic_statement_id?: string;
        }[] = [];
        const parts = ruleValueInString && ruleValueInString.split(',');
        const [thresholdValue1, tag_id1] = parts && parts[0]?.split('/');
        const [thresholdValue2, tag_id2] = parts && parts[1]?.split('/');
        if (tag_id1 !== 'undefined') {
          logic_statement_values.push({
            tag_id: tag_id1,
            business_unit_id: currentMachine && (currentMachine.businessUnit as number),
            relativity: thresholdValue1 > thresholdValue2 ? 'UPPER' : 'LOWER',
            id: rule?.statementValuesIds && rule?.statementValuesIds[0]?.id,
            logic_statement_id:
              rule?.statementValuesIds && rule?.statementValuesIds[0]?.logicStatementId
          });
        } else {
          if (!isNaN(parseFloat(thresholdValue1))) {
            logic_statement_values.push({
              value: thresholdValue1,
              value_type: 'FLOAT',
              relativity: thresholdValue1 > thresholdValue2 ? 'UPPER' : 'LOWER',
              id: rule?.statementValuesIds && rule?.statementValuesIds[0]?.id,
              logic_statement_id:
                rule?.statementValuesIds && rule?.statementValuesIds[0]?.logicStatementId
            });
          }
        }

        if (tag_id2 !== 'undefined') {
          logic_statement_values.push({
            tag_id: tag_id2,
            business_unit_id: currentMachine && (currentMachine.businessUnit as number),
            relativity: thresholdValue2 > thresholdValue1 ? 'UPPER' : 'LOWER',
            id: rule?.statementValuesIds && rule?.statementValuesIds[1]?.id,
            logic_statement_id:
              rule?.statementValuesIds && rule?.statementValuesIds[1]?.logicStatementId
          });
        } else {
          if (!isNaN(parseFloat(thresholdValue2))) {
            logic_statement_values.push({
              value: thresholdValue2,
              value_type: 'FLOAT',
              relativity: thresholdValue2 > thresholdValue1 ? 'UPPER' : 'LOWER',
              id: rule?.statementValuesIds && rule?.statementValuesIds[1]?.id,
              logic_statement_id:
                rule?.statementValuesIds && rule?.statementValuesIds[1]?.logicStatementId
            });
          }
        }

        const logicStatement = {
          tag_id: rule.field,
          business_unit_id: currentMachine && (currentMachine.businessUnit as number), // You can set the business_unit_id based on your requirements
          comparison_operator: rule.operator,
          position: index,
          id: rule.id,
          logic_group_id: rule.logicGroupId,
          logic_statement_values: logic_statement_values
        };
        return logicStatement;
      } else {
        const logic_statement_values: {
          value?: string | number;
          id?: string | undefined;
          logic_group_id?: string | undefined;
          value_type?: string;
          business_unit_id?: number | undefined;
          tag_id?: string;
          relativity?: string;
          logic_statement_id?: string;
        }[] = [];

        const value_with_tag = ruleValueInString && ruleValueInString.split('/');
        const [threshold_value, tag_id_value] = value_with_tag;

        if (tag_id_value !== 'undefined') {
          logic_statement_values.push({
            tag_id: tag_id_value,
            business_unit_id: currentMachine && (currentMachine.businessUnit as number),
            id: rule?.statementValuesIds && rule?.statementValuesIds[0]?.id,
            logic_statement_id:
              rule?.statementValuesIds && rule?.statementValuesIds[0]?.logicStatementId
          });
        } else {
          logic_statement_values.push({
            value: threshold_value,
            value_type: rule.operator === 'CONTAINS' ? 'STRING' : 'FLOAT',
            id: rule?.statementValuesIds && rule?.statementValuesIds[0]?.id,
            logic_statement_id:
              rule?.statementValuesIds && rule?.statementValuesIds[0]?.logicStatementId
          });
        }
        const logicStatement = {
          tag_id: rule.field,
          business_unit_id: currentMachine && (currentMachine.businessUnit as number),
          comparison_operator: rule.operator,
          position: index,
          id: rule.id,
          logic_group_id: rule.logicGroupId,
          logic_statement_values: logic_statement_values
        };
        return logicStatement;
      }
    });
    return {
      logic_operator: rule.combinator.toUpperCase(),
      name: `Logic Group ${position + 1}`,
      position,
      logic_groups: [],
      id: logicStatements[0] ? logicStatements[0].logic_group_id : undefined,
      parent_logic_group_id: parentId ? parentId : undefined,
      logic_statements: logicStatements
    };
  }

  function convertRuleGroup(ruleGroup: QueryBuilderRule): queryBuilderDesireRule {
    const logicGroups = ruleGroup.rules.map(
      (rule: RuleGroup, index: number): LogicGroup =>
        convertRule(rule, index, ruleGroup.parent_logic_group_id)
    );
    return {
      logic_operator: ruleGroup.combinator,
      name: 'Root Logic Group',
      position: 0,
      id: queryData?.id ? queryData?.id : undefined,
      alert_id: queryData?.alertId ? queryData?.alertId : undefined,
      logic_groups: logicGroups,
      logic_statements: []
    };
  }

  const convertJsonToDesiredFormat = (jsonData: QueryBuilderRule): queryBuilderDesireRule => {
    const transformedData = convertRuleGroup(jsonData);
    return transformedData;
  };

  if (isFetching || (!queryData && params.alertId)) {
    return <Loader />;
  }

  return (
    <Container>
      <div style={{ display: 'flex' }}>
        <HideToggleButton onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} color={'#303E47'} />
        </HideToggleButton>
        <AlertLogicTitle>{t('alert_logic') as string}</AlertLogicTitle>{' '}
        <div>
          <TooltipWrapper Tooltip={t('alert_logic_tooltip_message') as string} width={700} left>
            <img
              style={{ margin: '1rem 0.5rem', cursor: 'pointer' }}
              src={ToolTipIcon}
              alt="Icon"
            />
          </TooltipWrapper>
        </div>
      </div>
      {isOpen ? (
        queryData ? (
          <AlertQueryBuilder
            onDataChange={handleQueryChange}
            queryData={params.alertId ? queryData : defaultQuery}
          />
        ) : (
          <AlertQueryBuilder onDataChange={handleQueryChange} queryData={defaultQuery} />
        )
      ) : null}
    </Container>
  );
};

export default AlertLogic;
