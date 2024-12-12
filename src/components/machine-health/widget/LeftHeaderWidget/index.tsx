// 3rd party libs
import React, { ReactElement } from 'react';

// Component
import { Typography } from 'components/index';
import styled from 'styled-components';
import { Value } from 'components/KPICard/CardComponents';
import theme from 'themes';

interface Props {
  title: string | number;
  subTitle?: string;
  values: Value[];
}
// Styling
const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  height: 6.25rem;
  background: ${theme.colors.white};
  border: 0.0625rem solid ${theme.colors.lightGrey5};
  border-radius: 0.5rem;
  text-align: center;
`;

const StyledCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  width: 8.75rem;
  height: 6.25rem;
  background: ${theme.colors.lightGrey1};
  border-top: 0.0625rem solid ${theme.colors.lightGrey5};
  border-bottom: 0.0625rem solid ${theme.colors.lightGrey5};
  border-radius: 0.5rem;
  min-width: 12.625rem;
  text-align: center;
  padding-top: 2.1875rem;
`;

const MultiValueContainer = styled.div`
  width: 100%;
  height: 100%;
  border-left: 0.0625rem solid ${theme.colors.lightGrey5};
  margin: 0 auto;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .ui-value {
    font-size: clamp(20px, 3vw, 36px);
    margin: 0;
  }
  .ui-title {
    padding: 0;
    margin: 0;
  }
`;

const renderValues = (values: Value[]) => {
  return values.map((value, index) => {
    return (
      <MultiValueContainer key={index}>
        <Typography size="1rem" weight="semi-bold" className="ui-value">
          {value && value.value}
          {value && value.unit}
        </Typography>
        <Typography size="1rem" color={theme.colors.mediumGrey2} className="ui-title">
          {value && value.valueTitle}
        </Typography>
      </MultiValueContainer>
    );
  });
};
const LeftHeaderWidget = ({ title, subTitle, values }: Props): ReactElement => {
  return (
    <StyledCardContainer>
      <StyledCardTitle>
        <Typography size="1.3125rem" weight="bold" mb="0.3125rem">
          {title}
        </Typography>
        <Typography size="1rem" color={theme.colors.mediumGrey2}>
          {subTitle}
        </Typography>
      </StyledCardTitle>
      {renderValues(values)}
    </StyledCardContainer>
  );
};

export default LeftHeaderWidget;
