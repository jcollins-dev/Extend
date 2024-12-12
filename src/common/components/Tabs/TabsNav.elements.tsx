import styled from 'styled-components';
import { UiContainerProps } from 'common/ui/StyledUi';
import { styledTheme } from 'components';

export const baseClass = 'tabs-nav';

export const TabsNavContainer = styled.nav<UiContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: #fbfcff;
  font-size: 1em;

  .${baseClass}__nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    border-style: solid;
    border-width: 0 0 2px 0;
    border-color: transparent;
    font-weight: 500;
    text-decoration: none;

    padding: ${styledTheme.space.md};
    color: ${styledTheme.color.main};

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &:not(.is-disabled) {
      cursor: pointer;

      &.is-current {
        cursor: arrow !important;
        border-color: ${styledTheme.color.secondary};
      }

      &:hover,
      &.is-current {
        background-color: ${styledTheme.color.secondaryLight};
        color: ${styledTheme.color.secondary};
      }
    }
  }
`;
