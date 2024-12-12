import React from 'react';
import { hasRequiredAddressDetails, hasRequiredBilleeDetails, isValidEmail } from 'helpers';
import { OrderAddress, OrderBillee } from 'types/parts';

describe('Form Helper - Addresses', () => {
  it('Should be false if missing all address required fields', () => {
    const testAddr: OrderAddress = {
      streetAddress: '',
      suiteNumber: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    };
    expect(hasRequiredAddressDetails(testAddr)).toBe(false);
  });

  it('Should be false if missing some address required fields', () => {
    const testAddr: OrderAddress = {
      streetAddress: '444 Liberty Ave',
      suiteNumber: '1600',
      city: 'Pittsburgh',
      state: '',
      postalCode: '15222',
      country: ''
    };
    expect(hasRequiredAddressDetails(testAddr)).toBe(false);
  });

  it('Should be true if all required address fields provided', () => {
    const testAddr: OrderAddress = {
      streetAddress: '444 Liberty Ave',
      city: 'Pittsburgh',
      state: 'PA',
      postalCode: '15222',
      country: 'UNITED STATES'
    };
    expect(hasRequiredAddressDetails(testAddr)).toBe(true);
  });
});

describe('Form Helper - Billee', () => {
  it('Should be false if missing both billee first and last name', () => {
    const testBillee: OrderBillee = {
      firstName: '',
      lastName: ''
    };
    expect(hasRequiredBilleeDetails(testBillee)).toBe(false);
  });

  it('Should be false if missing billee first or last name', () => {
    const testBillee1: OrderBillee = {
      firstName: '',
      lastName: 'Last'
    };
    expect(hasRequiredBilleeDetails(testBillee1)).toBe(false);

    const testBillee2: OrderBillee = {
      firstName: 'First',
      lastName: ''
    };
    expect(hasRequiredBilleeDetails(testBillee2)).toBe(false);
  });

  it('Should be true if all billee details provided', () => {
    const testBillee: OrderBillee = {
      firstName: 'First',
      lastName: 'Last'
    };
    expect(hasRequiredBilleeDetails(testBillee)).toBe(true);
  });
});

describe('Form Helper - Email', () => {
  it('Invalid email format should return false', () => {
    expect(isValidEmail('Brian.Reed@jbtc')).toBe(false);
    expect(isValidEmail('Kamel.Rushaidat.jbtc.com')).toBe(false);
    expect(isValidEmail('Gregory.Reeves@.com')).toBe(false);
  });

  it('Valid email format should return false', () => {
    expect(isValidEmail('Brian.Reed@jbtc.com')).toBe(true);
    expect(isValidEmail('Kamel.Rushaidat@jbtc.com')).toBe(true);
    expect(isValidEmail('Gregory.Reeves@jbtc.com')).toBe(true);
  });
});
