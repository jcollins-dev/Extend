import styled from 'styled-components';

export const SiteLayoutContainer = styled.div`
  position: relative;
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    'header'
    'main'
    'footer';

  > header {
    grid-area: header;
  }

  > footer {
    grod-area: footer;
  }

  .mobile-view-mask {
    overflow: hidden;
    display: grid;
    max-height: 100%;
  }

  .mobile-view-container {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'nav main';
    overflow: hidden;
    transition: transform 0 ease-in-out;

    > nav {
      grid-area: nav;
      width: 200px;
    }

    main {
      max-height: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      grid-area: main;
    }
  }

  .burger-menu-button {
    display: none;
    background: green;
    border: none;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    height: 1.5em;
  }

  @media (max-width: 1000px) {
    .mobile-view-container {
      > nav {
        width: 3em;
        .site-nav-main {
          width: 40px;
        }
        .site-nav-main-item {
          display: block;

          .site-nav-main-item__label {
            display: none;
          }
        }
      }
    }
  }

  @media (max-width: 500px) {
    .burger-menu-button {
      display: flex;
    }

    .mobile-view-container {
      width: 200vw;
      grid-template-columns: 1fr 1fr;
      transform: translateX(-50%);

      &.is-open {
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
      }

      > nav {
        width: 100%;
      }
    }
  }
`;
