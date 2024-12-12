// 3rd part libs
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { default as theme } from 'themes';
// Custom hooks
import { useKeypress } from '../../hooks';
import { ModalSize, ModalSizeType } from 'types';

interface ModalProps {
  title?: string | JSX.Element;
  visible: boolean;
  children: React.ReactNode;
  overrideStyles?: boolean;
  size?: ModalSizeType;
  showCloseButton?: boolean;
  onClose: () => void;
  allowContentScroll?: boolean;
  hasDropdowns?: boolean;
  maxWidth?: string;
  contentBorderRadius?: string;
  showScrollBar?: boolean;
  widthOverride?: string;
}

interface ContentProps {
  allowContentScroll?: boolean;
  visible: boolean;
  size?: ModalSizeType;
  hasDropdowns?: boolean;
  maxWidth?: string;
  contentBorderRadius?: string;
  widthOverride?: string;
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
 0% { transform: translateY(100%) }
 100% { transform: translateY(0%) }
`;

const slideOutAnim = keyframes`
 0% { transform: translateY(0%) }
 100% { transform: translateY(100%) }
`;

const Backdrop = styled.div<BackdropProps>`
  z-index: 998;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: ${({ visible }) => (visible ? fadeInAnim : fadeOutAnim)} 0.2s forwards ease-out;
`;

const Content = styled.div<ContentProps>`
  overflow-y: ${({ hasDropdowns }) => (hasDropdowns ? 'visible' : 'auto')};
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 1.8125rem 2.1875rem 0.0625rem;
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  border-radius: 0.625rem;
  > div {
    border-radius: ${({ contentBorderRadius }) => contentBorderRadius};
    overflow: ${({ allowContentScroll }) => !allowContentScroll && 'visible'};
  }
  width: ${({ size, widthOverride }) =>
    widthOverride
      ? widthOverride
      : size === ModalSize.XXSMALL || size === ModalSize.XXSMALL_AUTO_HEIGHT
      ? '17.75rem'
      : size === ModalSize.XSMALL || size === ModalSize.XSMALL_AUTO_HEIGHT
      ? '23.4375rem'
      : size === ModalSize.SMALL || size === ModalSize.SMALL_AUTO_HEIGHT
      ? '60%'
      : size === ModalSize.MEDIUM
      ? '70%'
      : '90%'};
  height: ${({ size }) =>
    size === ModalSize.XXSMALL
      ? '10rem'
      : size === ModalSize.XSMALL
      ? '12rem'
      : size === ModalSize.SM
      ? '568px'
      : size === ModalSize.SMALL
      ? '70%'
      : size === ModalSize.MEDIUM
      ? '80%'
      : size === ModalSize.XSMALL_AUTO_HEIGHT ||
        size === ModalSize.SMALL_AUTO_HEIGHT ||
        size == ModalSize.XXSMALL_AUTO_HEIGHT
      ? 'fit-content'
      : '90%'};
  background: ${({ theme }) => theme.colors.background.background1};
  animation: ${({ visible }) => (visible ? slideInAnim : slideOutAnim)} 0.2s forwards ease-out;
`;

const CloseButton = styled.button`
  background: inherit;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  position: absolute;
  top: 1.25rem;
  right: 1.59375rem;
  z-index: 20;
`;

const ModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ModalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  color: ${(props) => props.theme.colors.darkGrey};
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3125rem;
  letter-spacing: 0rem;
  padding: 1.5rem 3rem 1.5rem;
  text-align: left;
  width: 100%;
`;

interface ModalBodyProps {
  allowContentScroll?: boolean;
  overrideStyles: boolean;
  showScrollBar?: boolean;
}

const ModalBodyContainer = styled.div<ModalBodyProps>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.overrideStyles ? '0 4.0625rem 1.5rem 3rem' : '0')};
  height: 100%;
  overflow: auto;
  overflow-y: ${({ allowContentScroll }) => allowContentScroll && 'scroll'};

  /* Hide scrollbar */
  scrollbar-width: ${({ showScrollBar }) => !showScrollBar && 'none'};
  &::-webkit-scrollbar {
    display: ${({ showScrollBar }) => !showScrollBar && 'none'};
  }
  -ms-overflow-style: none;
`;

const Modal = ({
  title,
  visible,
  children,
  onClose,
  overrideStyles = false,
  size = ModalSize.LARGE,
  showCloseButton = true,
  allowContentScroll = false,
  hasDropdowns,
  maxWidth,
  contentBorderRadius = '0.625rem',
  showScrollBar = false,
  widthOverride
}: ModalProps): JSX.Element | null => {
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
      <Content
        allowContentScroll={allowContentScroll}
        visible={visible}
        onAnimationEnd={onAnimationEnd}
        size={size}
        hasDropdowns={hasDropdowns}
        maxWidth={maxWidth}
        contentBorderRadius={contentBorderRadius}
        widthOverride={widthOverride}
      >
        <ModalHeaderContainer>
          {showCloseButton && (
            <CloseButton onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} color={theme.colors.darkGrey} />
            </CloseButton>
          )}
          {title && typeof title === 'object' && <>{title}</>}
          {title && typeof title === 'string' && <ModalTitleContainer>{title}</ModalTitleContainer>}
        </ModalHeaderContainer>
        <ModalBodyContainer
          allowContentScroll={allowContentScroll}
          overrideStyles={overrideStyles}
          showScrollBar={showScrollBar}
        >
          {children}
        </ModalBodyContainer>
      </Content>
    </>,
    document.body
  );
};

export default Modal;
