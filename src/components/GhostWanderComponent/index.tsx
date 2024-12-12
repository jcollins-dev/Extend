import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

const AnimationContainer = styled.div`
  @keyframes ghost {
    0%,
    100% {
      left: 0;
      top: 0;
      color: rgb(30, 102, 198);
      transform: rotate(-5deg);
    }

    5%,
    15%,
    25%,
    35%,
    45%,
    55%,
    65%,
    75%,
    85%,
    95% {
      top: 5px;
    }

    0%,
    10%,
    20%,
    30%,
    40%,
    50%,
    60%,
    70%,
    80%,
    90%,
    100% {
      color: rgb(78, 143, 228);
      top: -5px;
    }

    3%,
    7%,
    11%,
    18%,
    36%,
    55%,
    71%,
    85%,
    89%,
    92% {
      transform: rotate(5deg);
    }

    9%,
    16%,
    32%,
    57%,
    67%,
    81%,
    87%,
    91%,
    95% {
      transform: rotate(-3deg);
    }

    15%,
    66% {
      color: white;
    }

    17%,
    44% {
      top: 10px;
      transform: rotate(9deg);
    }

    50% {
      left: 90%;
      color: rgb(30, 102, 198);
    }
  }
  font-size: 2rem;
  position: relative;
  animation-name: ghost;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`;

const GhostWanderComponent = (): ReactElement => {
  return (
    <AnimationContainer>
      <FontAwesomeIcon icon={faGhost} />
    </AnimationContainer>
  );
};

export default GhostWanderComponent;
