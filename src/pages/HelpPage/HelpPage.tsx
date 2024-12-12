import React, { ReactElement, useMemo, useState } from 'react';
import styled from 'styled-components';
import theme from 'themes';
import { useTranslation } from 'react-i18next';
import emergencyIcon from '../../../src/img/emergency-icon.svg';

//Components
import { ContactCard, HelpEmailForm, Card, Loader, Button } from 'components';
import ContactInfo from 'components/ContactCard/ContactInfo';
import { FAQItems } from 'constants/faqs';
// Api
import { useGetBusinessUnitsQuery, useGetHelpPageContactsQuery } from 'api';

// Types
import { BusinessUnit, PlantBuContacts, ContactGroup, ContactItem } from 'types';
import FaqNew from './FaqNew';

// Styling
const Root = styled.article`
  margin: 3.125rem 0rem;
  border-bottom-color: 'black';
  border-bottom-width: 1;
`;

const HelpEmailCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  min-width: 25rem;
  width: 30%;
  @media (max-width: 62.313rem) {
    margin-bottom: 1.25rem;
  }
  & > div {
    overflow: hidden;
    width: 100%;
    min-width: 20rem;
    margin-bottom: 1rem;
    padding: 0 1.3125rem;
    border-radius: 0;
    display: inline-block;
    margin-right: 1rem;
    margin-left: auto;
    height: 100%;
    border: 0;
    border-right: 0.063rem solid #e5e9ed;
    margin: 0;
  }
`;

const ContactCardContainer = styled.div<{ $length?: number }>`
  max-width: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  padding-left: 1.563rem;
  padding-right: 1.563rem;
  padding-top: 0.75rem;
  margin-top: -0.75rem;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 47.938rem) {
    padding-left: 1.375rem;
    padding-right: 0.75rem;
  }
  & > div {
    overflow: hidden;
    padding: 2rem 1.3125rem;
    border-radius: 0.375rem;
    height: 25rem;
    width: ${(props) => (props.$length === 1 ? '100%' : 'calc(50% - 0.75rem)')};
    border: 0;
    box-shadow: 0 0.375rem 0.75rem 0.375rem #10182812;
    overflow-y: scroll;
    border-radius: 0.313rem;
    margin: 0;
    margin-bottom: 1.5rem;
    & > div {
      border: 0;
    }
    @media (max-width: 75rem) {
      width: 100%;
    }
    @media (max-width: 62.313rem) {
      width: calc(50% - 0.75rem);
    }
    @media (max-width: 47.938rem) {
      width: 100%;
    }
    &::-webkit-scrollbar-track {
      background: white;
      opacity: 1;
      box-shadow: none;
    }
    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
    }
  }
`;
const ContactSection = styled.div`
  margin: 0.75rem 0rem;
`;

//Styles for the FAQ Section
const Box = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0rem;
  @media (max-width: 62.313rem) {
    flex-wrap: wrap;
  }
`;
const Mainwrpcontainer = styled.div`
  max-width: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  margin-top: -0.75rem;
  justify-content: space-between;
`;
const Line = styled.hr`
  // border-top: ${(props) => `0.0625rem solid ${props.theme.colors.mediumGrey1}`};
  // margin-top: 1.5rem;
  // margin-bottom: 1.5rem;
  margin: 0;
  border: 0;
`;
const Headingfaq = styled.h2`
  font-size: 2.25rem;
  line-height: 2.637rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  width: 100%;
  padding-top: 1.875rem;
  padding-bottom: 1.875rem;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 30%;
    height: 0.063rem;
    background: #d1d6db;
    left: 10%;
    top: 50%;
  }
  &:after {
    content: '';
    position: absolute;
    width: 30%;
    height: 0.063rem;
    background: #d1d6db;
    right: 10%;
    top: 50%;
  }
`;
const Heading = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: Roboto;
  line-height: 1.172rem;
  margin-top: 0;
`;

const SubHeading = styled.p`
  font-weight: 400;
  font-size: 0.75rem;
  font-family: Roboto;
  line-height: 1.125rem;
`;

const SubHeadingText = styled.p`
  font-weight: 400;
  font-size: 0.813rem;
  font-family: Roboto;
  line-height: 1.125rem;
`;

const ButtonWrapperContainer = styled.div`
  position: fixed;
  right: 0.938rem;
  bottom: 3.125rem;
  button {
    color: #fff;
    gap: 0.75rem;
    font-weight: 400;
    display: none;
  }
