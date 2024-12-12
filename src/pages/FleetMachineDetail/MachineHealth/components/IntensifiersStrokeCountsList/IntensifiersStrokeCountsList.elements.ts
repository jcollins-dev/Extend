import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';
import { WidgetUiHeaderStyles, WidgetUiBorderStyles, basePad } from 'common/ui/WidgetUi.elements';
import { styledTheme } from 'components';

export const IntensifiersStrokeCountsListContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;

  ${WidgetUiBorderStyles}

  .intensifiers-stroke-counts-list__scroll-area {
    height: 100%;
    overflow-y: auto;
  }

  .list-area {
    max-width: 300px;
  }

  h2 {
    ${WidgetUiHeaderStyles}
    padding: ${basePad} ${basePad} 0 ${basePad};
  }
`;

export const CollapseContainer = styled.div<StyledUiContainerProps>`
  font-size: 0.85em;
  padding: ${basePad};

  h3 {
    font-weight: 500;
    cursor: pointer;
    display: grid;
    gap: 0.5em;
    grid-template-columns: 14px 1fr auto;
    align-items: center;
    padding: 0;
    margin: 0;

    .icon-left {
      display: block;
      width: 13px;
    }
  }

  .collapse-area {
    max-height: 0;
    overflow: hidden;

    padding-left: 13px;
    margin-left: 0.5em;
  }

  .intensifiers-stroke-counts-list-item__alert {
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  .intensifiers-stroke-counts-list-item__date {
    display: flex;
    gap: 0.3em;
  }

  .intensifiers-stroke-counts-list-item__message {
    color: rgba(102, 102, 102, 1);
  }

  .icon-chevron {
    transform: rotate(-90deg);
    path {
      fill: ${styledTheme.color.main};
    }
  }

  &.is-open {
    .collapse-area {
      max-height: max-content;
    }

    .icon-chevron {
      transform: rotate(180deg);
      path {
        fill: ${styledTheme.color.secondary};
      }
    }
  }

  .icon-line-graph {
    height: 1em;
  }
`;
