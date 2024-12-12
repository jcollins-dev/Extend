import { TFunction } from 'i18next';
import theme from 'themes';

import * as H from 'history';
import { Part, Product, PurchasableDetails, StockError } from 'types/parts';

import { LONG_LEAD_TIME_THRESHOLD, LOW_STOCK_THRESHOLD } from 'constants/parts';
import { Bubble } from 'types';

export function isPartAssembly(part: Part | undefined): boolean {
  if (part !== undefined && part.isAssembly) {
    return true;
  }
  return part !== undefined && part.parts !== undefined && part.parts.length > 0;
}

export function traversePartTree(
  query: URLSearchParams,
  history: H.History,
  markerIndex: string,
  markerLabel: string | undefined,
  uuid: string
): void {
  const currentLabel = query.get('labels') || '';
  const currentPaths = query.get('paths') || '';
  query.set('partId', uuid);
  // Add the bubble index and the description or SKU to the URL path,
  // making sure to encode the values new values so as not to lose
  // the commas as delimeters
  let newLabel = `(${markerIndex})`;
  if (markerLabel) {
    // Have to remove commas because part descriptions can have commas in them...
    newLabel = `${newLabel} ${markerLabel.replaceAll(',', ' ')}`;
  }
  query.set('labels', `${currentLabel ? `${currentLabel},` : ''}${newLabel}`);
  // Now, do the same for the paths (so we can navigate)
  query.set('paths', `${currentPaths ? `${currentPaths},` : ''}${uuid}`);
  history.push({
    pathname: history.location.pathname,
    search: `?${query.toString()}`
  });
}

export function determineBubbleColor(
  part?: Part,
  missingInBom?: boolean,
  hasEdit?: boolean
): string | undefined {
  if (hasEdit) {
    return theme.colors.extendedPalettePurple2;
  } else if (missingInBom && !part) {
    return theme.colors.atRiskYellow2;
  } else if (part && isPartAssembly(part)) {
    return theme.colors.onTrackGreen2;
  } else if (part?.isPurchasable) {
    return theme.colors.buttons.primary.fill;
  }
  return theme.colors.lightGrey5;
}

export function determineBackgroundColor(part?: Part): string | undefined {
  if (part === undefined) {
    return undefined;
  } else if (isPartAssembly(part)) {
    return theme.colors.onTrackGreen5;
  } else {
    return theme.colors.background.background1;
  }
}

export function truncatePartName(
  name: string | undefined | null,
  lengthInCharacters: number
): string {
  if (!name) {
    return `No part name available`;
  }
  if (name.length > lengthInCharacters - 3) {
    return `${name.slice(0, lengthInCharacters - 3)}...`;
  }
  return name;
}

export function truncatePartSKU(
  partSKU: string | undefined | null,
  lengthInCharacters: number
): string {
  if (!partSKU) {
    return `No part number available`;
  }
  if (partSKU.length > lengthInCharacters - 3) {
    return `${partSKU.slice(0, lengthInCharacters - 3)}...`;
  }
  return partSKU;
}

export function getCanonicalLeadTimeText(
  purchasable: PurchasableDetails | undefined,
  t: TFunction<'fpns'[], undefined>
): string {
  const canonicalLeadtime = purchasable?.leadTime;
  if (purchasable === undefined || canonicalLeadtime === undefined) {
    return t('lead_time_unavailable', { ns: 'fpns' });
  }
  if (purchasable.stock > 0) {
    return canonicalLeadtime < LONG_LEAD_TIME_THRESHOLD
      ? t('ships_in_1_2_days', { ns: 'fpns' })
      : t('ships_in_days', {
          item: canonicalLeadtime,
          ns: 'fpns'
        });
  }
  if (purchasable.stock < 1) {
    return canonicalLeadtime < LONG_LEAD_TIME_THRESHOLD
      ? t('contact_jbt_for_lead_time', { ns: 'fpns' })
      : t('ships_in_days', {
          item: canonicalLeadtime,
          ns: 'fpns'
        });
  }
  return t('ships_in_days', {
    item: canonicalLeadtime,
    ns: 'fpns'
  });
}

export function getStockText(purchasable: PurchasableDetails | undefined): string {
  const stock = purchasable?.stock;
  const stockError = purchasable?.stockError;
  if (stock === undefined || (stockError !== undefined && stockError === StockError.MISSING)) {
    return 'stock_information_unavailable';
  } else if (stock < LOW_STOCK_THRESHOLD && stock > 1) {
    return 'low_stock';
  } else if (stock == 1) {
    return 'only_one_in_stock';
  } else if (stock <= 0) {
    return 'out_of_stock';
  }
  return 'in_stock';
}

export const determinePartNameToShow = (
  part: Part | undefined,
  marker: Bubble | undefined,
  languageId: string,
  t: TFunction<'fpns'[], undefined>
): string => {
  if (part?.isPurchasable && part.multilingualDesc) {
    type MultiligualLanguageKey = keyof typeof part.multilingualDesc;
    return part.multilingualDesc[languageId as MultiligualLanguageKey];
  }
  if (part?.isPurchasable && part?.description) {
    return part.description;
  }
  if (part?.manualDescription) {
    return part.manualDescription;
  }
  if (part?.description) {
    return part.description;
  }
  if (part?.sku) {
    return part.sku;
  }
  if (marker?.partLabel) {
    return marker.partLabel;
  }
  return t('no_part_name_available', { ns: 'fpns' });
};

export const getProductDescription = (product: Product, languageId: string): string => {
  if (product?.isPurchasable && product.multilingualDesc) {
    type MultiligualLanguageKey = keyof typeof product.multilingualDesc;
    return product.multilingualDesc[languageId as MultiligualLanguageKey];
  }
  if (product?.isPurchasable && product?.description) {
    return product.description;
  }
  if (product?.manualDescription) {
    return product.manualDescription;
  }
  return product.sku;
};
