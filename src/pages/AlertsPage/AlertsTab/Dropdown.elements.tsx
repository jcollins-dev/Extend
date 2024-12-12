import styled from 'styled-components';

export const Nav = styled.div`
  display: inline-block;
  text-align: left;

  a {
    display: block;
    line-height: inherit;
    cursor: pointer;
    text-align: center;
  }
  ul {
    list-style: none;
    z-index: 1;
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
    display: inline-block;
    position: relative;
    cursor: pointer;
    font-weight: 500;
    width: 10rem;
    span {
      &:hover {
        .nav__submenu {
          display: block;
        }
      }
    }
  }
  .icon {
    padding-left: 1rem;
  }
`;

export const NavSubMenu = styled.ul`
  flex-direction: column;
  list-style: none;
  position: absolute;
  width: max-content;
  top: 3rem;
  left: 0rem;
  background: #fff;
  padding: 0rem 1rem;
  box-shadow: 0rem 0.438rem 0.563rem 0rem #0000001a;
  border-radius: 0.313rem;
  border-top-left-radius: 0rem;
  border-top-right-radius: 0rem;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  height: 45px;
  width: max-content;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0 10px 0px 0px;
  &:hover {
    border: 1px solid #0076cc;
    background-color: #f2f3f4;
  }
`;

export const LinkCell = styled.span`
  font-size: 14px;
`;

export const LinkColumn = styled.div`
  a {
    text-decoration: none;
    color: #303e47;
    display: flex;
  }
`;
