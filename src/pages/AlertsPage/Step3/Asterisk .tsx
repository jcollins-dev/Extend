import React from 'react';
import styled from 'styled-components';

const AsteriskWrapper = styled.sup`
  color: red;
  font-size: 100%;
`;
const Asterisk = (): JSX.Element => {
  return <AsteriskWrapper>*</AsteriskWrapper>;
};

export default Asterisk;
