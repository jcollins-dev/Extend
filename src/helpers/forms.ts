// Types
import { OrderAddress, OrderBillee } from 'types/parts';

// Helper functions for form validation

/* Cart */

export const hasRequiredAddressDetails = (addr: OrderAddress): boolean => {
  return Boolean(
    addr.city && addr.postalCode && addr.streetAddress && addr.postalCode && addr.country
  );
};

export const hasRequiredBilleeDetails = (billee: OrderBillee): boolean => {
  return Boolean(billee.firstName && billee.lastName);
};

/* end Cart */

export const isValidEmail = (email: string): boolean => {
  // Taken from W3C Source - https://www.w3resource.com/javascript/form/email-validation.php
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const isOnlyAlphaNumeric = (value: string): boolean => {
  return /^[a-z0-9 ]+$/i.test(value);
};

export const convertCamelCaseintoTitleCase = (value: string): string => {
  const result = value.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const isAlphaNumeric = (value: string): boolean => {
  return /^[a-z0-9-_ ]+$/i.test(value) || value === '';
};
