import styled from 'styled-components';
import { themeColors } from 'themes';

// Styled components
export const AlertHeading = styled.h2`
  margin: 0 0 1rem 1rem;
`;

export const FormParent = styled.section`
  //padding: 1rem;
  padding-bottom: 2rem;
  //margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (max-width: 768px) {
    padding-bottom: 6rem;
  }
  .dropdown-header-row {
    .header--label {
      color: #000000;
      font-size: 0.875rem;
      text-transform: none;
      padding: 1rem 0.25rem;
    }
    .header--value {
      display: none;
    }
`;

export const FormContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const FormItem = styled.section`
  position: relative;
  flex: 1 0 21%;
  padding: 1rem;
  .label {
    color: #323130;
    font-weight: 700;
    font-size: 0.75rem;

    small {
      color: red;
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    flex-basis: 50%;
  }
  @media (max-width: 480px) {
    flex-basis: 100%;
  }
`;

export const LabelContainer = styled.section`
  display: flex;
`;

export const FormSecondRowItem = styled.section`
  position: relative;
  width: 25%;
  padding: 1rem;
  .label {
    color: #323130;
    font-weight: 700;
    font-size: 0.75rem;

    small {
      color: red;
      font-weight: 700;
    }
  }
  @media (max-width: 768px) {
    flex-basis: 50%;
  }
  @media (max-width: 480px) {
    flex-basis: 100%;
  }
`;

export const StyledInputField = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 0.063rem solid #ccc;
  border-radius: 0.25rem;
  font-size: 100%;
  width: 100%;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
`;

export const Footer = styled.div<{ flexDirection?: string; bgColor?: string }>`
  background-color: transparent;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: revert};
  justify-content: end;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

export const PageContainer = styled.div`
  height: 100%;
  > * {
    flex: 1;
  }
`;

export const HeaderContainer = styled.header`
  padding-bottom: 0.5rem;
  div a h3 {
    color: #666666;
    font-family: 'Roboto';
  }
  div h2 {
    font-family: 'Roboto';
    font-weight: 400;
    color: #323130;
  }
`;

export const FooterButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

export const masterTagLists = [
  { value: 'PNA_Freezer_GCM_10_MTL', label: 'PNA Freezer GCM 10 MTL', isFixed: true },
  { value: 'PNA_Freezer_GCM_20_MTL', label: 'PNA Freezer GCM 20 MTL', isFixed: true },
  { value: 'PNA_Freezer_GCM_30_MTL', label: 'PNA Freezer GCM 30 MTL', isFixed: true }
];

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
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

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
    cursor: pointer;
    border-radius: 0;
  }
  .icon {
    padding-left: 1rem;
  }
`;

export const Tab = styled.span<{ $isSelected?: boolean }>`
  color: ${(props) => (props.$isSelected ? themeColors.primaryBlue5 : themeColors.lightGrey8)};
  border: 0;
  font-size: 0.885rem;
  font-weight: ${(props) => (props.$isSelected ? '600' : '400')};
  display: flex;
`;

export const SubTab = styled.span<{ $isSelected?: boolean }>`
  color: ${(props) => (props.$isSelected ? themeColors.primaryBlue5 : themeColors.lightGrey8)};
  border: 0;
  font-size: 0.885rem;
  font-weight: ${(props) => (props.$isSelected ? '600' : '400')};
  display: flex;
`;

export const NavSubMenu = styled.ul`
  flex-direction: column;
  list-style: none;
  position: absolute;
  top: 3rem;
  left: -0.125rem;
  background: #ffffff;
  padding: 0;
  box-shadow: 0.063rem 0.063rem 0.625rem 0.063rem #00000040;
  box-shadow: 0rem 0.438rem 0.563rem 0rem #0000001a;
  border-radius: 0.313rem;
  border-top-left-radius: 0rem;
  border-top-right-radius: 0rem;
  }
`;
type WarningIconContainerProps = {
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
}
export const WarningIconContainer = styled.div<WarningIconContainerProps>`
  cursor: pointer;
  position: absolute;
  right: ${ ( { right}) => {
    return right || '1.5rem';
  }};
  left: ${({ left}) => {
    return left;
  }};
  top: ${({ top }) => {
    return top || '3.8rem';
  }};
`;

export const Container = styled.div`
  padding: 0.5rem 2rem 1rem 1rem;
  width: 100%;
`;

export const AlertLogicTitle = styled.h2`
  margin: 1rem 0.5rem;
  color: #212121;
  font-size: 1.06rem;
`;

export const HideToggleButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #ab091e;
`;
