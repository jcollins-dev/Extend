import styled from 'styled-components';
import { themeColors } from 'themes';

export const NavMenu = styled.ul`
  line-height: 2.813rem;
  display: flex;
  align-items: start;
  font-size: 0.8125rem;
  .nav__menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0rem 1rem 0rem 0rem;
    border-radius: 0;
  }
  .icon {
    padding-left: 1rem;
  }
`;

export const Nav = styled.div`
  display: block;
  text-align: left;
  border: 0;
  width: 100%;
  padding-top: 1rem;
  border-bottom: 1px solid ${themeColors.lightGrey7};
  a {
    display: block;
    margin: 0 1rem;
    line-height: inherit;
    cursor: pointer;
    text-align: center;
  }
  ul {
    list-style: none;
    z-index: 10;
    padding-left: 10px;
    margin-top: 0;
    margin-bottom: 10px;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  height: 45px;
  width: max-content;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  padding: 0 10px 0px 0px;
  &:hover {
    border: 1px solid ${themeColors.primaryBlue5};
    background-color: #f2f3f4;
  }
`;
export const MainSection = styled.div``;

export const NewTagWrapper = styled.div`
  width: 100%;
  background-color: ${themeColors.lightGrey1};
`;

export const HeadingWrapper = styled.div`
  padding: 2rem;
`;

export const Heading = styled.span`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.172rem;
`;
export const Section = styled.div`
  padding: 0rem 2rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 2rem;
  gap: 2rem;
`;

export const SectionOne = styled.div`
  display: flex;
  gap: 2.8rem;
  flex-direction: column;
  width: 40%;
`;

export const SectionTwo = styled.div`
  width: 100%;
`;
export const TextAreaWrapper = styled.div``;

export const InputWrapper = styled.div``;
export const TableWrapper = styled.div``;

export const StyledTextarea = styled.textarea<{ rows?: number }>`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  row: ${({ rows }) => (rows ? rows : 2)};
  ::placeholder {
    color: ${(props) => props.theme.colors.mediumGrey3};
  }
`;

export const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 2rem;
  width: 20rem;
  max-height: 2.5rem;
`;
export const DropdownWrapper = styled.div`
  width: 25rem;
`;
