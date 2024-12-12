import React, { useEffect, useState } from 'react';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import CustomRemoveGroupBtn from './customComponents/CustomRemoveGroupBtn';
import CustomRemoveRuleBtn from './customComponents/CustomRemoveRuleBtn';
import CustomAddGroupBtn from './customComponents/CustomAddGroupBtn';
import CustomAddRuleBtn from './customComponents/CustomAddRuleBtn';
import CustomValueEditor from './customComponents/CustomValueEditor';
import CustomFieldEditor from './customComponents/CustomFieldEditor';
import CustomOperatorSelector from './customComponents/CustomOperatorSelector';
import CustomCombinatorSelector from './customComponents/CustomCombinatorSelector';
import 'react-querybuilder/dist/query-builder.css';
import './style.css';

interface QueryBuilderProp {
  onDataChange: (data: string, parentId?: string, id?: string) => void;
  queryData: LogicGroup2 | ConvertedRuleGroup;
}

// initial default query
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

export interface LogicStatement {
  tagId: string;
  comparisonOperator: string;
  logicGroupId?: string;
  id?: string;
  logicStatementValues: {
    value: string | null;
    tagId: string | null;
    id?: string;
    logicStatementId?: string;
    businessUnitId: string | null;
  }[];
}

export interface LogicGroup2 {
  id?: string;
  alertId?: string | null;
  parentLogicGroupId?: string | undefined;
  logicOperator: string;
  name: string;
  position: number;
  logicGroups: LogicGroup2[];
  logicStatements: LogicStatement[];
}
interface ConvertedRule {
  field: string;
  operator: string;
  value: string;
  logicGroupId?: string;
  id?: string;
  statementValuesIds?: {
    logicStatementId?: string;
    id?: string;
  }[];
}

export interface ConvertedRuleGroup {
  id: string | undefined;
  combinator: string;
  rules: (ConvertedRule | ConvertedRuleGroup)[];
  parent_logic_group_id?: string | undefined;
}

function convertLogicGroup(logicGroup: LogicGroup2): ConvertedRuleGroup {
  const newGroup: ConvertedRuleGroup = {
    id: 'root',
    combinator: logicGroup.logicOperator,
    rules: [],
    parent_logic_group_id: ''
  };

  logicGroup &&
    logicGroup?.logicStatements &&
    logicGroup?.logicStatements?.forEach((statement) => {
      const rule: ConvertedRule = {
        field: statement.tagId,
        operator: statement.comparisonOperator,
        logicGroupId: statement.logicGroupId,
        id: statement.id,
        value: statement.logicStatementValues
          .map((value) =>
            value.value ? value.value + '/' + undefined : undefined + '/' + value.tagId
          )
          .join(','),
        statementValuesIds: statement.logicStatementValues.map((value) => {
          return {
            logicStatementId: value.logicStatementId,
            id: value.id
          };
        })
      };

      newGroup.rules.push(rule);
    });

  logicGroup &&
    logicGroup?.logicGroups &&
    logicGroup?.logicGroups?.forEach((childGroup, index) => {
      const childRuleGroup = convertLogicGroup(childGroup);
      newGroup.parent_logic_group_id = childGroup.parentLogicGroupId;
      newGroup.id = childGroup.id;
      newGroup.rules.push({
        id: `ruleGroup${index + 1}`,
        combinator: childGroup.logicOperator,
        rules: childRuleGroup.rules
      });
    });

  return newGroup as ConvertedRuleGroup;
}

function convertJsonToNewFormat(jsonObj: LogicGroup2 | ConvertedRuleGroup): ConvertedRuleGroup {
  if (jsonObj && jsonObj?.id !== 'root') {
    return convertLogicGroup(jsonObj as LogicGroup2);
  } else {
    return defaultQuery as ConvertedRuleGroup;
  }
}

export const AlertQueryBuilder = ({ onDataChange, queryData }: QueryBuilderProp): JSX.Element => {
  const [query, setQuery] = useState<ConvertedRuleGroup>(convertJsonToNewFormat(queryData));
  const getRulesLength = (index: number) => {
    return JSON.parse(formatQuery(query, 'json')).rules[index].rules.length;
  };

  const getGroupsLength = () => {
    return JSON.parse(formatQuery(query, 'json')).rules.length;
  };

  useEffect(() => {
    onDataChange(
      formatQuery(query, 'json'),
      convertJsonToNewFormat(queryData).parent_logic_group_id,
      convertJsonToNewFormat(queryData).id
    );
  }, [query]);

  return (
    <>
      <QueryBuilder
        onQueryChange={(q) => {
          setQuery(q);
        }}
        query={query && query}
        controlElements={{
          valueEditor: CustomValueEditor,
          fieldSelector: CustomFieldEditor,
          combinatorSelector: CustomCombinatorSelector,
          removeRuleAction: (props) => (
            <CustomRemoveRuleBtn getRulesLength={getRulesLength} {...props} />
          ),
          removeGroupAction: (props) => (
            <CustomRemoveGroupBtn getGroupsLength={getGroupsLength} {...props} />
          ),
          addGroupAction: CustomAddGroupBtn,
          addRuleAction: CustomAddRuleBtn,
          operatorSelector: CustomOperatorSelector
        }}
        addRuleToNewGroups
        resetOnOperatorChange
        debugMode
        resetOnFieldChange={false}
        controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
      />
    </>
  );
};

export default AlertQueryBuilder;
