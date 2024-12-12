import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Typography } from 'components';

interface Props {
  id: string;
  label: string;
  color: string;
  onChange?: (id: string, value: boolean) => void;
  onClick?: () => void;
  active?: boolean;
}

const Container = styled.label<{ clickable: boolean; active: boolean }>`
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  ${({ clickable }) => clickable && 'cursor: pointer'};
  display: flex;
  align-items: center;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
`;

const CheckBox = styled.span<{ color: string }>`
  display: inline-block;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  background-color: ${({ color }) => color};
  font-size: 0.75rem;
  line-height: 1.25rem;
  text-align: center;
  margin-right: 0.5rem;
`;

/**
 * This renders as a checkboox when onChange is provided.
 * Otherwise, just acts as a simple label.
 */
const GraphLegend = ({ id, label, color, active, onChange, onClick }: Props): JSX.Element => (
  <Container clickable={!!onChange || !!onClick} active={!!active} onClick={onClick}>
    {onChange && (
      <input
        type="checkbox"
        checked={active}
        onChange={(evt) => {
          onChange && onChange(id, evt.target.checked);
        }}
      ></input>
    )}
    <CheckBox color={color}>
      {active && onChange && <FontAwesomeIcon icon={faCheck} color="white" />}
    </CheckBox>
    <Typography mb={0} as="span" size="0.75rem">
      {label}
    </Typography>
  </Container>
);

export default GraphLegend;
