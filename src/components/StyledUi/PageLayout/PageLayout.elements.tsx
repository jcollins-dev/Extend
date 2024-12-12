import styled from 'styled-components';

interface Props {
  hasHeader?: boolean;
  hasHeaderLeft?: boolean;
  hasHeaderRight?: boolean;
}
export const PageTabViewContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;
  gap: 1.5625rem;
  position: relative;

  .ui-page-tab-view__header {
    display: flex;
    justify-content: flex-end;
    padding: 1.5625rem 3.25rem 0 3.25rem;
    gap: 1.5625rem;

    .ui-date-button-w-dropdown.is-open {
      .date-range-picker {
        position: absolute;
        right: 0;
      }
    }
  }

  .ui-page-tab-view__sub-nav {
    flex-grow: 1;
  }

  .ui-page-tab-view__container {
    padding: 0 50px;

    .alarms_table {
      thead tr,
      tbody tr {
        th:first-child {
          widht: 20%;
        }
        th:nth-child(2) {
          width: 10%;
        }
        th:nth-child(3) {
          width: 10%;
        }
        th:nth-child(4) {
          width: 60%;
        }
      }
    }
  }
`;
