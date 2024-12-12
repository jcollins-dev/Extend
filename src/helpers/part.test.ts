import theme from 'themes';
import i18next from 'i18next';

import { LOW_STOCK_THRESHOLD } from 'constants/parts';
import { Product, Part } from 'types/parts';
import {
  determineBubbleColor,
  determinePartNameToShow,
  getProductDescription,
  getStockText,
  isPartAssembly,
  truncatePartName
} from './part';
import { LanguageCode } from 'constants/languageCode';

describe('Part helpers', () => {
  const baseTestPurchasable: Part = {
    id: '123-456-789-0',
    description: 'fake part',
    manualDescription: 'description from BOM',
    multilingualDesc: { en: 'description from ERP' },
    sku: '123456',
    isPurchasable: true,
    stock: 5,
    leadTime: 5
  };
  const baseTestProduct: Product = {
    id: '123-456-789-0',
    description: 'description from ERP',
    manualDescription: 'description from BOM',
    multilingualDesc: { de: 'Beschreibung aus ERP' },
    sku: '123456',
    isPurchasable: true,
    stock: 5,
    leadTime: 5
  };
  const baseTestAssembly: Part = {
    id: 'assembly-01',
    description: 'fake part',
    sku: '123456',
    stock: 5,
    leadTime: 5,
    priceUnit: 'USD',
    assets: [],
    parts: [
      {
        ...baseTestPurchasable,
        quantity: 2,
        parentId: 'assembly-01'
      }
    ]
  };
  it('Should correctly determine if a part is NOT an assembly', () => {
    expect(isPartAssembly(baseTestPurchasable)).toBe(false);
  });
  it('Should correctly determine if a part is an assembly', () => {
    expect(
      isPartAssembly({
        id: 'assembly-01',
        description: 'fake part',
        sku: '123456',
        stock: 5,
        leadTime: 5,
        priceUnit: 'USD',
        assets: [],
        parts: [
          {
            ...baseTestPurchasable,
            quantity: 2,
            parentId: 'assembly-01'
          }
        ]
      })
    ).toBe(true);
  });
  it('Should correctly determine the color of bubbles', () => {
    expect(
      determineBubbleColor({
        ...baseTestPurchasable,
        isPurchasable: true
      })
    ).toBe(theme.colors.buttons.primary.fill);
    expect(
      determineBubbleColor({
        ...baseTestPurchasable,
        isPurchasable: false
      })
    ).toBe(theme.colors.lightGrey5);
    expect(determineBubbleColor(baseTestAssembly)).toBe(theme.colors.onTrackGreen2);
  });
  it('Should truncate part names correctly', () => {
    expect(
      truncatePartName('% OBSOLETE % *******SEE 123456, ASSY, HOSE, TEST, DO NOT USE', 12)
    ).toBe('% OBSOLET...');
  });
  it('Should truncate part SKUs correctly', () => {
    expect(truncatePartName('12345-AA-BB-CC', 12)).toBe('12345-AA-...');
  });

  it('Should get the correct stock text for an item in stock', () => {
    expect(getStockText(baseTestPurchasable)).toBe('in_stock');
  });
  it('Should get the correct stock text for an item with low stock', () => {
    expect(
      getStockText({
        ...baseTestPurchasable,
        stock: LOW_STOCK_THRESHOLD - 1
      })
    ).toBe('low_stock');
  });
  it('Should get the correct stock text for an item with 1 in stock', () => {
    expect(
      getStockText({
        ...baseTestPurchasable,
        stock: 1
      })
    ).toBe('only_one_in_stock');
  });
  it('Should get the correct stock text for an item with no stock', () => {
    expect(
      getStockText({
        ...baseTestPurchasable,
        stock: 0
      })
    ).toBe('out_of_stock');
  });
  it('Should get the correct description when multilingual desc is present in the part', () => {
    expect(
      determinePartNameToShow(
        {
          ...baseTestPurchasable
        },
        undefined,
        'en',
        i18next.t
      )
    ).toBe('description from ERP');
  });
  it('Should get the correct description when multilingual desc is present in the product', () => {
    expect(
      getProductDescription(
        {
          ...baseTestProduct
        },
        'de'
      )
    ).toBe('Beschreibung aus ERP');
  });
});
