import React, { ChangeEventHandler, ReactElement } from 'react';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import breakpoint from 'constants/breakpoints';
// Types
import { InputVariant } from 'types';

interface SearchVariant extends InputVariant {
  value?: string;
  borderRadius?: string;
}

interface SearchInputProps extends SearchVariant {
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  borderRadius?: string;
  headerSearch?: boolean;
  searchColor?: string;
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const SearchIcon = styled.div<InputVariant>`
  position: absolute;
  height: 100%;
  top: 0;
  left: 0.5625rem;
  display: flex;
  align-items: center;

  pointer-events: none;

  font-size: 1rem;
  color: ${(props) =>
    props.variant && props.variant === 'disabled'
      ? props.theme.colors.disabled.light.fill
      : props.theme.colors.icons.default.fill};
`;

const StyledInput = styled.input<SearchVariant>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.6875rem 0.6875rem 0.6875rem 2rem;
  box-sizing: border-box;
  border: ${(props) => props.theme.colors.borders.border02.border};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '1.5rem')};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
  letter-spacing: 0;
  cursor: ${(props) => (props.variant && props.variant === 'disabled' ? 'not-allowed' : 'auto')};

  font-size: ${(props) => props.theme.typography.components.input.size};
  font-weight: ${(props) => props.theme.typography.components.input.weight};
  line-height: ${(props) => props.theme.typography.components.input.lineHeight};
  color: ${(props) =>
    props.variant && props.variant === 'disabled'
      ? props.theme.colors.disabled.light.fill
      : props.value
      ? props.theme.colors.field.search.filled
      : props.theme.colors.field.search.enabled || '#4F545A'};
  background-color: ${(props) =>
    props.variant
      ? props.variant === 'disabled'
        ? props.theme.colors.field.disabled.fill
        : props.variant === 'white'
        ? props.theme.colors.field.white.fill
        : props.theme.colors.field.grey.fill || 'rgb(244, 247, 249)'
      : 'transparent'};
  text-overflow: ellipsis;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 0.125rem #1c65c8;
  }
  @media ${breakpoint.device.xs} {
    background: none;
    width: 22%;
    border: none;
   }
  @media ${breakpoint.device.sm} {
   background: none;
   width: 20%;
   border: none;
  }
  @media ${breakpoint.device.md} {
    background: #fff;
    width: 100%;
   }

}
`;
const HeaderStyledInput = styled.input<SearchVariant>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.6875rem 0.6875rem 0.6875rem 2rem;
  box-sizing: border-box;
  border: ${(props) => props.theme.colors.borders.border02.border};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '1.5rem')};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
  letter-spacing: 0;
  cursor: ${(props) => (props.variant && props.variant === 'disabled' ? 'not-allowed' : 'auto')};

  font-size: ${(props) => props.theme.typography.components.input.size};
  font-weight: ${(props) => props.theme.typography.components.input.weight};
  line-height: ${(props) => props.theme.typography.components.input.lineHeight};
  color: white;
  background-color: ${(props) =>
    props.variant
      ? props.variant === 'disabled'
        ? props.theme.colors.field.disabled.fill
        : props.variant === 'white'
        ? props.theme.colors.field.white.fill
        : props.theme.colors.field.grey.fill || 'rgb(244, 247, 249)'
      : 'transparent'};
  text-overflow: ellipsis;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 0.125rem #1c65c8;
  }
  @media ${breakpoint.device.xs} {
    background: none;
    width: 22%;
    border: none;
   }
  @media ${breakpoint.device.sm} {
   background: none;
   width: 20%;
   border: none;
  }
  @media ${breakpoint.device.md} {
    background: #fff;
    width: 100%;
   }

}
`;

const SearchInput = ({
  value,
  onChange,
  placeholder,
  variant = 'gray',
  borderRadius = '1.5rem',
  headerSearch,
  searchColor
}: SearchInputProps): ReactElement => (
  <Root>
    {headerSearch === true ? (
      <HeaderStyledInput
        value={value}
        type="search"
        placeholder={placeholder}
        onChange={onChange}
        disabled={variant === 'disabled'}
        borderRadius={borderRadius}
        style={{ backgroundColor: searchColor }}
      ></HeaderStyledInput>
    ) : (
      <StyledInput
        value={value}
        type="search"
        placeholder={placeholder}
        onChange={onChange}
        variant={variant}
        disabled={variant === 'disabled'}
        borderRadius={borderRadius}
      />
    )}
    <SearchIcon variant={variant}>
      <FontAwesomeIcon icon={faSearch} />
    </SearchIcon>
  </Root>
);

export default SearchInput;
