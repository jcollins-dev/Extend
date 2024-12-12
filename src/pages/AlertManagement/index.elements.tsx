import styled from 'styled-components';

export const AlertPageContainer = styled.div`
  &.alert-wrapper {
    padding: 1.375rem 3.25rem;

    .site-page-view__header,
    .site-page-view__view-tab {
      padding: 0;
      box-shadow: none;
    }

    .router-tab-nav__item {
      box-sizing: content-box;
    }

    .router-tab-nav__item,
    .router-tab-nav__item:not([data-disabled='true'])[data-current='true'] {
      background: #ffffff;
      border: 0;
    }

    .router-tab-nav--tabs .router-tab-nav__item:not([data-disabled='true']):hover,
    .router-tab-nav--tabs .router-tab-nav__item:not([data-disabled='true'])[data-current='true'] {
      background: none;
      border-bottom: 2px solid #ffffff;
    }

    .router-tab-nav__item:not([data-disabled='true'])[data-current='true'] {
      color: #0076cc;
      font-weight: 500;
      border-radius: 0;
      border-bottom: 2px solid #0076cc;
    }

    .btn.default {
      display: block;
      margin: 0 auto;
      background: #0076cc;
      border: 0;
      font-weight: 500;
      color: #ffffff;
      border-radius: 7px;
      padding: 0.85rem 1.2rem;
      margin-top: 2rem;

      &:hover {
        cursor: pointer;
      }

      img {
        padding-right: 0.5rem;
      }
    }
  }

  .router-tab-nav.site-page__page-nav.router-tab-nav--tabs {
    display: flex;

    .router-tab-nav__item {
      flex-grow: unset;
    }
  }

  .alert-management-tabs.site-page {
    display: flex;
    flex-direction: column;

    .router-tab-nav--tabs {
      background: none;
    }
  }

  .menu {
    display: flex;
    flex-direction: row;
    list-style: none;
    position: relative;
    padding: 0.5rem 0;
    margin: 0;
    border-bottom: 1px solid #e5e9ed;
    border-top: 1px solid #e5e9ed;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 0.75rem;
      padding: 0.5rem 0.15rem;

      &[data-disabled='true'] {
        opacity: 0.5;
        cursor: default;
      }

      img {
        padding: 0 0.75rem;
      }
    }

    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      background: none;
      border: 0;
      padding: 0 5px;

      img {
        padding: 0 0.75rem;
      }

      &.dropmenu {
        cursor: pointer;
      }
    }
  }
`;

export const DropdownMenuContainer = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  position: absolute;
  top: 48px;
  left: -2px;
  background: #ffffff;
  padding: 0;
  box-shadow: 1px 1px 10px 1px #00000040;
  box-shadow: 0px 7px 9px 0px #0000001a;
  border-radius: 5px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;

  li.dropdown--item {
    display: flex;
    align-items: center;
    padding-left: 0.25rem;
    padding: 0 1rem 0.25rem 0;

    button img {
      max-width: 25px;
      padding: 0.25rem 0.2rem;
    }

    button {
      cursor: pointer;

      &: hover {
        color: #073f8d;
      }
    }
  }
`;

export const StartPage = styled.main`
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .intro_page {
    width: 50vw;
    text-align: center;
    color: #073f8d;
    margin: 2rem auto;
  }

  .button_container {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .button {
      &.action {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #ffffff;
        border-radius: 10px;
        padding: 1rem 3rem;
        margin: 1rem;
        border: 3px solid #ffffff;
        box-shadow: 1px 1px 20px 4px #00000036;
        color: #0076cc;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          border: 3px solid #0076cc;
        }

        img {
          display: inline-block;
          padding: 0.25rem 0.25rem 1rem;
        }
      }
    }
  }
`;
