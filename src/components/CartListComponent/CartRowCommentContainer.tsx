// 3rd party libraries
import React, { ReactElement, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { Typography } from 'components';
import { LeadTimeError, PriceError, Product, StockError } from 'types/parts';
import { CartListType, CartListViewType, CartVerificationComment } from 'types/parts/cart';
import { default as theme } from 'themes';
import PopUpCard from 'components/PopUpCard';

type CartRowCommentArguments = {
  viewType: CartListViewType;
  purchasable: Product;
  verificationComments: CartVerificationComment[];
};

const POP_UP_WIDTH_REM = 18;

const CartCommentsMap = {
  [CartVerificationComment.PRICE_CHANGE]: 'comments_price_change',
  [CartVerificationComment.STOCK_CHANGE]: 'comments_stock_change',
  [CartVerificationComment.LEAD_TIME_CHANGE]: 'comments_lead_time_change',
  [CartVerificationComment.LOW_STOCK]: 'comments_low_stock',
  price: {
    [PriceError.MISSING]: 'comments_price_missing',
    [PriceError.UNREASONABLE]: 'comments_price_inaccurate'
  },
  stock: {
    [StockError.MISSING]: 'comments_stock_missing',
    [StockError.UNREASONABLE]: 'comments_stock_inaccurate'
  },
  leadTime: {
    [LeadTimeError.MISSING]: 'Lead time is unavailable for this item',
    [LeadTimeError.UNREASONABLE]: 'Lead time potentially inaccurate'
  }
};

const CommentsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  max-width: 30%;
  height: 4.725rem;
  background-color: ${theme.colors.negativeRed4};
  border-bottom-left-radius: 0rem;
  border-bottom-right-radius: 0rem;
  padding-left: 0.5rem;
  overflow: auto;
  position: absolute;
  right: 0;
  p {
    margin-bottom: 0;
  }
  ul {
    list-style: none;
    li {
      margin-top: 0.188rem;
    }
  }
  ${({ defaultValue }) =>
    defaultValue === CartListType.VIEW_TYPE_LESS &&
    `
    min-width: 20%;
    max-width: 20%;
  `}
  svg {
    margin: 0;
  }
`;

const CommentsClickableSpace = styled.div`
  width: 100%;
  height: 100%;
  padding: 5%;
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
`;

const CommentsIcon = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
  display: block;
  margin: auto;
  margin-right: 0.825rem;
`;

const CommentListItem = styled.li`
  margin-bottom: 0.5rem;
`;
const CommentList = styled.ul`
  margin: 0;
  padding: 0;
`;
const CommentsAboutThisItemText = styled.div`
  margin-left: 1rem;
`;

const PopUpCardRule = styled.hr`
  width: 100%;
`;

const PopUpCardInterior = styled.div`
  padding: 0.5rem 1rem 0rem 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

function buildComments(
  purchasable: Product,
  verificationComments: CartVerificationComment[],
  t: TFunction<'fpns'[], undefined>
): string[] {
  const comments = [];

  for (const verificationComment of verificationComments) {
    comments.push(t(CartCommentsMap[verificationComment]));
  }
  if (purchasable.priceError && purchasable.priceError != PriceError.NONE) {
    comments.push(t(CartCommentsMap['price'][purchasable.priceError]));
  }

  if (purchasable.stockError && purchasable.stockError != StockError.NONE) {
    comments.push(t(CartCommentsMap['stock'][purchasable.stockError]));
  }

  if (purchasable.leadTimeError && purchasable.leadTimeError != LeadTimeError.NONE) {
    comments.push(t(CartCommentsMap['leadTime'][purchasable.leadTimeError]));
  }

  return comments;
}

const CartRowCommentComponent = ({
  viewType,
  purchasable,
  verificationComments
}: CartRowCommentArguments): ReactElement => {
  const { t } = useTranslation(['fpns']);
  const comments = useMemo<string[]>(
    () => buildComments(purchasable, verificationComments, t),
    [purchasable, verificationComments]
  );
  const [showComment, setShowComment] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const commentsFor = t('comments_for');
  if (comments.length === 0) return <></>;

  return (
    <CommentsContainer ref={commentRef} defaultValue={viewType}>
      <CommentsClickableSpace onClick={() => setShowComment(!showComment)}>
        <CommentsIcon icon={faExclamationTriangle} color={theme.colors.negativeRed} />
        <CommentsAboutThisItemText>
          <Typography variant="body1" color={theme.colors.negativeRed}>
            <i>{showComment ? t('close_comments') : t('item_comments')}</i>
          </Typography>
        </CommentsAboutThisItemText>
      </CommentsClickableSpace>
      {(viewType === CartListType.VIEW_TYPE_DEFAULT ||
        viewType === CartListType.VIEW_TYPE_MORE) && (
        <PopUpCard
          show={showComment}
          setShowFunction={setShowComment}
          widthRem={POP_UP_WIDTH_REM}
          baseRef={commentRef}
          location={'left'}
          headerText={`${commentsFor} ${purchasable.description}`}
          headerTextJustification={'left'}
        >
          <PopUpCardRule />
          <PopUpCardInterior>
            <CommentList>
              {comments?.map((comment, index) => {
                return (
                  <CommentListItem key={index}>
                    <Typography variant="body1" color={theme.colors.negativeRed}>
                      <i>{comment}</i>
                    </Typography>
                  </CommentListItem>
                );
              })}
            </CommentList>
          </PopUpCardInterior>
        </PopUpCard>
      )}
    </CommentsContainer>
  );
};

export default CartRowCommentComponent;
