import styled from 'styled-components';
import { themeColors } from 'themes';

export const TableXSWrapper = styled.table`
  padding: 0 1rem;

  tr {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.65rem 0;
    border-bottom: 1px solid ${themeColors.lightGrey6};
    width: 100%;

    td:first-child {
      text-align: center;
      width: 12%;
    }

    td:nth-child(2) {
      text-align: center;
      width: 25%;
    }

    td:nth-child(3) {
      padding: 0 0.25rem;
      width: 63%;
    }

    &:last-child {
      border: 0;
    }

    td {
      display: block;

      p {
        margin: 0;
        span {
          display: block;

          &:first-child {
            font-weight: 700;
          }
        }
      }
    }
  }
`;
