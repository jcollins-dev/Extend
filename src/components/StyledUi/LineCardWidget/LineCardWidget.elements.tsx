import styled from 'styled-components'
import { styledTheme } from '../theme'

export const LineCardWidgetMain = styled.div.attrs(() => ({ className: 'ui-main' }))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: ${styledTheme.space.base};
  padding: ${styledTheme.space.sm};

  .ui-table-wrapper {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: flex-start;
    
    button.ui-icon {
      border: none;
      background: none;
      cursor: pointer;
      display: block;
      color: ${(styledTheme.color.main)};
      transform: translateX(${styledTheme.space.xs});
    }
  }

  .ui-no-issues {
    border-width: 1px;
    border-style: dashed;
    text-align: center;

    border-radius: ${styledTheme.radius.sm};
    border-color: ${styledTheme.color.status.success.base};
    color: ${styledTheme.color.status.success.base};
    background-color: ${styledTheme.color.status.success.light};    
    padding: ${styledTheme.space.base};
  }

`