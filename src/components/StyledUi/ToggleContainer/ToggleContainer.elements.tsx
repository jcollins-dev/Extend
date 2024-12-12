import styled from 'styled-components';

export const ToggleContainerContainer = styled.div`
  display: block;
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;

  &.toggle-container--has-border {
    border-bottom: solid 1px rgba(0, 0, 0, 0.5);
  }

  .toggle-container-header {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
  }

  .toggle-container-header__title {
    display: flex;
    gap: 0.5em;
    font-weight: 500;
  }

  .toggle-container__toggler {
    min-height: max-content;
    display: grid;
    grid-gap: 0.5em;
    cursor: pointer;
    grid-template-columns: 1fr auto;

    .icon__chev--right {
      height: 0.7em;
      width: auto;
      transition: all 300ms 130ms ease;
    }
  }

  .toggle-container-main {
    transition: all 400ms ease;
    overflow: hidden;
    border-top: solid 0.5em transparent;
  }

  &.toggle-container--is-open {
    .toggle-container__toggler {
      .icon__chev--right {
        transform: rotate(-90deg);
      }
    }
    .toggle-container-main {
      max-height: 300px;
    }
  }

  &.toggle-container--is-closed {
    .toggle-container__toggler {
      .icon__chev--right {
        transform: rotate(90deg);
      }
    }
    .toggle-container-main {
      max-height: 0px;
    }
  }
`;
