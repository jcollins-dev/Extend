import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import {
  useGetMachineHealthByIdsQuery,
  useGetOrganizationByIdQuery,
  useGetLinesQuery,
  useGetProductsQuery,
  useUpdateCartProductMutation,
  useGetCartProductsQuery,
  useGetMachineCleaningStatesQuery,
  useImportConfiguredMasterTagListMutation,
  useGetMaintenanceScheduleQuery,
  useGetDiagramNoErpQuery,
  useGetDiagramZeroPriceQuery,
  useGetDiagramNoImageQuery,
  useGetTagListVersionsByMtlIdQuery,
  useGetMasterTagListTemplateQuery,
  useValidateMasterTagListImportMutation
} from '.';
import { Provider } from 'react-redux';
import { setupApiStore } from './tests/testUtils';
import { iopsApi } from './';

const updateTimeout = 5000;

beforeEach((): void => {
  fetchMock.resetMocks();
});

const wrapper: React.FC = ({ children }) => {
  const storeRef = setupApiStore(iopsApi);
  return <Provider store={storeRef.store}>{children}</Provider>;
};

describe('useGetOrganizationByIdQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetOrganizationByIdQuery('123'), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetOrganizationByIdQuery('123'), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetLinesQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetLinesQuery({ plantIds: [] }), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetLinesQuery({ plantIds: [] }), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetProductsQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(
      () => useGetProductsQuery({ productIds: [] }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(
      () => useGetProductsQuery({ productIds: [] }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetMachineHealthByIdsQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetMachineHealthByIdsQuery(['123']), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetMachineHealthByIdsQuery(['123']), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useUpdateCartProductMutation', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result } = renderHook(() => useUpdateCartProductMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result } = renderHook(() => useUpdateCartProductMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });
});

describe('useGetCartProductsQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(
      () => useGetCartProductsQuery({ productIds: [] }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(
      () => useGetCartProductsQuery({ productIds: [] }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetMachineCleaningStatesQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useGetMachineCleaningStatesQuery({
          machineId: '123',
          startDatetime: '2021-01-01T00:00:00.000Z'
        }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useGetMachineCleaningStatesQuery({
          machineId: '123',
          startDatetime: '2021-01-01T00:00:00.000Z'
        }),
      {
        wrapper
      }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useImportConfiguredMasterTagListMutation', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result } = renderHook(() => useImportConfiguredMasterTagListMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result } = renderHook(() => useImportConfiguredMasterTagListMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });
});

describe('useGetMaintenanceScheduleQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetMaintenanceScheduleQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetMaintenanceScheduleQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetDiagramNoErpQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramNoErpQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramNoErpQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetDiagramZeroPriceQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramZeroPriceQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramZeroPriceQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetDiagramNoImageQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramNoImageQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetDiagramNoImageQuery({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetTagListVersionsByMtlIdQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetTagListVersionsByMtlIdQuery(''), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetTagListVersionsByMtlIdQuery(''), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useGetMasterTagListTemplateQuery', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useGetMasterTagListTemplateQuery('{}'), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result, waitForNextUpdate } = renderHook(() => useGetMasterTagListTemplateQuery('{}'), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe('useValidateMasterTagListImportMutation', () => {
  it('Success', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const { result } = renderHook(() => useValidateMasterTagListImportMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });

  it('Internal Server Error', async () => {
    fetchMock.mockReject(new Error('Internal Server Error'));
    const { result } = renderHook(() => useValidateMasterTagListImportMutation({}), {
      wrapper
    });
    const initialResponse = result.current;
    expect(initialResponse.length).toBe(2);
  });
});
