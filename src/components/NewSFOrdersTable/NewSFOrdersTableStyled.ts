import styled from 'styled-components';
import theme from 'themes';
interface OrderImageProps {
  isClickable?: boolean;
  customWidth?: string;
  customHeight?: string;
  marginLeft?: string;
}
export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const OrderTableWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  margin-right: 1.5rem;
`;
export const OrderMapWrapper = styled.div`
  width: 25%;
  height: 36.875rem;
`;
export const OrderModalFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-top: 0.063rem solid ${theme.colors.lightGrey7};
`;
export const DetailTextLink = styled.a`
  text-decoration: none;
  color: ${theme.colors.primaryBlue5};
`;
export const OrderFooterTextWrapper = styled.div`
  padding-top: 1rem;
  margin-right: 2rem;
`;
export const ModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 1rem;
  button {
    margin-right: 1rem;
    width: auto;
  }
`;
export const SelectionHeader = styled.div`
  padding-left: 1rem;
  border-bottom: 0.063rem solid ${theme.colors.darkBlue};
  font-weight: bold;
  font-size: 0.75rem;
  color: ${theme.colors.darkBlue};
  padding-bottom: 1rem;
`;
export const DetailTitleContainer = styled.div`
  padding-top: 1rem;
  margin-left: 1rem;
`;
export const PurchaseOrder = styled.div`
  color: ${theme.colors.primaryBlue5};
  cursor: pointer;
  display: flex;
`;
export const OrderIconWrapper = styled.div<OrderImageProps>`
  width: ${(props) => (props.customWidth ? props.customWidth : '1rem')};
  height: ${(props) => (props.customHeight ? props.customHeight : '1rem')};
  float: left;
  margin-right: 0.5rem;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '1.2rem')};
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
`;
export const OrderHeaderIconWrapper = styled.div<OrderImageProps>`
  width: ${(props) => (props.customWidth ? props.customWidth : '1rem')};
  height: ${(props) => (props.customHeight ? props.customHeight : '1rem')};
  float: left;
  margin-right: 0.5rem;
`;
export const DetailsTableHeader = styled.div`
  margin-left: 1.2rem;
  margin-top: 0.8rem;
`;
export const POPrice = styled.div`
  width: 8rem;
  margin-right: 0.5rem;
  text-align: left;
  text-wrap: wrap;
  word-wrap: break-word;
`;
export const POPriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
export const OrderIcon = styled.img`
  width: 100%;
`;
export const OrderModalBody = styled.div`
  height: 75%;
  display: flex;
  flex-direction: row;
`;
export const OrderSupportColumn = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-wrap: wrap;
  padding: 1.5rem;
`;
export const OrderItemsContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
  margin-top: 1.2rem;
  border-top: 1px solid ${theme.colors.lightGrey7};
`;
export const AddressCardsContainer = styled.div`
  height: 30%;
  display: flex;
  flex-direction: row;
  border-right: 1px solid ${theme.colors.lightGrey7};
`;
export const POHeaderContainer = styled.div`
  height: 15%;
  display: flex;
  flex-direction: row;
  background-color: ${theme.colors.lightGrey2};
  border: 1px solid ${theme.colors.lightGrey7};
`;
export const POItemsTableContainer = styled.div`
  height: 40%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.lightGrey7};
`;
export const POAddressCard = styled.div`
  width: 33.3%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${theme.colors.lightGrey7};
  border-left: 1px solid ${theme.colors.lightGrey7};
`;

export const POAddressText = styled.div`
  text-wrap: wrap;
  margin-left: 2.8rem;
  margin-top: -1rem;
  padding-right: 1rem;
  font-weight: 400;
  font-size: 0.726rem;
`;
export const POHeaderText = styled.div`
  text-wrap: wrap;
  margin-left: 2.8rem;
  margin-top: -1.2rem;
`;
export const POHeaderTextContainer = styled.div`
  margin-right: 2rem;
  margin-top: 0.7rem;
`;
export const POItemsTableWrapper = styled.div`
  overflow-y: auto;
`;
export const Totalbox = styled.div`
  margin-top: 0.525rem;
`;
export const TotalText = styled.div`
  float: right;
  font-weight: bold;
`;
export const POTableHeader = styled.div`
  height: 9.5rem;
  background-color: ${theme.colors.mediumBlue4};
  margin-left: -3.2rem;
  margin-right: -3rem;
  margin-top: -1.5rem;
  margin-bottom: 3rem;
`;
export const HeaderTextWrapper = styled.div`
  display: flex;
  font-family: Roboto;
  font-size: 4rem;
  color: ${theme.colors.lightGrey8};
  width: 50rem;
  padding-left: 2rem;
  padding-top: 2rem;
`;
export const HeaderText = styled.div`
  font-size: 4rem;
`;
export const HeaderIconContainer = styled.div`
  margin-top: -7.5rem;
  float: right;
  padding-left: 2rem;
  padding-top: 2rem;
`;
