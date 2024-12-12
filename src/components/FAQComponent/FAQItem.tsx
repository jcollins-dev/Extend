import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { FAQItemProps } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const Box = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.938rem;
  align-items: center;
  padding: 0.75rem;
  padding-top: 0rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primaryBlue5};
`;

//Question Styles
const Question = styled.div`
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.168rem;
  font-family: Roboto;
`;

//Subanswer Styles
const Answer = styled.div`
  font-weight: 400;
  font-size: 1.125rem;
  font-family: Roboto;
  padding-left: 2.688rem;
  margin-bottom: 1.25rem;
  line-height: 1.5rem;
`;

//Subanswer Styles
const SubAnswerText = styled.div`
  font-weight: 400;
  font-size: 1.125rem;
  font-family: Roboto;
  padding-left: 2.688rem;
  margin-bottom: 1.25rem;
`;

const FAQItem = ({ question, answers, subanswers }: FAQItemProps): ReactElement => {
  const [iconToggle, setIconToggle] = useState(false);
  const handleClick = () => {
    setIconToggle(!iconToggle);
  };
  return (
    <>
      <Box onClick={handleClick}>
        <FontAwesomeIcon icon={!iconToggle ? faPlus : faMinus} style={{ fontSize: '1.25rem' }} />
        <Question>{question}</Question>
      </Box>
      {answers.map((answer) => (
        <>{iconToggle && <Answer>{answer}</Answer>}</>
      ))}
      {subanswers.map((subanswer, i) =>
        subanswer ? iconToggle && <SubAnswerText>{subanswer}</SubAnswerText> : <div key={i}></div>
      )}
    </>
  );
};

export default FAQItem;
