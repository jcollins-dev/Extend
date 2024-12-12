import styled from 'styled-components';

export const PopupModalContainer = styled.div`
  background-color: #ffff;
  border: none;
  border-radius: 0.625rem;
  padding: 2.5rem;

  h2 {
    color: '#303E47';
  }

  p {
    font-family: Roboto;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    letter-spacing: 0;
    text-align: left;
  }

  span {
    display: flex;
    justify-content: end;
    font-size: 1.75rem;
  }

  h2 {
    margin-top: 0;
  }

  div {
    display: flex;
    justify-content: end;
    margin-top: 3.875rem;
  }
`;

export const Btn1 = styled.button`
  padding: 0.625rem 1.875rem;
  border: 0.063rem solid #d1d5db;
  border-radius: 0.625rem;
  margin-right: 0.625rem;
  cursor: pointer;
`;

export const Btn2 = styled.button`
  padding: 0.625rem 1.875rem;
  border: 0.063rem solid #d9d9d9;
  border-radius: 0.625rem;
  background-color: #0a70ff;
  color: #fff;
  cursor: pointer;
`;

export const Machine = styled.div`
  margin: 0.5rem 1rem 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-radius: 0.625rem;
  padding: 0.625rem;
`;

export const Container = styled.div`
  max-height: 41rem;
  overflow: auto;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  padding: 1rem 0;
  margin-bottom: 1rem;

  > div {
    padding-right: 1rem;
  }
`;

export const RadioButtonContainer = styled.div`
  margin-top: 1rem;
`;
