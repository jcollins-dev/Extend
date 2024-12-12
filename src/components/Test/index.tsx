import React, { ReactElement } from 'react';

const Test = (): ReactElement => {
  return (
    <>
      <h2>Test Comp</h2>
      <button
        onClick={() => {
          throw Error('Test Sentry Error from OmniBlu Extend: after build error fix');
        }}
      >
        Test Sentry Error
      </button>
    </>
  );
};

export default Test;
