// 3rd party libs
import React, { useRef } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// Custom css
import './Clipboard.css';

// Components
import { Typography } from 'components';

type Props = {
  children?: React.ReactNode;
  data: string;
};

// Styling
const Icon = styled.div(({ theme }) => ({
  cursor: 'pointer',
  color: theme.colors.darkGrey,
  ':hover': {
    color: theme.colors.mediumBlue
  }
}));

const Content = styled.div(({ theme }) => ({
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  color: theme.colors.darkGrey
}));

const overlay = (data: string) => {
  return (
    <Content>
      <Typography mb={0}>{data}</Typography>
      <Icon>
        <FontAwesomeIcon
          icon={faCopy}
          size="lg"
          onClick={async () => {
            navigator.clipboard.writeText(data);
          }}
        />
      </Icon>
    </Content>
  );
};

export const Clipboard = ({ children, data }: Props): JSX.Element => {
  const nodeRef = useRef(null);

  return (
    <Tooltip
      ref={nodeRef}
      overlayClassName="clipboard-overlay"
      overlay={overlay(data)}
      placement="top"
      trigger="click"
    >
      <div ref={nodeRef}>{children}</div>
    </Tooltip>
  );
};
