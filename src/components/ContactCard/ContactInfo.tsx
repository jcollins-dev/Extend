import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { themeColors } from 'themes';
import styled from 'styled-components';
import phoneIcon from '../../img/PhoneIcon.svg';
import emailIcon from '../../img/emailIcon.svg';
import Tooltip from 'rc-tooltip';

interface Props {
  heading?: string;
  value: string;
  isEmail?: boolean;
  heading1?: string;
}

interface ContainerProps {
  status?: string;
}

const Container = styled.div<ContainerProps>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Info = styled.div<ContainerProps>`
  width: 100%;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-left: 1.875rem;
  padding-top: 0.625rem;
  font-size: 0.813rem;
  font-weight: 400;
  font-family: Roboto;
  color: themeColors;
`;

const Icons = styled.div<ContainerProps>`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 88.75rem) {
    width: unset;
  }
  svg {
    font-size: 1.125rem;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 0.688rem rgba(33, 33, 33, 0.2);
  }
`;

const ContactInfoHeading = styled.div`
  font-size: 0.813rem;
  font-weight: 700;
  font-family: Roboto;
  color: #073f8d;
  padding-left: 1.875rem;
`;

const InnerIconHeading = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: center;
  padding-left: 1.875rem;
`;

const SubHeading = styled.div`
  font-size: 0.813rem;
  font-weight: 600;
  font-family: Roboto;
  color: #303e47;
`;

const ContactInfo = ({ heading, value, isEmail, heading1 }: Props): JSX.Element => {
  const [toolTipVisible, setTooltipVisible] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setTooltipVisible(false);
    }, 1500);
  }, [toolTipVisible]);

  return (
    <Container>
      {
        <>
          <ContactInfoHeading>{heading1}</ContactInfoHeading>
          <InnerIconHeading>
            {heading == 'phone' && (
              <>
                <img src={phoneIcon} alt="Icon" />
                <SubHeading>Phone</SubHeading>
              </>
            )}
            {heading == 'email' && (
              <>
                <img src={emailIcon} alt="Icon" />
                <SubHeading>Email</SubHeading>
              </>
            )}
          </InnerIconHeading>
          <Info>
            {value}
            <Icons>
              <Tooltip
                placement="bottom"
                trigger={['focus']}
                mouseLeaveDelay={0.5}
                visible={toolTipVisible}
                overlay={<span>Copied!</span>}
              >
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    setTooltipVisible(true);
                  }}
                  type="button"
                >
                  {value && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      title="Copy"
                      style={{ color: themeColors.primaryBlue5, fontSize: '1rem' }}
                    />
                  )}
                </Button>
              </Tooltip>
              {isEmail && (
                <Button
                  onClick={() => {
                    window.location.href = `mailto:${value}`;
                    setTooltipVisible(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              )}
            </Icons>
          </Info>
        </>
      }
    </Container>
  );
};

export default ContactInfo;
