import styled from 'styled-components';

export const SearchTagSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 0.5625rem;
  width: 100%;
  height: 2.5rem;
  margin-bottom: 2rem;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0.625rem;
  gap: 0.5625rem;
  width: 30.1875rem;
  height: 2.5rem;
  flex: 1;
`;
export const SearchBox = styled.input`
  width: 100%;
  height: 2.5rem;
  font-size: 0.8125rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey4};
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;
export const IconContainer = styled.div`
  display: flex;
  margin-bottom: 0;
`;
export const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-basis: 30%;
  justify-content: end;
  button {
    margin: 1rem;
    width: auto;
  }
`;
export const FontContainer = styled.div`
  width: fit-content;
  flex-basis: 5%;
`;

export const MasterTagListField = styled.input`
  width: 100%;
  height: 2.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey4};
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }

  @media (min-width: 1700px) {
    font-size: 0.95rem;
  }
`;

export const CheckBoxContainer = styled.div`
  margin-right: 1rem;
`;