`;

const LinkText = styled.a`
  font-weight: 600;
  font-size: 0.813rem;
  font-family: Roboto;
  color: #0076cc;
  cursor: pointer;
`;

const HelpPage = (): ReactElement => {
  const [readMore, setReadMore] = useState(false);
  const { data: businessUnits, isLoading: businessUnitsLoading } = useGetBusinessUnitsQuery();
  const { data: plantBuContacts, isLoading: plantBuContactsLoading } =
    useGetHelpPageContactsQuery();
  const { t } = useTranslation(['common']);
  const plantBuContactList: PlantBuContacts[] = useMemo(() => {
    if (!plantBuContacts) {
      return [];
    }
    return plantBuContacts;
  }, [plantBuContacts]);
  const businessUnitsList: BusinessUnit[] = useMemo(() => {
    if (!businessUnits) {
      return [];
    }
    return businessUnits;
  }, [businessUnits]);

  const extraContent = (
    <div>
      {t('policy_p3')}
      <ul>
        <li>{t('bullet_1')}</li>
        <li> {t('bullet_2')}</li>
        <li> {t('bullet_3')}</li>
      </ul>
      <p style={{ fontWeight: 600 }}> {t('policy_enforcement')}</p>
      <p style={{ marginTop: -10 }}>{t('poliy_p4')}</p>
      <p style={{ fontWeight: 600 }}>{t('policy_reporting')}</p>
      <p style={{ marginTop: -10 }}>
        {t('policy_security')}
        <a style={{ color: '#0A70FF' }}>omniblu-cybersecurity@jbtc.com.</a>
      </p>
      {t('policy_p5')}
      <LinkText
        onClick={() => {
          setReadMore(!readMore);
        }}
      >
        {t('show_less')}
      </LinkText>
    </div>
  );
  return (
    <>
      {businessUnitsLoading || plantBuContactsLoading ? (
        <Loader />
      ) : (
        <Root>
          <Box>
            <HelpEmailCardContainer>
              <Card heading={t('help_email')} borderColor={theme.colors.mediumGrey1}>
                <Heading>{t('omniblu_policy')}</Heading>
                <SubHeading>
                  {t('policy_p1')}
                  <br></br>
                  {t('policy_p2')}
                  {!readMore && (
                    <LinkText
                      onClick={() => {
                        setReadMore(true);
                      }}
                    >
                      {t('read_more')}
                    </LinkText>
                  )}
                  {readMore && <>{extraContent}</>}
                </SubHeading>
                <Heading>{t('omniblu_contact_us')}</Heading>
                <SubHeadingText>{t('policy_p6')}</SubHeadingText>
                <HelpEmailForm businessUnits={businessUnitsList}></HelpEmailForm>
              </Card>
            </HelpEmailCardContainer>
            {/* Contact Card */}
            <Mainwrpcontainer>
              <ContactCardContainer $length={plantBuContactList.length}>
                {plantBuContactList?.map((plantBusinessUnit: PlantBuContacts) => {
                  return (
                    <ContactCard
                      key={plantBusinessUnit.plantName}
                      heading={`${plantBusinessUnit.buName} - ${plantBusinessUnit.plantName}`}
                    >
                      {plantBusinessUnit.contactDetails?.map((contactGroup: ContactGroup) => {
                        return (
                          <ContactSection key={contactGroup.name}>
                            {contactGroup.name && (
                              <ContactInfo heading1={contactGroup.name} value=""></ContactInfo>
                            )}
                            {contactGroup.contactItems?.map((contactItem: ContactItem) => {
                              return (
                                contactItem.contactType && (
                                  <ContactInfo
                                    heading={contactItem.contactType}
                                    value={contactItem.value}
                                  ></ContactInfo>
                                )
                              );
                            })}
                          </ContactSection>
                        );
                      })}
                    </ContactCard>
                  );
                })}
              </ContactCardContainer>
              <Line />
              <Headingfaq>FAQ</Headingfaq>
              <Box>
                <FaqNew items={FAQItems} />
                <ButtonWrapperContainer>
                  <Button
                    onClick={() => {
                      alert('asdjagshdg');
                    }}
                    variant="emergency"
                    className="emergancy-btn"
                  >
                    <img src={emergencyIcon} />
                    {t('submit')}
                  </Button>
                </ButtonWrapperContainer>
              </Box>
            </Mainwrpcontainer>
          </Box>
        </Root>
      )}
    </>
  );
};

export default HelpPage;
