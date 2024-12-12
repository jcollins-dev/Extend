import styled from 'styled-components';

const BaseCell = styled.th`
  color: ${(props) => props.theme.colors.table.primary};
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  text-align: left;
`;

export const StyledHeaderCell = styled(BaseCell)``;

export const StyledCell = styled(BaseCell)`
  background-color: transparent;
  font-size: ${(props) => props.theme.typography.components.tableHeader.size};
  font-weight: ${(props) => props.theme.typography.components.tableRowLight.weight};
  line-height: ${(props) => props.theme.typography.components.tableRowLight.lineHeight};
`;

export const StyledIconCell = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const StyledIconCellText = styled.span``;
