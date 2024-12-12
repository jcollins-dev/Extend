import {
  Asset,
  BaseType,
  Bubble,
  Id,
  Machine,
  MachineBusinessUnit,
  Resource,
  WithId,
  WithQuantity
} from 'types';

export interface PartsByIdsArgs extends BaseType {
  uuids?: string[];
  subParts?: boolean;
  flagAssemblies?: boolean;
  includeResources?: boolean;
  onlyImages?: boolean;
  machineId?: string;
  sku?: string;
  businessUnitId?: string;
}

export interface PartTransformResponse {
  price: string;
  stock: string;
  leadTime: string;
}
export interface GetProductsArgs extends BaseType {
  productIds?: string[];
  includeAssets?: boolean;
  machineUuid?: string;
  priceUnit?: string;
  productTagIds?: string[];
}

export interface ProductByIdWithMachineArgs extends BaseType {
  id?: string;
  machineUuid?: string;
  priceUnit?: string;
}

export interface GetProductTagsArgs extends BaseType {
  machineId: string;
}

export interface PartsByMachineIdArgs extends BaseType, WithId {
  page?: number;
  itemsPerPage?: number;
  searchQuery?: string;
  startNodeSku?: string;
}

export enum StockError {
  MISSING = 'missing',
  UNREASONABLE = 'unreasonable',
  NONE = 'none'
}

export enum LeadTimeError {
  MISSING = 'missing',
  UNREASONABLE = 'unreasonable',
  NONE = 'none'
}

export enum PriceError {
  MISSING = 'missing',
  UNREASONABLE = 'unreasonable',
  NONE = 'none'
}

export interface PurchasableDetails extends BaseType {
  sku: string;
  description: string;
  manualDescription?: string;
  multilingualDesc?: { [key: string]: string };
  alternateSku?: string;
  businessUnit?: MachineBusinessUnit;
  leadTime: number; // number could be hours, seconds, whatever makes sense
  price?: number;
  priceUnit?: string; // eg USD
  custPrice?: number;
  stock: number;
  assets?: Resource[] | Asset[];
  stockError?: StockError;
  priceError?: PriceError;
  leadTimeError?: LeadTimeError;
  siteRef?: string; // inventory location
  isObsolete?: boolean;
  compatibility?: Machine[];
  isPurchasable?: boolean;
  alternateProduct?: Product;
  overview?: string; // This is for PDP, but not sure we ever will get this data
  sfProductId?: string;
  stockCode?: string;
}

export interface Product extends WithId, PurchasableDetails {}

export interface PurchasableItem extends PurchasableDetails {
  productId?: string;
}

export interface Part extends BaseType, WithId, PurchasableItem {
  categories?: string[];
  parts?: Part[];
  customerPartId?: string;
  isAssembly?: boolean;
  machineId?: string;
}
export interface PartFilterRequest {
  option: string;
  offset: number;
  limit?: number;
  machineId?: string;
}
export interface SavedPart extends Part {
  id: string;
  sku: string;
  description: string;
  price?: number;
  quantity?: number;
  leadTime: number;
  priceUnit?: string;
  isPurchaseable?: boolean;
}

export type SavedProductInput = {
  productId: string;
  quantity: number;
  userId?: string;
  priceUnit?: string;
};

export interface PartDataWithKey extends Part, Product {
  key: string;
}

export interface AlternateRow extends PartDataWithKey {
  rowType: 'alternate';
}

export type TableRow = AlternateRow | PartDataWithKey;

export interface OrderDetails extends WithQuantity {
  firstName: string;
  lastName: string;
  billingAddress: string;
  shippingAddress: string;
  creator: string;
  approver: string;
}

export type OrderBillee = {
  firstName: string;
  lastName: string;
};

export type OrderAddress = {
  streetAddress: string;
  suiteNumber?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export interface ItemOrder extends WithId, WithQuantity {
  machineId?: string;
  machineDescription?: string;
  currency?: string;
  urgent?: boolean;
}

export interface BillTo extends OrderBillee, OrderAddress {}

export interface OrderInput extends BaseType {
  billTo: BillTo;
  shipTo: OrderAddress;
  creator: string;
  approver: string;
  orders: ItemOrder[];
  unpurchasableItems?: ItemOrder[];
  customerPoNumber?: string;
  sfCartId?: string;
  sfAccountId?: string;
  allowPartialShipments?: boolean;
}

export interface OrderInputWithSFFlag extends OrderInput {
  sfEnabled?: boolean;
  lang?: string;
  region?: string;
}

export interface OrderResponse extends BaseType, WithId {
  url: string;
  sfPoId: string;
}

export interface ConfirmOrderInput extends BaseType, WithId {
  email: string;
  status: boolean;
  sfPoId?: string;
}

export interface ConfirmOrderInputWithSFFlag extends ConfirmOrderInput {
  sfEnabled?: boolean;
}

export interface ProductTag extends BaseType, WithId {
  tagName: string;
  createdDate: Date;
}
export interface ModifiedPart extends BaseType {
  [key: string]: string;
}

export interface DiagramBubbleAction {
  (
    marker: Bubble,
    event: React.MouseEvent,
    bubbleBaseRef: React.MutableRefObject<null>,
    part?: Part,
    diagram?: Resource,
    bubbledEditId?: Id
  ): void;
}

export interface DiagramAction {
  (event: React.MouseEvent, width?: number, height?: number, diagram?: Resource): void;
}
