import React from 'react';
import styled from 'styled-components';
import { themeColors } from 'themes';

export const Container = styled.div`
  .dot-pulse {
    position: relative;
    left: -9999px;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background-color: ${themeColors.mediumGrey3};
    color: ${themeColors.mediumGrey3};
    box-shadow: 9999px 0 0 -5px;
    animation: dot-pulse 1.5s infinite linear;
    animation-delay: 0.25s;
  }
  .dot-pulse::before,
  .dot-pulse::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background-color: ${themeColors.mediumGrey3};
    color: ${themeColors.mediumGrey3};
  }
  .dot-pulse::before {
    box-shadow: 9984px 0 0 -5px;
    animation: dot-pulse-before 1.5s infinite linear;
    animation-delay: 0s;
  }
  .dot-pulse::after {
    box-shadow: 10014px 0 0 -5px;
    animation: dot-pulse-after 1.5s infinite linear;
    animation-delay: 0.5s;
  }

  @keyframes dot-pulse-before {
    0% {
      box-shadow: 9984px 0 0 -5px;
    }
    30% {
      box-shadow: 9984px 0 0 2px;
    }
    60%,
    100% {
      box-shadow: 9984px 0 0 -5px;
    }
  }
  @keyframes dot-pulse {
    0% {
      box-shadow: 9999px 0 0 -5px;
    }
    30% {
      box-shadow: 9999px 0 0 2px;
    }
    60%,
    100% {
      box-shadow: 9999px 0 0 -5px;
    }
  }
  @keyframes dot-pulse-after {
    0% {
      box-shadow: 10014px 0 0 -5px;
    }
    30% {
      box-shadow: 10014px 0 0 2px;
    }
    60%,
    100% {
      box-shadow: 10014px 0 0 -5px;
    }
  }
`;

export const DotsLoadingIcon = (): JSX.Element => {
  return (
    <Container>
      <div className="stage">
        <div className="dot-pulse"></div>
      </div>
    </Container>
  );
};
