import React, { ReactElement } from 'react';
import styled from 'styled-components';
// Components
import { ContextAwareCart, SavedProductList } from 'components';
import jbtOfficialLogo from '../../img/OmniBlu Official Logo.svg';
import jbtLogo from '../../img/JBT_logo.svg';
import TextBadge from '../BadgeWithText/TextBadge';
import breakpoint from 'constants/breakpoints';
import DropdownSelect from '../DropdownMenu/DropdownSelect';
import English from '../../img/English.svg';
import German from '../../img/German1.svg';
import Italian from '../../img/ItalianFlag.svg';
import { useUser } from 'selectors';
import { JBTRoutes } from 'constants/routes';
import { useHistory } from 'react-router-dom';

// Commenting out the functionality related to search and notification.The comments will be removed once required

// const Searchbox = styled.div`
//   width: 60%;
//   height: 40px;
//   @media ${breakpoint.device.lg} {
//     width: 50%;
//   }
//   @media ${breakpoint.device.md} {
//     width: 60%;
//   }
//   @media ${breakpoint.device.sm} {
//     width: 100%;
//   }
// `;

const Body = styled.body`
  margin-top: 60px;
`;

const OuterHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 60px;
  align-items: center;
  position: fixed;
  top: 0px;
  z-index: 999;
  padding-left: 15px;
`;
const InnerLogoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const ImgContainer = styled.div`
  padding-top: 3px;
  width: 60%;
  cursor: pointer;
`;
const Divider = styled.div`
  width: 2px;
  height: 28px;
  background-color: #e5e9ed;
`;
const IconContainer = styled.div`
  width: 33%;
  display: flex;
  gap: 25px;
  justify-content: flex-end;
  padding-right: 15px;
  align-items: center;
`;
const InnerContainer = styled.div`
  width: 33%;
  display: flex;
  flex-wrap: wrap;
  @media ${breakpoint.device.md} {
    width: 26%;
  }
`;
// const SearchContainer = styled.div`
//   width: 34%;
//   display: flex;
//   align-items: center;
//   @media ${breakpoint.device.xs} {
//     width: 32%;
//   }

//   @media ${breakpoint.device.sm} {
//     width: 32%;
//   }

//   @media ${breakpoint.device.md} {
//     width: 30%;
//   }
// `;

const Header = (): ReactElement => {
  const headerColor = process.env.REACT_APP_HEADER_COLOR;
  // const searchColor = process.env.REACT_APP_SEARCH_COLOR;
  // const headerSearch = true;
  // const handleSearchChange = () => {
  //   console.log('search');
  // };
  const options = [
    { value: 'en', label: 'English : English', flag: English },
    { value: 'it', label: 'Italian : Italia', flag: Italian },
    { value: 'de', label: 'German : Deutsch', flag: German }
  ];
  const user = useUser();
  const history = useHistory();
  return (
    <Body>
      <OuterHeaderContainer style={{ backgroundColor: headerColor }}>
        <InnerContainer>
          <InnerLogoContainer>
            <img src={jbtLogo} alt="jbtLogo" />
            <Divider></Divider>
            <ImgContainer
              onClick={() => {
                history.push(JBTRoutes.dashboard);
              }}
            >
              <img src={jbtOfficialLogo} alt="jbtLogo" />
            </ImgContainer>
          </InnerLogoContainer>
        </InnerContainer>
        {/* <SearchContainer>
        <Searchbox>
          <SearchInput
            headerSearch={headerSearch}
            searchColor={searchColor}
            placeholder={'Search'}
            onChange={handleSearchChange}
            borderRadius="0.5rem"
          />
        </Searchbox>
      </SearchContainer> */}

        <IconContainer>
          <DropdownSelect options={options} />
          <SavedProductList />

          <ContextAwareCart />

          {/* <Notification /> */}
          <TextBadge name={`${user?.firstName} ${user?.lastName}`} />
        </IconContainer>
      </OuterHeaderContainer>
    </Body>
  );
};

export default Header;
