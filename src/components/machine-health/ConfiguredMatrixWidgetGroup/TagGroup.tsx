// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Components
import { Card, Typography } from 'components';

// Types
import { ConfiguredWidget } from 'types/protein';

// Utils
import { parseTagValue } from './utils';

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.mediumGrey1};
`;

const CardHeader = styled.div`
  width: 100%;
  padding: 1rem 0.5rem 1rem 1rem;
  display: flex;
  justify-content: space-between;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  td:last-child {
    text-align: right;
  }

  td {
    padding: 0.5rem 1rem;
  }

  tr:not(:last-child) td {
    border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.mediumGrey1};
  }
`;

const ChartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

interface Props {
  data: ConfiguredWidget;
  onToggleChart: () => void;
  isChartVisible: boolean;
}

const TagGroup = ({ data, onToggleChart, isChartVisible }: Props): JSX.Element => {
  return (
    <StyledCard>
      <CardHeader>
        <Typography size="1rem" weight="bold" as="h3" mb={0}>
          {data.name}
        </Typography>
        <ChartButton onClick={onToggleChart}>
          <Typography size="0.875rem" weight="bold" as="span" mb={0}>
            {isChartVisible ? (
              <>Close</>
            ) : (
              <>
                Open chart <FontAwesomeIcon icon={faChevronRight} />
              </>
            )}
          </Typography>
        </ChartButton>
      </CardHeader>

      <Table>
        <tbody>
          {data.tags?.map((tag) => (
            <tr key={tag.id}>
              <td>
                <Typography size="0.8125rem" as="span" mb={0}>
                  {tag.name || tag.id}:
                </Typography>
              </td>
              <td>
                <Typography weight="bold" size="0.8125rem" as="span" mb={0}>
                  {parseTagValue(tag)}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </StyledCard>
  );
};
export default TagGroup;
