import React from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
interface Props {
  numItems?: number;
  itemsPerPage?: number;
  pageRangeDisplayed?: number;
  onPageChange: (page: number) => void;
  forcePage?: number;
  currentPage?: number;
}
interface LabelProps {
  pageCount?: number;
  currentPage: number;
}
const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPagination = styled(ReactPaginate)`
  color: ${({ theme }) => theme.colors.text.darkgray};
  display: flex;
  list-style: none;
  padding: 0;
  margin: 1rem 0;

  li {
    a {
      padding: 0.5rem;
      cursor: pointer;
    }

    &.selected {
      a {
        color: ${({ theme }) => theme.colors.text.active};
      }
    }
  }
`;

const PreviousLabel = ({ currentPage }: LabelProps): JSX.Element => {
  return currentPage === 0 ? (
    <FontAwesomeIcon
      icon={faCaretLeft}
      color={theme.colors.lightGrey3}
      style={{ cursor: 'not-allowed' }}
    />
  ) : (
    <FontAwesomeIcon icon={faCaretLeft} />
  );
};
const NextLabel = ({ currentPage, pageCount }: LabelProps) => {
  return currentPage + 1 === pageCount ? (
    <FontAwesomeIcon
      icon={faCaretRight}
      color={theme.colors.lightGrey3}
      style={{ cursor: 'not-allowed' }}
    />
  ) : (
    <FontAwesomeIcon icon={faCaretRight} />
  );
};

const Pagination = ({
  onPageChange,
  pageRangeDisplayed = 5,
  numItems,
  itemsPerPage,
  forcePage,
  currentPage
}: Props): JSX.Element | null => {
  const pageCount = numItems && itemsPerPage ? Math.ceil(numItems / itemsPerPage) : 0;
  if (!pageCount || pageCount === 1) {
    return null;
  }

  return (
    <Container>
      <StyledPagination
        marginPagesDisplayed={1}
        pageRangeDisplayed={pageRangeDisplayed}
        pageCount={pageCount}
        previousLabel={<PreviousLabel currentPage={currentPage as number} />}
        nextLabel={<NextLabel currentPage={currentPage as number} pageCount={pageCount} />}
        onPageChange={({ selected }: { selected: number }) => onPageChange(selected)}
        forcePage={forcePage}
      />
    </Container>
  );
};

export default Pagination;
