import React, { ReactElement, useState } from 'react';
import OmniBlueLogo from '../../img/OmniBlu Logo.svg';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { KetchPreferences } from 'components';

const Textbox = styled.div`
  font-family: ${(props) => props.theme.typography.family};
  font-size: 13px;
  line-height: 18px;
  font-weight: ${(props) => props.theme.typography.text.bodySmall.weight};
  color: ${(props) => props.theme.colors.mediumGrey2};
`;

const Link = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.mediumGrey2};
  cursor: pointer;
`;
const FooterContainer = styled.div`
  height: 24px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-left: 70px;
`;
const FooterOuterContainer = styled.div`
  position: fixed;
  bottom: 0px;
  z-index: 99;
  padding: 5px;
  width: 100%;
  background-color: #ffffff;
`;

const FooterInnerBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  padding: 12px;
`;
interface Props {
  toggleContent?: boolean;
}

const Footer = ({ toggleContent }: Props): ReactElement => {
  const { t } = useTranslation(['common']);
  const [showKetchPreferences, setshowKetchPreferences] = useState(false);

  return (
    <>
      {showKetchPreferences && <KetchPreferences />}
      <FooterOuterContainer>
        <FooterContainer style={{ marginLeft: !toggleContent ? '16.325rem' : '4.325rem' }}>
          <FooterInnerBox>
            <img src={OmniBlueLogo} alt="OmniBlueLogo" />
            <Textbox>{t('all_rights_reserved')}</Textbox>
          </FooterInnerBox>

          <FooterInnerBox>
            <Textbox>
              <Link href="https://www.jbtc.com/terms-of-use/" target="_blank">
                {t('terms')}
              </Link>
            </Textbox>
            <Textbox>
              <Link href="https://www.jbtc.com/privacy-and-cookie-policy/" target="_blank">
                {t('privacy_policy')}
              </Link>
            </Textbox>
            <Textbox>
              <Link onClick={() => setshowKetchPreferences((prevState) => !prevState)}>
                {t('cookie_preferences')}
              </Link>
            </Textbox>
            <Textbox>V1.0</Textbox>
          </FooterInnerBox>
        </FooterContainer>
      </FooterOuterContainer>
    </>
  );
};

export default Footer;
