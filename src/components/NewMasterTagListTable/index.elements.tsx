import styled from 'styled-components';

export const NewStyledTable = styled.table`
  width: -webkit-fill-available;
  text-align: center;
  overflow: auto;
  border-collapse: collapse;
  font-size: 0.8125rem;
  border-spacing: 0;
  table-layout: fixed;
  min-width: 100%;

  thead {
    background: #fff;
    margin: 0;
    position: sticky;
    top: 0;
    z-index: 11;
    th {
      padding: 0.5rem 0.25rem;
      text-transform: capitalize;
    }
    .select-none,
    .disabled-sort {
      display: flex !important;
      justify-content: center;
      float: left;
      margin-left: 1rem;
    }
    .disabled-sort div {
      visibility: hidden;
    }
  }

  /* Apply alternate row coloring + optional borders */
  tbody {
    td {
      padding: 0.5rem 0.625rem;
      span {
        float: left;
        margin-left: 1.125rem;
      }
    }

    tr:last-child {
      background-color: transparent;
      & th {
      }
    }
    tr td input:not([type="checkbox"]), select {
      min-width: 10rem;
  }
  table thead .disabled-sort {
    display: inline-block;
    width: 100%;
    overflow: auto;
  }

`;

export const TableHead = styled.thead`
  background: #fff;
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 11;
`;

export const TableHeading = styled.th`
  padding: 0.125rem 0.25rem;
  text-align: left;
  padding: 0.8rem !important;
`;

export const TableData = styled.td`
  padding: 0.625rem !important;
`;

export const TableContainer = styled.div`
  max-height: 32rem;
  overflow: auto;

  @media (min-width: 2160px) {
    max-height: 42rem;
  }
`;
