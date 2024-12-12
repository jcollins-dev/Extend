import React from 'react';
import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `pie-chart-legend`;

export const PieChartLegendContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 250px;
  align-items: center;
  justify-content: center;
  padding: 0 !important;

  .pie-chart-legend {
    display: flex;
    flex-direction: column;
    gap: 1em;
    max-height: 100%;
    overflow-x: auto;
    margin: 0;
  }
`;

interface PieChartLegendItemContainerProps {
  color?: string;
}

export const PieChartLegendItemContainer = styled.li<PieChartLegendItemContainerProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5em;
  font-size: 1.1em;

  &[data-muted='true'] {
    opacity: 0.5;
  }

  &:before {
    content: '';
    width: 1.8em;
    height: 1.8em;
    display: block;
    background-color: ${({ color }) => color};
    border-radius: ${styledTheme.radius.sm};
  }

  button {
    display: flex;
    gap: 0.5em;
    border: none;
    background-color: transparent;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
  }

  .item-count {
    opacity: 0.8;
    font-size: 0.9em;
    display: flex;

    &:before {
      content: '(';
    }

    &:after {
      content: ')';
    }
  }
`;
