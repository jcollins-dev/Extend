// 3rd part libs
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import FocusTrap from 'focus-trap-react';

// Custom hooks
import { useKeypress } from 'hooks';

interface FlyoutProps {
  noFocusTrap?: boolean;
  overflow?: string;
  visible: boolean;
  width: string | number;
  children: React.ReactNode;
  onClose: () => void;
}

interface ContentProps {
  overflow?: string;
  visible: boolean;
  width: string | number;
}

interface BackdropProps {
  visible: boolean;
}

const fadeInAnim = keyframes`
 0% { opacity: 0 }
 100% { opacity: 1 }
`;

const fadeOutAnim = keyframes`
 0% { opacity: 1 }
 100% { opacity: 0 }
`;

const slideInAnim = keyframes`
 0% { transform: translateX(100%) }
 100% { transform: translateX(0%) }
`;

const slideOutAnim = keyframes`
 0% { transform: translateX(0%) }
 100% { transform: translateX(100%) }
`;

const Backdrop = styled.div<BackdropProps>`
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 11;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: ${({ visible }) => (visible ? fadeInAnim : fadeOutAnim)} 0.2s forwards ease-out;
`;

const Content = styled.div<ContentProps>`
  z-index: 999;
  position: fixed;
  overflow: ${({ overflow }) => overflow || 'auto'};
  top: 0;
  right: 0;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.background1};
  width: ${({ width }) => width};
  animation: ${({ visible }) => (visible ? slideInAnim : slideOutAnim)} 0.2s forwards ease-out;
  transition: width 0.5s;
  > div {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .ui-scroll-x {
    overflow-x: auto;
  }
`;

const Flyout = ({
  noFocusTrap,
  overflow,
  visible,
  width,
  children,
  onClose
}: FlyoutProps): JSX.Element | null => {
  const [mounted, setMounted] = useState(false);

  useKeypress('Escape', onClose);

  useEffect(() => {
    visible && setMounted(true);
  }, [visible]);

  const onAnimationEnd = () => {
    if (!visible) {
      setMounted(false);
    }
  };

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <>
      <Backdrop visible={visible} onClick={onClose} />
      <Content overflow={overflow} visible={visible} onAnimationEnd={onAnimationEnd} width={width}>
        {noFocusTrap ? (
          <div>{children}</div>
        ) : (
          <FocusTrap
            focusTrapOptions={{
              allowOutsideClick: true,
              tabbableOptions: {
                // Required for testing: https://github.com/focus-trap/focus-trap#testing-in-jsdom
                displayCheck: 'none'
              }
            }}
          >
            <div>{children}</div>
          </FocusTrap>
        )}
      </Content>
    </>,
    document.body
  );
};

export default Flyout;
