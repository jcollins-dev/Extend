import React, { ReactElement } from 'react';
import { FAQCategories } from 'types';
import styled from 'styled-components';

import FAQItem from '../../components/FAQComponent/FAQItem';

//Components
import { Card } from 'components';

interface FAQProps {
  items: FAQCategories[];
}
const FaqContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 25px;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(50% - 12px);
  margin-bottom: 24px;
  box-shadow: 0 6px 12px 6px #10182812;
  border-radius: 5px;
  @media (max-width: 1200px) {
    width: 100%;
  }
`;
const OuterCardContainer = styled.div`
  width: 100%;
  // box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
`;
const InnerCardContainer = styled.div`
  height: 500px;
  padding: 15px;
  overflow-y: scroll;
  @media (max-width: 767px) {
    height: unset;
  }
`;

const CategoryTitle = styled.div`
  font-weight: 700;
  font-size: 21px;
  font-family: Roboto;
  color: #000000;
`;

const FaqNew = ({ items }: FAQProps): ReactElement => {
  return (
    <>
      <FaqContainer>
        {items.map((d, i) => (
          <InnerContainer key={i}>
            <OuterCardContainer>
              <Card>
                <InnerCardContainer>
                  <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <img src={d.icon} alt="Icon" />
                    <CategoryTitle>{d.category}</CategoryTitle>
                  </div>

                  {d.faqs.map((faq, j) => (
                    <FAQItem
                      key={j}
                      question={faq.question}
                      answers={faq.answers}
                      subanswers={faq.subanswers}
                    />
                  ))}
                </InnerCardContainer>
              </Card>
            </OuterCardContainer>
          </InnerContainer>
        ))}
      </FaqContainer>
    </>
  );
};

export default FaqNew;
