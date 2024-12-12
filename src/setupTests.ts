// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// eslint-disable-next-line
// @ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';

// powerbi-client needs crypto for testing
import crypto from '@trust/webcrypto';
global.crypto = crypto;

// Mocking fetch requests
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
fetchMock.dontMock();

// Ensures determinalistic styled-component classnames when testing, so snapshots do not constantly fail.
import 'jest-styled-components';

// We need to shim this for Jest, as node does not have String.replaceAll
replaceAllInserter.shim();

// We need to define google for running google map tests
window.google = {
  maps: {
    // @ts-ignore
    Map: class {},
    // @ts-ignore
    Marker: class {}
  }
};
