// 3rd party
import React from 'react';
import styled from 'styled-components';
import { TFunction } from 'i18next';

import { Part } from 'types/parts';
import { Button, Input } from 'components';
import theme from 'themes';
import { User } from 'types';

const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonContainer = styled.div`
  margin-left: 0.75rem;
  flex-grow: 1;
`;

export function PreviewCardAddToCart(
  isPurchasable: string | boolean | undefined,
  quantity: number,
  setQuantity: React.Dispatch<React.SetStateAction<number>>,
  addToCart: (purchasable: Part) => void,
  finalPart: Part,
  user: User,
  t: TFunction<'fpns'[], undefined>
): JSX.Element {
  return (
    <AddToCartContainer>
      <Input
        type="number"
        id="qty"
        min={1}
        variant={isPurchasable ? 'white' : 'disabled'}
        value={quantity}
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setQuantity(parseInt(evt.target.value, 10));
          const rawQuantity = evt.target.value.length < 1 ? String(0) : evt.target.value;
          const newQuantity =
            Math.max(parseInt(rawQuantity), 0) == 0 ? quantity : Math.max(parseInt(rawQuantity), 0);
          setQuantity(newQuantity);
        }}
      />
      <ButtonContainer>
        <Button bgColor={theme.colors.primaryBlue4} onClick={() => addToCart(finalPart)}>
          {t('add_to_cart')}
        </Button>
      </ButtonContainer>
    </AddToCartContainer>
  );
}
