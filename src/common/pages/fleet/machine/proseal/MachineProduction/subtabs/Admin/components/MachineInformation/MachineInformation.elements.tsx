import { styledTheme } from 'components';
import styled from 'styled-components';

export const AdminSection = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden; /* Hide vertical scrollbar */

  .admin_collapse_button {
    background: none;
    border: 0;
    cursor: pointer;
    margin-right: 1rem;

    &.open {
      transform: rotate(0deg);
    }

    &.closed {
      transform: rotate(-90deg);
    }
  }

  .admin_title_section {
    display: flex;

    h2 {
      margin: 0.5rem 0;
    }
  }

  .admin_content_section {
    margin: 0.5rem 0;
    width: 100%;
    transition: all 0.1s ease;
    overflow: hidden;
    overflow-y: hidden;

    &.open {
      overflow-y: hidden;

      @media (min-width: 1100px) {
        max-height: 600px;
        overflow-y: hidden;
      }
    }

    &.closed {
      overflow-y: hidden;
      max-height: 0px;
    }

    // hide submit btn
    &.hidden {
      .global-form__buttons {
        display: none;
      }
    }

    // show submit buttons
    &.visible {
      .input-group__input-field {
        background: #ffffff;
      }

      .global-form__buttons {
        display: block;
      }
    }

    .global-form__inputs {
      overflow-y: hidden;

      @media (min-width: 1100px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
          'a b'
          'c d'
          'e f'
          'g h'
          'i j';
        column-gap: 20%;
      }
    }

    .input-group--customer {
      grid-area: a;
    }

    .input-group--serialNumber {
      grid-area: c;
    }

    .input-group--portalDataBaseName {
      grid-area: e;
    }

    .input-group--proVisionStorageContainer {
      grid-area: g;
    }

    .input-group--databaseSchema {
      grid-area: i;
    }

    .input-group--eWONName {
      grid-area: b;
    }

    .input-group--deviceSerialNumber {
      grid-area: d;
    }

    .input-group--displayName {
      grid-area: f;
    }

    .input-group--subsciptionEndDate {
      grid-area: h;
    }

    .input-group--machineTimeZone {
      grid-area: j;
    }

    .input-group {
      width: 100%;
      padding: 0.25rem 0;
    }
  }

  .admin_section--button {
    margin: 2rem 0;

    &.visible {
      display: block;
    }
    &.hidden {
      display: none;
    }

    .button {
      background: ${styledTheme.color.secondary};
      border: 0;
      border-radius: 2rem;
      color: #ffffff;
      padding: 0.5rem 2rem;
      cursor: pointer;
    }
  }

  .global-form__buttons {
    margin: 2rem 0;

    .form-button {
      background: ${styledTheme.color.secondary};
      border: 0;
      border-radius: 2rem;
      color: #ffffff;
      padding: 0.5rem 2rem;
      cursor: pointer;
    }

    input.form-button {
      margin-right: 1rem;
    }

    button.form-button {
      background: ${styledTheme.color.gray};
    }
  }
`;
