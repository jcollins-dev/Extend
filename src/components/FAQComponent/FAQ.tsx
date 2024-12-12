// 3rd Party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Typography } from 'components';

import { FAQCategories } from 'types';
import FAQItem from './FAQItem';

interface FAQProps {
  items: FAQCategories[];
}
const FaqWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
`;
const FaqPod = styled.div`
  display: flex;
  border: thin solid #ccc;
  border-radius: 5px;
  flex-direction: column;
  width: 60%;
`;
const FaqCategoryTitle = styled.div`
  display: flex;
  background: #f1f2f3;
  padding-left: 15px;
  h5 {
    margin: 10px 0px;
  }
`;

const FAQ = ({ items }: FAQProps): ReactElement => {
  return (
    <FaqWrapper>
      {items.map((item, i) => (
        <FaqPod key={i}>
          <FaqCategoryTitle>
            <Typography variant="h5">{item.category}</Typography>
          </FaqCategoryTitle>
          {item.faqs.map((faq, j) => (
            <FAQItem
              key={j}
              question={faq.question}
              answers={faq.answers}
              subanswers={faq.subanswers}
            />
          ))}
        </FaqPod>
      ))}
    </FaqWrapper>
  );
};

export default FAQ;
