import styled from 'styled-components';

interface ImageOptionProps {
  marginLeft?: string;
  marginTop?: string;
}
export const StyledTable = styled.table`
  width: -webkit-fill-available;
  text-align: center;
  overflow: hidden;
  border-collapse: collapse;
  font-size: 0.8125rem;

  thead {
    th {
      border-bottom: 0.0625rem solid #dadada;
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
      border-bottom: 0.0625rem solid #f3f2f1;
      padding: 0.5rem 0.625rem;
      span {
        float: left;
        margin-left: 1.125rem;
      }
    }

    tr:last-child {
      border-bottom: none;
      background-color: transparent;
      & th {
        border-bottom: none;
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

export const StyledColumnRefContainer = styled.div`
  padding: 0.375rem 0.25rem;
`;

export const StyledNonDraggableColumnRefContainer = styled.div`
  padding: 0.5rem 0.5rem;
`;

export const StyledDragRefContainer = styled.div`
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
`;

export const StyledTFoot = styled.tfoot`
  color: gray;
  & th {
    font-weight: normal;
  }
`;

export const StyledAscDescContainer = styled.div`
  margin-left: 0.5rem;
  margin-top: -0.125rem;
  div: nth-child(2) {
    margin-top: -0.625rem;
  }
`;

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  cursor: pointer;
  height: 1rem;
`;
export const ColumnOption = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 1rem 0.5rem;
`;
export const TableFilterOption = styled.div`
  width: 1rem;
  cursor: pointer;
`;
export const FilterSelectWrapper = styled.div`
  position: relative;
  top: 1rem;
  display: flex;
  width: 10rem;
`;
export const ImageOptionWrapper = styled.div`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
`;
export const ImageOption = styled.img<ImageOptionProps>`
  width: 100%;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '0')};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0')};
`;
export const OptionsModalContainer = styled.div`
  width: 100%;
  padding: 0.5rem 2rem;

  p {
    margin-bottom: 0.5rem;
  }
`;

export const SelectionHeader = styled.div`
  margin-left: 1rem;
`;

export const OptionalColumnContainer = styled.div`
  width: 100%;
  padding: 0.625rem 0.75rem;
`;

export const OptionColumnCheckboxWrapper = styled.div`
  display: flex;
  justify-content: left;
  border: 0.125rem solid ${(props) => props.theme.colors.lightGrey6};
  padding: 0.625rem;
  border-radius: 0.313rem;
  margin-bottom: 0.625rem;
`;

export const OptionalColumnName = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.625rem;
  text-transform: capitalize;
`;

export const SelectAllOptionalColumn = styled.div`
  display: flex;
  padding: 0.625rem 0.75rem;
`;

export const ModalButtonsContainer = styled.div`
  width: 100%;
  padding-right: 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: white;

  button {
    margin: 1rem;
    width: auto;
  }
`;

export const StyledRootContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
