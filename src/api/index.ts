// 3rd party libraries
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { cloneDeep, upperCase } from 'lodash';

// Types
import {
  BaseType,
  BusinessUnit,
  FileUpload,
  Id,
  MultipleFileUpload,
  Line,
  LinesArgs,
  LineViewAssetArgs,
  Machine,
  MachineAsset,
  MachineAssetArgs,
  MachinesArgs,
  Organization,
  PaginatedMaintenanceEventGroupResults,
  PaginatedResults,
  Plant,
  SearchQuery,
  User,
  PlantBuContacts,
  DigitalEdgeType,
  Language,
  OrdersByMachineId,
  OrderDetails,
  OrderedMachineList,
  MasterTagListArgs
} from 'types';
import { AuthResponseBody } from 'types/auth';
import {
  AsepticMachineHealthKpi,
  AsepticMachineHealthKpiQueryParams,
  MachineHealthKpiItem,
  MachineHealthKpiQueryParams,
  MachineHealthKpiUom,
  MachineHealthProductTypeKpiQueryParams,
  WidgetTableDataItem
} from 'types/machine-health';
import { Alarm, ConfiguredAlarm, DSIAlarm } from 'types/machine-health/alarms';
import {
  Alert,
  AlertConfig,
  AlertDataScienceSurvey,
  AlertDetail,
  AlertEnumTypes,
  AlertQueryParams,
  IDeleteAlert,
  IGetAlerts,
  AlertStatementTag,
  MachineAlert,
  MachineAlertQueryParams,
  SaveAlertPayload,
  TAlertData
} from 'types/machine-health/alerts';
import {
  MachineProductionKpiQueryParams,
  UpdateProsealAdminRecipeQueryParams
} from 'types/machine-production';
import { MachineVisionKpi, MachineVisionKpiQueryParams } from 'types/machine-vision';
import {
  ConfirmOrderInputWithSFFlag,
  GetProductsArgs,
  GetProductTagsArgs,
  OrderInputWithSFFlag,
  OrderResponse,
  Part,
  PartFilterRequest,
  PartsByIdsArgs,
  PartsByMachineIdArgs,
  Product,
  ProductByIdWithMachineArgs,
  ProductTag,
  SavedProductInput
} from 'types/parts';
import { CartInput, CartResponse, SFCart, SFCartItem } from 'types/parts/cart';
import {
  DataScienceSurvey,
  DataScienceSurveyArgs,
  HelpEmailArgs,
  MaintenanceEvent,
  MaintenanceEventArgs,
  MaintenanceEventGroup,
  MaintenanceSchedule,
  MaintenanceScheduleArgs,
  MachineCurrentRunMetricArgs,
  MachineCurrentRunMetric,
  MaintenceScheduleImportRow,
  UploadMaintenanceScheduleResponse,
  MaintenanceEventDownloadLink,
  MaintenanceEventDownloadPayload
} from 'types/maintenance';
import {
  DowntimeRow,
  ProsealMachineProductionAllDataQueryParams,
  ProsealMachineProductionAnalysisAllData,
  ProsealMachineProductionKpis,
  ProsealDowntimeQueryParams,
  ProsealRecipeSegment,
  ProsealRecipeStats,
  ProsealStatus,
  ProsealAdminRecipe,
  ProsealExcelUrl
} from 'types/proseal';
import {
  AccountInfo,
  AlertConfigQueryParams,
  BaseTag,
  CleaningSession,
  CleaningSessionsKpi,
  CleaningState,
  CleaningStepWithKPI,
  ConfiguredWidget,
  ConfiguredWidgetQueryParams,
  ConnectionStatusResponse,
  DataAnalysisViewDetails,
  KeyIndicatorHistory,
  KeyIndicatorsHistoryQueryParams,
  LastCleaningSession,
  LineInfo,
  LineMachinesStatesQueryParams,
  LineMachineStates,
  LineRouteQueryParams,
  LineStates,
  LineStatus,
  LineViewImageParams,
  MachineAccountInfoQueryParams,
  MachineAlarmRequestParams,
  PressurizeCycleRequestParams,
  PressurizeCycle,
  PressurizeState,
  MachineCleaningSessionsKpiRequestParams,
  MachineCleaningSessionsRequestParams,
  MachineCleaningStateRequestParams,
  MachineCleaningStateUtilityMetricsKpiRequestParams,
  MachineCleaningStepRequestParams,
  MachineConfiguratorCopyQueryParams,
  MachineConfiguratorPatchQueryParams,
  MachineConfiguratorQueryParams,
  MachineDriveSystemStatesQueryParams,
  MachineLineStatus,
  MachineMasterTag,
  MachineMasterTagDeleteParams,
  MachineMasterTagQueryParams,
  MachineMasterTagUpdateParams,
  MachineOverviewTag,
  MachineProductionMetrics,
  MachineQueryParams,
  MachineStatesCategoriesQueryParams,
  MachineTagsHistoryQueryParams,
  MachineThermalStatesQueryParams,
  MachineUnitClass,
  MachineUtilization,
  MachineUtilizationQueryParams,
  MachineWidgetQueryParams,
  SiteRouteQueryParams,
  StateCategory,
  StatePeriod,
  Tag,
  TemplateInput,
  TemplateQueryParams,
  TemplateResponse,
  ThermalState,
  UtilityMetrics,
  PressurizedTimeAverageRequestParams
} from 'types/protein';
import { SalesforceAccount, SalesforceMachine } from 'types/salesforce';
import {
  AsepticChangeoverType,
  AsepticMachineHealthAlarmsByLaneRequestParams,
  AsepticMachineHealthChangeoverByDateRangeRequestParams,
  AsepticMachineHealthChangeoverByIdParams,
  AsepticMachineHealthChangeoverTopRequestParams,
  AsepticMachineHealthChangeoverDetailsParams,
  AsepticChangeoverDetailType
} from 'types/machine-health/aseptic';

// Redux
import { authActions, cartActions, userActions } from 'actions';
import { RootState } from 'reducers';

// Helpers
import {
  addArgsToPath,
  censorMaintenanceEventUpdates,
  defaultTransformResponse,
  productTransformResponse,
  snakeCaseKeysDeep
} from 'helpers';

// Analytics
import { AnalyticsCategories, ECommerceAnalyticEventActions } from 'constants/analytics';
import { generateAnalyticsEvent } from 'helpers/analytics';

// Constants
import { API_UNUSED_DATA_CACHE_SECONDS } from 'constants/api';
import { getB2CAccessToken } from 'helpers/authB2C';
import { MachineStateRequestParams } from 'types/dsi';
import {
  AccountSalesforce,
  AccountSalesforceArgs,
  AssetSalesforce,
  AssetSalesforceArgs,
  MachineOnboardingDiagramParams,
  MachineOnboardingMaintenanceScheduleParams,
  MachineOnboardingStatusInput,
  MachineType,
  OnboardingMachine,
  OnboardingMachineParams,
  PartHierarchyArgs,
  SaveOnboardingMachine,
  CreatePowerBiMachineData,
  DataQualityInImage,
  PartNode,
  PartNodeExtension,
  ProductsPartsUploadParams,
  MasterTagList,
  PartsPhotoUploadParams,
  PartsPhotoUploadResponse,
  PartHierarchy,
  UpdateBubbleArgs,
  CreateBubbleArgs,
  DeleteMasterTagListVersionParams,
  MasterTagListColumn,
  MasterTagListPayload,
  MasterTagListVersion,
  MasterTagListImportParams,
  MasterTagListVersionParams,
  MasterTagListWrapped,
  MtlAttrDsdmWithError,
  MtlAttrKdmWithError,
  MtlAttrMqttWithError,
  MasterTagListMappingArgs,
  MasterTagListMappingPayload,
  MachineModel,
  UpdateProvisionGatewayArgs,
  UnmappedMasterTagListType,
  DeviceTypesArgs,
  Driver,
  DeviceType,
  ImportedMachineTagList,
  ImportMachineTagListParams,
  UnmappedMachineTagList,
  MasterToMachineMappingPayload,
  ReviewMachineMtlQueryParams,
  ReviewMachineMtlData,
  ReviewMachineMtlRequest,
  MachineConfigParams,
  MachineTagListMappingArgs,
  DeleteMachineTagListParams,
  MachineToMasterMappingParams,
  EditedBubbleRecord,
  DeleteCustomMasterTagsParams,
  PartUpdate,
  MasterTaglistMatchingTag
} from 'types/machine-management';
import { LineViewWidgetTableDataItem } from 'types/machine-health/widget-table';
import {
  Group,
  GroupItem,
  UserManagementGroupsParams,
  UserManagementPermission,
  ValidateUserEmailAvailableParams,
  UserItem
} from 'types/user-management';

// static setup
const mutex = new Mutex();

export const defaultPostQuery = <T extends BaseType | BaseType[]>(
  body: T,
  endpoint: string
): {
  url: string;
  method: 'POST';
  body: BaseType | BaseType[] | null;
} => ({
  url: endpoint,
  method: 'POST',
  body: snakeCaseKeysDeep(body)
});

export const defaultPatchQuery = <T extends BaseType | BaseType[]>(
  body: T,
  endpoint: string
): {
  url: string;
  method: 'PATCH';
  body: BaseType | BaseType[] | null;
} => ({
  url: endpoint,
  method: 'PATCH',
  body: snakeCaseKeysDeep(body)
});

export const defaultPatchQueryNoSkakeCase = <T extends BaseType | BaseType[]>(
  body: T,
  endpoint: string
): {
  url: string;
  method: 'PATCH';
  body: BaseType | BaseType[] | null;
} => ({
  url: endpoint,
  method: 'PATCH',
  body: body
});

export const defaultPutQuery = <T extends BaseType | BaseType[]>(
  body: T,
  endpoint: string
): {
  url: string;
  method: 'PUT';
  body: BaseType | BaseType[] | null;
} => ({
  url: endpoint,
  method: 'PUT',
  body: snakeCaseKeysDeep(body)
});

export const defaultDeleteQuery = <T extends BaseType | BaseType[]>(
  endpoint: string,
  body?: T
): {
  url: string;
  method: 'DELETE';
  body: BaseType | BaseType[] | null | undefined;
} => ({
  url: endpoint,
  method: 'DELETE',
  body: body ? snakeCaseKeysDeep(body as BaseType | BaseType[]) : undefined
});

// Base query
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API,
  prepareHeaders: (headers, { getState }) => {
    // TODO: why can't we use a selector here?
    const token = (getState() as RootState).tokens?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Base query wrapper to check if it is time to re-authorize
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extras) => {
  const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';

  // Block queries if the refresh token is being retrieved
  await mutex.waitForUnlock();

  // Get B2C access token
  if (b2cflag) {
    await getB2CAccessToken(api.dispatch);
  }

  // Get the initial result of the current request
  let result = await baseQuery(args, api, extras);

  // Try to get a new token if access token has expired
  if (!b2cflag && result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      const logout = () => {
        api.dispatch({ type: authActions.DELETE_TOKENS });
        api.dispatch({ type: userActions.LOGOUT_USER });
        api.dispatch({ type: cartActions.DELETE_CART_USER_ID });
      };

      try {
        const storedRefreshToken = sessionStorage.getItem('refreshToken');

        if (storedRefreshToken) {
          const newTokenResult = await baseQuery(
            {
              url: 'token/refresh',
              method: 'POST',
              body: {
                refresh_token: storedRefreshToken
              }
            },
            api,
            extras
          );

          if (!newTokenResult.error && newTokenResult.data) {
            const tokens = newTokenResult.data as AuthResponseBody;

            // Update the access token
            api.dispatch({
              type: authActions.SET_TOKENS,
              accessToken: tokens.access_token,
              refreshToken: storedRefreshToken
            });

            // Hit the initial endpoint again
            result = await baseQuery(args, api, extras);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        release();
      }
    } else {
      // If the mutex was locked, wait until it is available...
      await mutex.waitForUnlock();
      // ... then try again
      result = await baseQuery(args, api, extras);
    }
  }
  return result;
};

export const manageCartState = (
  patch: CartInput | Partial<CartInput>,
  updatedPost: CartResponse | void
): SFCart | undefined => {
  const sfCart = cloneDeep(patch?.cart?.sfCart);
  if (sfCart?.cartSummary) {
    sfCart.cartSummary.cartId = updatedPost
      ? (updatedPost.cartId as string)
      : sfCart.cartSummary.cartId;
  }
  const updatedCartItemId = updatedPost ? updatedPost.cartItemId : patch?.cartItemId;
  const updatedQty = updatedPost?.quantity ? updatedPost.quantity : patch.quantity;
  const sfCartItemIndex: number = sfCart?.cartItems?.findIndex(
    (sfItem) => sfItem.cartItem.cartItemId === updatedCartItemId
  ) as number;
  if (sfCartItemIndex > -1) {
    const updatedSFCartItem = (sfCart?.cartItems as SFCartItem[])[sfCartItemIndex];
    updatedSFCartItem.quantity = updatedQty as number;
  } else {
    sfCart?.cartItems?.push({
      cartItem: {
        cartId: updatedPost?.cartId as string,
        cartItemId: updatedPost?.cartItemId as string,
        productId: updatedPost?.productId as string,
        quantity: updatedQty as number,
        type: updatedPost?.type as string
      }
    });
  }
  return sfCart;
};

export const iopsApi = createApi({
  reducerPath: 'iopsApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: API_UNUSED_DATA_CACHE_SECONDS,
  tagTypes: [
    'PowerBiData',
    'AlertConfigs',
    'DataScienceAlerts',
    'DATemplates',
    'SavedProducts',
    'MaintenanceEvents',
    'Parts',
    'LineViewAssets',
    'MachineConfigurator',
    'MaintenanceSchedules',
    'MachineUtilization',
    'MachineMasterTags',
    'MachineUnitClasses',
    'MachineOverviewTags',
    'ProsealAdminRecipe',
    'MachineOnboardingTags',
    'EditableBubblesTag',
    'MasterTagListTag',
    'ReviewMachineMtlTag',
    'Groups',
    'Users',
    'BubbleEditsTag',
    'PartsNotInErpTag',
    'MasterTagListVersion',
    'MachineOnboardingByIdTag',
    'MachineAlertsTag'
  ],
  endpoints: (builder) => ({
    getOrganizationById: builder.query<Organization, string>({
      query: (id: string) => `/organizations/${id ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    getOrganizations: builder.query<Organization[], void>({
      query: () => '/organizations',
      transformResponse: defaultTransformResponse
    }),
    getPlants: builder.query<Plant[], void>({
      query: () => '/plants',
      transformResponse: defaultTransformResponse
    }),
    getLanguages: builder.query<Language[], void>({
      query: () => '/languages',
      transformResponse: defaultTransformResponse
    }),
    getOrders: builder.query<OrderDetails, OrdersByMachineId>({
      query: (args: OrdersByMachineId) => {
        return `/fps/v1/get-machine-order${addArgsToPath(args)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getOrderMachines: builder.query<OrderedMachineList, void>({
      query: () => {
        return `/fps/v1/get-lists-machine`;
      },
      transformResponse: defaultTransformResponse
    }),
    getPlantById: builder.query<Plant, string>({
      query: (id: string) => `/plants/${id ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    getLines: builder.query<Line[], LinesArgs>({
      query: (args: LinesArgs) => {
        let path = '/lines';
        path = path + addArgsToPath(args);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getPartsByMachineId: builder.query<Machine, string>({
      query: (id: string) => `fps/v1/machines/${id ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    getFilteredOnStockParts: builder.query<PaginatedResults<Product>, PartFilterRequest>({
      query: (params: PartFilterRequest) => {
        let url = '';
        if (params.machineId)
          url = `fps/v1/search-parts-filter?machine_id=${params.machineId}&stock_status_require=${params.option}&limit=${params.limit}&offset=${params.offset}`;
        else
          url = `fps/v1/search-parts-filter?stock_status_require=${params.option}&limit=${params.limit}&offset=${params.offset}`;
        return url;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineById: builder.query<Machine, string>({
      query: (id: string) => `/machines/${id ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    // this endpoint should not be a mutation, because it performs the effect of a GET.
    // However, in some cases there can be so many query parameters used with this query that
    // the backend returns a 431 Request Headers Too Large. To get around that, the uuids in this
    // request are sent in the body, and the request is a POST. We would have made this a GET request
    // with a body, but Swagger doesn't support GET requests with bodies, and we didn't want to make
    // this endpoint uniquely difficult to debug. So, a POST it is!
    getPartsByIds: builder.mutation<Part[], PartsByIdsArgs>({
      query: (args: PartsByIdsArgs) => {
        const uuids = args.uuids;
        delete args.uuids;
        return {
          url: '/fps/v1/parts' + addArgsToPath(args),
          method: 'POST',
          body: uuids
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getProducts: builder.query<PaginatedResults<Product>, GetProductsArgs>({
      query: (args: GetProductsArgs) => {
        let path = '/fps/v1/products';
        path = path + addArgsToPath(args);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getProductsWithSpecifiedCurrencies: builder.query<
      Product[],
      { id: string; priceUnit?: string }[]
    >({
      queryFn: async (
        productsArgs: { id: string; priceUnit?: string }[],
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) => {
        const productResponse = await Promise.all(
          productsArgs.map(async (prodArgs) => {
            const queryParams = addArgsToPath({ priceUnit: prodArgs.priceUnit });
            return await fetchWithBQ(`/fps/v1/products/${prodArgs.id}${queryParams}`);
          })
        );

        const error = productResponse.find((item) => item.error !== undefined) as
          | FetchBaseQueryError
          | undefined;

        const data: Product[] = productResponse
          .filter((item) => item.error === undefined && item.data !== undefined)
          .map((productData) => defaultTransformResponse(productData.data as Product));

        return error ? { error: error } : { data: data };
      }
    }),
    getPartById: builder.query<Part, string>({
      query: (id: string) => `/fps/v1/parts/${id ?? ''}`,
      transformResponse: productTransformResponse
    }),
    getProductById: builder.query<Product, ProductByIdWithMachineArgs>({
      query: (args: ProductByIdWithMachineArgs) => {
        let path = `/fps/v1/products/${args.id ?? ''}`;
        const queryArgs = { ...args };
        delete queryArgs.id;

        path = path + addArgsToPath(queryArgs);
        return path;
      },
      transformResponse: productTransformResponse
    }),
    getProductsByMachineId: builder.query<PaginatedResults<Product>, PartsByMachineIdArgs>({
      query: (args: PartsByMachineIdArgs) => {
        let path = `/machines/${args.id ?? ''}/products`;

        // Grab the args that without the machine ID
        const queryArgs = {
          pageNumber: args.offset,
          limit: args.limit,
          searchQuery: args.searchQuery,
          startNodeSku: args.startNodeSku
        };

        path = path + addArgsToPath(queryArgs);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getProductTags: builder.query<ProductTag[], GetProductTagsArgs>({
      query: (args: GetProductTagsArgs) => {
        let path = `/fps/v1/product-category`;
        path = path + addArgsToPath(args);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachines: builder.query<Machine[], MachinesArgs>({
      query: (args: MachinesArgs) => {
        let path = `/machines`;
        path = path + addArgsToPath(args);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineHealthById: builder.query<MachineHealthKpiUom, string>({
      query: (id: string) => `/mh/v1/machine-health-kpi/${id ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    getMachineHealthByIds: builder.query<MachineHealthKpiUom, void | string[]>({
      query: (ids: string[] = []) => {
        const params = new URLSearchParams();
        ids.forEach((id) => params.append('machine_ids', id));
        return `/mh/v1/machine-health-kpi?${params.toString()}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachinePressure: builder.query<Record<string, unknown>, PressurizedTimeAverageRequestParams>(
      {
        query: (args: PressurizedTimeAverageRequestParams) => {
          const { machineId, ...rest } = args;
          let path = `/mh/v1/avure/machine-health/${machineId}/cycle-data-aggregate-kpi`;
          path = path + addArgsToPath(rest);
          return path;
        },
        transformResponse: defaultTransformResponse
      }
    ),
    getPressurizeCycleDataById: builder.query<PressurizeCycle[], PressurizeCycleRequestParams>({
      query: (args: PressurizeCycleRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/avure/machine-health/${machineId}/cycle-data`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getPressurizeStateDataById: builder.query<
      PressurizeState[],
      PressurizedTimeAverageRequestParams
    >({
      query: (args: PressurizedTimeAverageRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/avure/machine-health/${machineId}/machine-state-aggregate-kpi`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    // Validate the current session by just hitting the user endpoint
    validateToken: builder.query<void, undefined>({
      query: () => {
        return '/users/me';
      }
    }),
    getUser: builder.query<User, void>({
      query: () => {
        return '/users/me';
      },
      transformResponse: defaultTransformResponse
    }),
    getUserById: builder.query<User, Id>({
      query: (userId: Id) => {
        return `/usr/v1/user-by-id?user_id=${userId}`;
      },
      providesTags: ['Users'],
      transformResponse: defaultTransformResponse
    }),
    search: builder.query<PaginatedResults<Product>, SearchQuery>({
      query: (q: SearchQuery) => {
        const searchAnalyticsQuery =
          q.query === undefined || q.query.length === 0 ? 'Default Search' : q.query;
        generateAnalyticsEvent({
          category: AnalyticsCategories.ECOMMERCE,
          action: ECommerceAnalyticEventActions.SEARCH,
          label: searchAnalyticsQuery
        });
        let path = `/fps/v1/search`;
        path = path + addArgsToPath(q);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    createOrder: builder.mutation<OrderResponse, OrderInputWithSFFlag>({
      query: (order: OrderInputWithSFFlag) =>
        defaultPostQuery<OrderInputWithSFFlag>(order, '/fps/v1/order'),
      transformResponse: defaultTransformResponse
    }),
    draftOrderQuote: builder.mutation<OrderResponse, OrderInputWithSFFlag>({
      query: (order: OrderInputWithSFFlag) =>
        defaultPostQuery<OrderInputWithSFFlag>(order, '/fps/v1/draft-order-quote'),
      transformResponse: defaultTransformResponse
    }),
    confirmOrder: builder.mutation<string, ConfirmOrderInputWithSFFlag>({
      query: (confirmation: ConfirmOrderInputWithSFFlag) =>
        defaultPostQuery<ConfirmOrderInputWithSFFlag>(confirmation, '/fps/v1/confirm_order'),
      transformResponse: defaultTransformResponse
    }),
    addProductToCart: builder.mutation<CartResponse, CartInput>({
      query: (cart: CartInput) =>
        defaultPostQuery<CartInput>(cart, `/fps/v1/carts/me/products?account_id=${cart.accountId}`),
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        const { data: updatedPost } = await queryFulfilled;
        const sfCart = manageCartState(patch, updatedPost);
        dispatch({
          type: cartActions.ADD_TO_CART,
          item: patch.product,
          groupId: patch.machineId,
          groupDescription: patch.machineDescription,
          sfCartId: updatedPost.cartId,
          sfCart: sfCart,
          ...(patch.quantity && { quantity: patch.quantity })
        });
      },
      transformResponse: defaultTransformResponse
    }),

    updateCartProduct: builder.mutation<void, Partial<CartInput>>({
      query: (cart: Partial<CartInput>) => {
        const cartWithoutId = cloneDeep(cart);
        delete cartWithoutId.cartItemId;
        return defaultPutQuery<Partial<CartInput>>(
          cartWithoutId,
          `/fps/v1/carts/me/products/${cart.cartItemId}`
        );
      },
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        const { data: updatedPost } = await queryFulfilled;
        const sfCart = manageCartState(patch, updatedPost);
        dispatch({
          type: cartActions.SET_ITEM_QUANTITY,
          item: patch.product,
          groupId: patch.machineId,
          sfCartId: patch.cart?.sfCartId,
          sfCart: sfCart,
          quantity: patch.quantity
        });
      },
      transformResponse: defaultTransformResponse
    }),
    deleteCartProducts: builder.mutation<void, Partial<CartInput>>({
      query: (cart: Partial<CartInput>) => {
        return defaultDeleteQuery<Partial<CartInput>>(
          `/fps/v1/carts/me/products/${cart.cartItemId}`,
          cart
        );
      },
      transformResponse: defaultTransformResponse
    }),
    getCartProducts: builder.query<SFCart, Partial<CartInput>>({
      query: (cart: Partial<CartInput>) => {
        return `/fps/v1/carts/me/products?account_id=${cart.accountId}`;
      },
      async onQueryStarted({ ...queryArg }, { dispatch, queryFulfilled }) {
        try {
          if (queryArg.accountId) {
            const { data: sfCartData } = await queryFulfilled;
            dispatch({
              type: cartActions.SET_SF_CART,
              sfCart: sfCartData
            });
          }
        } catch (error) {
          console.warn('Setting Salesforce Cart failed! Error:', error);
        }
      },
      transformResponse: defaultTransformResponse
    }),
    savedProduct: builder.mutation<SavedProductInput[], SavedProductInput[]>({
      query: (products: SavedProductInput[]) =>
        defaultPostQuery<SavedProductInput[]>(products, '/fps/v1/saved-product'),
      invalidatesTags: ['SavedProducts'],
      transformResponse: defaultTransformResponse
    }),
    getSavedProducts: builder.query<SavedProductInput[], void>({
      query: () => `/fps/v1/saved-products`,
      providesTags: ['SavedProducts'],
      transformResponse: defaultTransformResponse
    }),
    deleteSavedProduct: builder.mutation<void, { productId: string; priceUnit?: string }>({
      query: ({ productId: productId, priceUnit: priceUnit }) =>
        defaultDeleteQuery(`/fps/v1/saved-product/${productId}?price_unit=${priceUnit}`),
      invalidatesTags: ['SavedProducts'],
      transformResponse: defaultTransformResponse
    }),
    getMachinesCurrentRunMetric: builder.query<
      MachineCurrentRunMetric[],
      MachineCurrentRunMetricArgs
    >({
      query: (args: MachineCurrentRunMetricArgs) => {
        let path = `/fps/v1/machine-current-run-metric`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      providesTags: ['MachineUtilization'],
      transformResponse: defaultTransformResponse
    }),
    getMaintenanceEvents: builder.query<
      PaginatedMaintenanceEventGroupResults<MaintenanceEvent>,
      MaintenanceEventArgs
    >({
      query: (args: MaintenanceEventArgs) => {
        let path = `/fps/v1/maintenance-events`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      providesTags: ['MaintenanceEvents'],
      transformResponse: defaultTransformResponse
    }),
    createMaintenanceEvents: builder.mutation<string[], Partial<MaintenanceEvent>[]>({
      query: (events: Partial<MaintenanceEvent>[]) =>
        defaultPostQuery<Partial<MaintenanceEvent>[]>(events, '/fps/v1/maintenance-events'),
      invalidatesTags: ['MaintenanceEvents'],
      transformResponse: defaultTransformResponse
    }),
    updateMaintenanceEvents: builder.mutation<void, MaintenanceEvent[]>({
      query: (args: MaintenanceEvent[]) =>
        defaultPatchQuery<MaintenanceEvent[]>(
          censorMaintenanceEventUpdates(args),
          '/fps/v1/maintenance-events'
        ),
      invalidatesTags: ['MaintenanceEvents'],
      transformResponse: defaultTransformResponse
    }),
    getDataScienceSurvey: builder.query<DataScienceSurvey, DataScienceSurveyArgs>({
      query: (args: DataScienceSurveyArgs) => {
        let path = `/fps/v1/data-science-survey`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    createDataScienceSurvey: builder.mutation<string[], Partial<DataScienceSurvey>>({
      query: (survey: Partial<DataScienceSurvey>) =>
        defaultPostQuery<Partial<DataScienceSurvey>>(survey, '/fps/v1/data-science-survey'),
      transformResponse: defaultTransformResponse
    }),
    createHelpEmail: builder.mutation<string[], HelpEmailArgs>({
      query: (args: HelpEmailArgs) => ({
        url: `/help-email` + addArgsToPath(args as BaseType),
        method: 'POST',
        body: args.image ? args.image : ''
      }),
      transformResponse: defaultTransformResponse
    }),
    mapMasterMatchingTags: builder.mutation<void, MasterTaglistMatchingTag>({
      query: (args: MasterTaglistMatchingTag) => ({
        url: `/tl/v1/map-machine-tag-lists`,
        method: 'POST',
        body: snakeCaseKeysDeep(args)
      }),
      transformResponse: defaultTransformResponse
    }),
    clearRecentlyCompletedMaintenanceSchedules: builder.mutation<void, void | string[]>({
      query: (args: string[] = []) => ({
        url: `/fps/v1/maintenance-schedules/clear-recently-completed`,
        method: 'POST',
        body: args ? args : []
      }),
      transformResponse: defaultTransformResponse
    }),
    downloadSelectedPlannedMaintenanceEvents: builder.mutation<
      MaintenanceEventDownloadLink,
      MaintenanceEventDownloadPayload
    >({
      query: (args: MaintenanceEventDownloadPayload) =>
        defaultPostQuery<MaintenanceEventDownloadPayload>(args, '/fps/maintenance-schedule-export'),
      transformResponse: defaultTransformResponse
    }),
    getPowerBiToken: builder.query<string, undefined>({
      query: () => `/powerbi-token`,
      transformResponse: defaultTransformResponse
    }),
    /**
     * Machine cleaning queries
     */
    getMachineCleaningSessions: builder.query<
      CleaningSession[],
      MachineCleaningSessionsRequestParams
    >({
      query: (args: MachineCleaningSessionsRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machine-cleaning-sessions/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineCleaningSessionDetails: builder.query<
      CleaningStepWithKPI[],
      MachineCleaningStepRequestParams
    >({
      query: (args: MachineCleaningStepRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machine-cleaning-session-details/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineCleaningStates: builder.query<CleaningState[], MachineCleaningStateRequestParams>({
      query: (args: MachineCleaningStateRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machine-cleaning-states/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineLastCleaningSession: builder.query<LastCleaningSession, MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/last-cleaning-session-summary/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Machine alarm queries
     */
    getMachineAlarms: builder.query<Alarm[], MachineAlarmRequestParams>({
      query: (args: MachineAlarmRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machine-alarms/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getAvureAlarms: builder.query<Alarm[], MachineAlarmRequestParams>({
      query: (args: MachineAlarmRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/avure/machine-health/${machineId}/alarms`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getDSIAlarms: builder.query<DSIAlarm[], MachineAlarmRequestParams>({
      query: (args: MachineAlarmRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/dsi-machine-alarms/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineConfiguredAlarms: builder.query<ConfiguredAlarm[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return (
          `/mh/v1/machines/${machineId}/configured-alarms` + addArgsToPath({ export_to_csv: false })
        );
      },
      transformResponse: defaultTransformResponse
    }),
    importConfiguredAlarms: builder.mutation<ConfiguredAlarm[], FileUpload & MachineQueryParams>({
      query: (args: FileUpload & MachineQueryParams) => {
        const { machineId } = args;

        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url:
            `/mh/v1/machines/${machineId}/configured-alarms/import` +
            addArgsToPath({ delete_not_present: true }),
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Machine data science alert queries
     */
    getMachineDataScienceAlerts: builder.query<Alert[], AlertQueryParams>({
      query: (args: AlertQueryParams) => {
        const { machineId, ...rest } = args;
        let path = `/fps/v1/machines/${machineId}/alerts`;
        path = path + addArgsToPath(rest);

        // TODO: Remove this query param after API is updated to default the alert_type for
        //  all alerts
        path = path + `&alert_type=operations`;

        return path;
      },
      providesTags: ['DataScienceAlerts'],
      transformResponse: defaultTransformResponse
    }),
    getDataScienceAlertDetails: builder.query<AlertDetail, string>({
      query: (alertId: string) => `/fps/v1/alerts/${alertId ?? ''}`,
      transformResponse: defaultTransformResponse
    }),
    createDataScienceAlertSurvey: builder.mutation({
      query: (survey: AlertDataScienceSurvey) =>
        defaultPostQuery<AlertDataScienceSurvey>(survey, '/fps/v1/data-science-survey-alert'),
      invalidatesTags: ['DataScienceAlerts'],
      transformResponse: defaultTransformResponse
    }),
    /**
     * Machine data analysis tag history queries
     */
    getMachineDataAnalysisTags: builder.query<Tag[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/data-analysis/machine-tags/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Machine configurator queries
     */
    importConfiguredMasterTagList: builder.mutation<
      MachineMasterTag[],
      FileUpload & MachineMasterTagQueryParams
    >({
      query: (args: FileUpload & MachineMasterTagQueryParams) => {
        const { businessUnitId } = args;

        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/mh/v1/business-units/${businessUnitId}/configured-tags/import`,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['MachineMasterTags']
    }),
    sendMasTagListTableColumnData: builder.mutation<void, MasterTagListPayload | undefined>({
      query: (tagList: MasterTagListPayload) =>
        defaultPostQuery<MasterTagListPayload>(tagList, '/tl/v1/save-master-tag-list'),
      transformResponse: defaultTransformResponse,
      invalidatesTags: ['MasterTagListTag', 'MasterTagListVersion']
    }),
    getMasTagListTableColumn: builder.query<MasterTagListColumn[], string>({
      query: (edgeType: string) =>
        `/tl/v1/master-tag-list-form-format?digital_edge_type=${edgeType}`,
      transformResponse: defaultTransformResponse
    }),
    getMachineMasterTagList: builder.query<MachineMasterTag[], MachineMasterTagQueryParams>({
      query: (args: MachineMasterTagQueryParams) => {
        const { businessUnitId, ...rest } = args;
        let path = `/mh/v1/business-units/${businessUnitId}/configured-tags`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse,
      providesTags: ['MachineMasterTags']
    }),
    deleteMachineMasterTag: builder.mutation<void, MachineMasterTagDeleteParams>({
      query: ({ businessUnitId, tagId }) =>
        defaultDeleteQuery(`/mh/v1/business-units/${businessUnitId}/configured-tags/${tagId}`),
      invalidatesTags: ['MachineMasterTags'],
      transformResponse: defaultTransformResponse
    }),
    updateMachineMasterTag: builder.mutation<MachineMasterTag, MachineMasterTagUpdateParams>({
      query: (args) =>
        defaultPutQuery(
          args,
          `/mh/v1/business-units/${args.businessUnitId}/configured-tags/${args.tagId}`
        ),
      invalidatesTags: ['MachineMasterTags'],
      transformResponse: defaultTransformResponse
    }),
    getMachineTagUnitClasses: builder.query<MachineUnitClass[], void>({
      query: () => {
        return `/mh/v1/tag-unit-classes/`;
      },
      transformResponse: defaultTransformResponse,
      providesTags: ['MachineUnitClasses']
    }),
    deleteMachineTagUnitClass: builder.mutation<void, MachineUnitClass>({
      query: ({ id }) => defaultDeleteQuery(`/mh/v1/tag-unit-classes/${id}`),
      invalidatesTags: ['MachineUnitClasses'],
      transformResponse: defaultTransformResponse
    }),
    updateMachineTagUnitClass: builder.mutation<MachineUnitClass, MachineUnitClass>({
      query: (args) => defaultPutQuery(args, `/mh/v1/tag-unit-classes/${args.id}`),
      invalidatesTags: ['MachineUnitClasses', 'MachineMasterTags'],
      transformResponse: defaultTransformResponse
    }),
    createMachineTagUnitClass: builder.mutation<MachineUnitClass, MachineUnitClass>({
      query: (args) => defaultPostQuery(args, `/mh/v1/tag-unit-classes`),
      invalidatesTags: ['MachineUnitClasses', 'MachineMasterTags'],
      transformResponse: defaultTransformResponse
    }),

    /** machine upload image */
    uploadMachineImage: builder.mutation<ConfiguredAlarm[], FileUpload & MachineQueryParams>({
      query: (args: FileUpload & MachineQueryParams) => {
        const { machineId } = args;

        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/fps/v1/machines/${machineId}/assets`,
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getBusinessUnitMasterTagList: builder.query<MachineMasterTag[], MachineMasterTagQueryParams>({
      query: (args: MachineMasterTagQueryParams) => {
        const { businessUnitId } = args;
        return `/mh/v1/business-units/${businessUnitId}/configured-tags`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineConfiguratorData: builder.query<
      WidgetTableDataItem[],
      MachineConfiguratorQueryParams
    >({
      query: (args: MachineConfiguratorQueryParams) => {
        const { machineId, ...rest } = args;

        return `/mh/v1/machines/${machineId}/widgets${addArgsToPath(rest)}`;
      },
      providesTags: ['MachineConfigurator'],
      transformResponse: defaultTransformResponse
    }),
    updateMachineConfiguratorData: builder.mutation<
      WidgetTableDataItem | LineViewWidgetTableDataItem,
      MachineConfiguratorPatchQueryParams
    >({
      query: (args: MachineConfiguratorPatchQueryParams) => {
        const { machineId, widget, ...rest } = args;
        return defaultPatchQuery<WidgetTableDataItem | LineViewWidgetTableDataItem>(
          widget,
          `/mh/v1/machines/${machineId}/widgets/${widget.id}${addArgsToPath(rest)}`
        );
      },
      invalidatesTags: ['MachineConfigurator', 'MachineOverviewTags'],
      transformResponse: defaultTransformResponse
    }),
    copyMachineConfigurationData: builder.mutation<
      WidgetTableDataItem[],
      MachineConfiguratorCopyQueryParams
    >({
      query: (args: MachineConfiguratorCopyQueryParams) => {
        const { machineId, configuration, ...rest } = args;
        return defaultPutQuery<WidgetTableDataItem[]>(
          configuration,
          `/mh/v1/machines/${machineId}/widgets${addArgsToPath(rest)}`
        );
      },
      invalidatesTags: ['MachineConfigurator', 'MachineOverviewTags'],
      transformResponse: defaultTransformResponse
    }),
    getMachineWidgetData: builder.query<WidgetTableDataItem, MachineWidgetQueryParams>({
      query: (args: MachineWidgetQueryParams) => {
        const { machineId, widgetId, ...rest } = args;

        return `/mh/v1/machines/${machineId}/widgets/${widgetId}${addArgsToPath(rest)}`;
      },
      providesTags: ['MachineConfigurator'],
      transformResponse: defaultTransformResponse
    }),
    // TODO - this could be replaced with getMachineConfiguratorData since they call the same endpoint
    getConfiguredWidget: builder.query<ConfiguredWidget[], ConfiguredWidgetQueryParams>({
      query: (args: ConfiguredWidgetQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/machines/${machineId}/widgets${addArgsToPath(rest)}`;
      },
      providesTags: ['MachineConfigurator'],
      transformResponse: defaultTransformResponse
    }),

    /**
     * Thermal states queries
     */
    getThermalStatesLatest: builder.query<ThermalState[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/thermal-states-latest/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineThermalStates: builder.query<ThermalState[], MachineThermalStatesQueryParams>({
      query: (args: MachineThermalStatesQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/thermal-states/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Drive system queries
     */
    getDriveSystemStatesLatest: builder.query<StatePeriod, MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/drive-system-state/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getDriveSystemStates: builder.query<StatePeriod[], MachineDriveSystemStatesQueryParams>({
      query: (args: MachineDriveSystemStatesQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/drive-system-states/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Proseal Machine Production
     */
    getProsealProductionOverviewKpi: builder.query<
      ProsealMachineProductionKpis,
      MachineProductionKpiQueryParams
    >({
      query: ({ machineId, ...rest }: MachineProductionKpiQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId ?? ''}/kpis${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealProductionPacksPerInterval: builder.query<BaseTag, MachineProductionKpiQueryParams>({
      query: ({ machineId, ...rest }: MachineProductionKpiQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId ?? ''}/packs${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealProductionStatuses: builder.query<ProsealStatus[], MachineProductionKpiQueryParams>({
      query: ({ machineId, ...rest }: MachineProductionKpiQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId ?? ''}/statuses${addArgsToPath(
          rest
        )}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealProductionRecipes: builder.query<
      ProsealRecipeSegment[] | ProsealExcelUrl,
      MachineProductionKpiQueryParams
    >({
      query: ({ machineId, ...rest }: MachineProductionKpiQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId ?? ''}/recipes${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealRecipeStats: builder.query<ProsealRecipeStats[], MachineProductionKpiQueryParams>({
      query: ({ machineId, ...rest }: MachineProductionKpiQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId ?? ''}/recipe-stats${addArgsToPath(
          rest
        )}`;
      },
      transformResponse: defaultTransformResponse
    }),
    sendProsealMachineLiveDataHeartbeat: builder.mutation<void, { machineId: string }>({
      query: ({ machineId: machineId }) => ({
        url: `/mh/v1/proseal/machine-production/${machineId ?? ''}/live-data-heartbeat`,
        method: 'POST',
        body: {}
      }),
      transformResponse: defaultTransformResponse
    }),
    getProsealAdminRecipe: builder.query<ProsealAdminRecipe[], MachineQueryParams>({
      query: ({ machineId }: MachineQueryParams) => {
        return `/mh/v1/proseal/admin/${machineId ?? ''}/recipe`;
      },
      providesTags: ['ProsealAdminRecipe'],
      transformResponse: defaultTransformResponse
    }),
    updateProSealAdminRecipe: builder.mutation<void, UpdateProsealAdminRecipeQueryParams>({
      query: ({ recipeId, targetPacksPerMinute }) =>
        defaultPatchQuery<{ targetPacksPerMinute: number }>(
          { targetPacksPerMinute: targetPacksPerMinute },
          `/mh/v1/proseal/admin/recipe?recipe_id=${recipeId}`
        ),
      invalidatesTags: ['ProsealAdminRecipe'],
      transformResponse: defaultTransformResponse
    }),
    /**
     * Protein machine health overview queries
     */
    getMachineCleaningUtilityMetricsKpi: builder.query<
      UtilityMetrics,
      MachineCleaningStateUtilityMetricsKpiRequestParams
    >({
      query: (args: MachineCleaningStateUtilityMetricsKpiRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/utility-metrics-kpi/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineCleaningSessionsKpi: builder.query<
      CleaningSessionsKpi,
      MachineCleaningSessionsKpiRequestParams
    >({
      query: (args: MachineCleaningSessionsKpiRequestParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machine-cleaning-sessions-kpi/${machineId}`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineOverviewTags: builder.query<MachineOverviewTag[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId, ...rest } = args;
        let path = `/mh/v1/machines/${machineId}/overview-summary-tags`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse,
      providesTags: ['MachineOverviewTags']
    }),
    getMachineProductionMetrics: builder.query<MachineProductionMetrics, MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/machine-production-metrics/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getAccountInfo: builder.query<AccountInfo, MachineAccountInfoQueryParams>({
      query: (args: MachineAccountInfoQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/account-info/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    updateAccountInfo: builder.mutation<
      { bottleneck: boolean },
      { machineId: string; machineInfo: { bottleneck: boolean } }
    >({
      query: ({ machineId, machineInfo }) =>
        defaultPatchQuery<{ bottleneck: boolean }>(machineInfo, `/mh/v1/account-info/${machineId}`),
      transformResponse: defaultTransformResponse
    }),
    getMachineOverviewAlarms: builder.query<Alarm[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId, machineType } = args;
        return machineType
          ? `/mh/v1/${machineType}/machine-health/${machineId}/alarms/active`
          : `/mh/v1/machine-alarms/${machineId}/active`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineUtilization: builder.query<MachineUtilization, MachineUtilizationQueryParams>({
      query: (args: MachineUtilizationQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/machine-utilization/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineConnectionStatus: builder.query<ConnectionStatusResponse, MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/machine-connection-status/${machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getAsepticMachineHealthKpi: builder.query<
      AsepticMachineHealthKpi,
      AsepticMachineHealthKpiQueryParams
    >({
      query: (args: AsepticMachineHealthKpiQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/aseptic/machine-health/${machineId ?? ''}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getAsepticMachineHealthAlarmByLane: builder.query<
      Alarm[],
      AsepticMachineHealthAlarmsByLaneRequestParams
    >({
      query: (args: AsepticMachineHealthAlarmsByLaneRequestParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/aseptic/machine-health/${machineId ?? ''}/alarms-by-lane${addArgsToPath(
          rest
        )}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineHealthByBuKpi: builder.query<MachineHealthKpiItem[], MachineHealthKpiQueryParams>({
      query: (args: MachineHealthKpiQueryParams) => {
        const { machineId, businessUnit, ...rest } = args;
        return `/mh/v1/${businessUnit}/machine-health/${machineId ?? ''}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineStatesByBu: builder.query<StatePeriod[], MachineStateRequestParams>({
      query: (args: MachineStateRequestParams) => {
        const { machineId, businessUnit, ...rest } = args;
        let path = `/mh/v1/${businessUnit}/machine-health/${machineId}/states`;
        path = path + addArgsToPath(rest);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineHealthByProductTypeKpi: builder.query<
      MachineHealthKpiItem[],
      MachineHealthProductTypeKpiQueryParams
    >({
      query: (args: MachineHealthProductTypeKpiQueryParams) => {
        const { machineId, businessUnit, productType, ...rest } = args;
        return `/mh/v1/${businessUnit}/machine-health/${machineId ?? ''}/output/${
          productType ?? ''
        }${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),

    getTopAsepticMachineHealthChangeover: builder.query<
      AsepticChangeoverType,
      AsepticMachineHealthChangeoverTopRequestParams
    >({
      query: (args: AsepticMachineHealthChangeoverTopRequestParams) => {
        const { machineId } = args;
        return `/mh/v1/aseptic/machine-health/${machineId ?? ''}/change-over/top`;
      },
      transformResponse: defaultTransformResponse
    }),

    getTopAsepticMachineHealthChangeoverById: builder.query<
      AsepticChangeoverType,
      AsepticMachineHealthChangeoverByIdParams
    >({
      query: (args: AsepticMachineHealthChangeoverByIdParams) => {
        const { machineId, changeoverId } = args;
        return `/mh/v1/aseptic/machine-health/${machineId ?? ''}/change-over/${changeoverId ?? ''}`;
      },
      transformResponse: defaultTransformResponse
    }),

    getAsepticMachineHealthChangeoverDetails: builder.query<
      AsepticChangeoverDetailType[],
      AsepticMachineHealthChangeoverDetailsParams
    >({
      query: (args: AsepticMachineHealthChangeoverDetailsParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/aseptic/machine-health/${
          machineId ?? ''
        }/change-over-step-details${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),

    getAsepticMachineHealthChangeoverByDateRange: builder.query<
      AsepticChangeoverType[],
      AsepticMachineHealthChangeoverByDateRangeRequestParams
    >({
      query: (args: AsepticMachineHealthChangeoverByDateRangeRequestParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/aseptic/machine-health/${machineId ?? ''}/change-over${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),

    getMachineVisionKpi: builder.query<MachineVisionKpi, MachineVisionKpiQueryParams>({
      query: (args: MachineVisionKpiQueryParams) => {
        const { lineId, ...rest } = args;
        return `/mh/v1/machine-vision-kpi/${lineId ?? ''}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getKeyIndicatorsHistory: builder.query<KeyIndicatorHistory[], KeyIndicatorsHistoryQueryParams>({
      query: (args: KeyIndicatorsHistoryQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/key-indicators-history/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineStatesCategories: builder.query<StateCategory[], MachineStatesCategoriesQueryParams>({
      query: (args: MachineStatesCategoriesQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/machine-states-categories/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /**
     * Data analysis queries
     */
    getMachineTagsHistory: builder.query<BaseTag[], MachineTagsHistoryQueryParams>({
      query: (args: MachineTagsHistoryQueryParams) => {
        const { machineId, ...rest } = args;
        return `/mh/v1/machine-tags-history/${machineId}${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getTemplates: builder.query<DataAnalysisViewDetails[], MachineQueryParams>({
      query: (args: MachineQueryParams) => {
        const { machineId } = args;
        return `/mh/v1/data-analysis-view/${machineId}`;
      },
      providesTags: ['DATemplates'],
      transformResponse: defaultTransformResponse
    }),
    getTemplate: builder.query<DataAnalysisViewDetails, TemplateQueryParams>({
      query: (args: TemplateQueryParams) => {
        const { machineId, templateId } = args;
        return `/mh/v1/data-analysis-view/${machineId}/${templateId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    createTemplate: builder.mutation<
      TemplateResponse,
      { machineId: string; template: TemplateInput }
    >({
      query: ({ machineId: machineId, template: template }) =>
        defaultPostQuery<TemplateInput>(template, `/mh/v1/data-analysis-view/${machineId}`),
      invalidatesTags: ['DATemplates'],
      transformResponse: defaultTransformResponse
    }),
    deleteTemplate: builder.mutation<void, { machineId: string; templateId: string }>({
      query: ({ machineId: machineId, templateId: templateId }) =>
        defaultDeleteQuery(`/mh/v1/data-analysis-view/${machineId}/${templateId}`),
      invalidatesTags: ['DATemplates'],
      transformResponse: defaultTransformResponse
    }),
    /**
     * Site and line views
     */
    getLineStatus: builder.query<LineStatus[], SiteRouteQueryParams>({
      query: (args: SiteRouteQueryParams) => {
        const { plantId } = args;
        return `/mh/v1/plants/${plantId}/lines-status`;
      },
      transformResponse: defaultTransformResponse
    }),
    getLineInfo: builder.query<LineInfo, LineRouteQueryParams>({
      query: (args: LineRouteQueryParams) => {
        const { lineId } = args;
        return `/lines/${lineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /* Get line view assets (image) */
    getLineViewAssets: builder.query<MachineAsset[], LineViewAssetArgs>({
      query: (args: LineViewAssetArgs) => {
        const { lineId, ...rest } = args;
        return `/fps/v2/lines/${lineId}/assets${addArgsToPath(rest)}`;
      },
      providesTags: ['LineViewAssets']
    }),
    /* Line view upload assets (image) */
    uploadLineViewImage: builder.mutation<MachineAsset[], FileUpload & LineViewImageParams>({
      query: (args: FileUpload & LineViewImageParams) => {
        const { file, lineId, assetType } = args;

        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/fps/v2/lines/${lineId}/assets${addArgsToPath({ assetType })}`,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['LineViewAssets'],
      transformResponse: defaultTransformResponse
    }),
    getMachineStatus: builder.query<MachineLineStatus[], SiteRouteQueryParams>({
      query: (args: SiteRouteQueryParams) => {
        const { plantId, businessUnit } = args;
        // TODO: Versioning needs to be removed when we point to v2 on BE by default. Currently v1 will be picked up by default.
        return businessUnit
          ? `/mh/v2/plants/${plantId}/machines-status?bu=${upperCase(businessUnit)}`
          : `/mh/v1/plants/${plantId}/machines-status`;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineStatusByIds: builder.query<MachineLineStatus[], string[]>({
      query: (machineIds) => {
        const machineIdsQuery = {
          machineIds
        };
        return `/mh/v2/machines-status${addArgsToPath(machineIdsQuery)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getLineMachinesStatus: builder.query<MachineLineStatus[], LineRouteQueryParams>({
      query: (args: LineRouteQueryParams) => {
        const { lineId } = args;
        return `/mh/v1/line/${lineId}/machines-status`;
      },
      transformResponse: defaultTransformResponse
    }),
    getLineAndMachinesStatusesByLineId: builder.query<
      [LineStates, LineMachineStates[]],
      LineMachinesStatesQueryParams
    >({
      query: (args: LineMachinesStatesQueryParams) => {
        const { lineId, ...rest } = args;
        return `/mh/v2/lines/${lineId}/status${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getSalesforceAccounts: builder.query<SalesforceAccount[], string>({
      query: (name: string) => {
        return `/salesforce_account/${name}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getSalesforceMachines: builder.query<SalesforceMachine[], string>({
      query: (orgId: string) => {
        return `/salesforce_machines/${orgId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getSubcomponents: builder.query<string[], void>({
      query: () => {
        return `/fps/subcomponents`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealProductionAnalysisAllData: builder.query<
      PaginatedResults<ProsealMachineProductionAnalysisAllData>,
      ProsealMachineProductionAllDataQueryParams
    >({
      query: ({ machineId, ...remaining }: ProsealMachineProductionAllDataQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId}/all-data${addArgsToPath(remaining)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getProsealProductionAnalysisAllDataExcel: builder.query<
      ProsealExcelUrl,
      ProsealMachineProductionAllDataQueryParams
    >({
      query: ({ machineId, ...remaining }: ProsealMachineProductionAllDataQueryParams) => {
        return `/mh/v1/proseal/machine-production/${machineId}/all-data/excel${addArgsToPath(
          remaining
        )}`;
      },
      transformResponse: defaultTransformResponse
    }),
    /* Maintenance events schedule */
    getMaintenanceSchedule: builder.query<
      PaginatedMaintenanceEventGroupResults<MaintenanceSchedule>,
      MaintenanceScheduleArgs
    >({
      query: (args: MaintenanceScheduleArgs) => {
        let path = `/fps/maintenance-schedules`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      providesTags: ['MaintenanceSchedules'],
      transformResponse: defaultTransformResponse
    }),
    /* Get machine assets */
    getMachineAssets: builder.query<MachineAsset[], MachineAssetArgs>({
      query: (args: MachineAssetArgs) => {
        const { machineId, ...rest } = args;
        return `/fps/v1/machines/${machineId}/assets${addArgsToPath(rest)}`;
      }
    }),
    getProsealDowntime: builder.query<DowntimeRow[] | ProsealExcelUrl, ProsealDowntimeQueryParams>({
      query: ({ machineId, ...rest }: ProsealDowntimeQueryParams) => {
        return `/mh/v1/proseal/machine-production/{${machineId}/downtime${addArgsToPath(rest)}`;
      },
      transformResponse: defaultTransformResponse
    }),

    /* Maintenance event groups */
    getMaintenanceEventGroups: builder.query<MaintenanceEventGroup[], void>({
      query: () => {
        return `/maintenance-event-groups`;
      },
      providesTags: ['MaintenanceSchedules'],
      transformResponse: defaultTransformResponse
    }),
    getBusinessUnits: builder.query<BusinessUnit[], void>({
      query: () => {
        return '/business-units';
      },
      transformResponse: defaultTransformResponse
    }),
    getHelpPageContacts: builder.query<PlantBuContacts[], void>({
      query: () => {
        return `/help-page-contacts`;
      },
      transformResponse: defaultTransformResponse
    }),
    getOnboardingMachines: builder.query<OnboardingMachine[], void>({
      query: () => {
        return `/on/v1/machine-onboarding`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    getOnboardingMachineById: builder.query<OnboardingMachine, OnboardingMachineParams>({
      query: (args: OnboardingMachineParams) => {
        return `/on/v1/machine-onboarding/${args.machineId}`;
      },
      providesTags: ['MachineOnboardingByIdTag'],
      transformResponse: defaultTransformResponse
    }),

    getAccountSalesforce: builder.query<AccountSalesforce[], AccountSalesforceArgs>({
      query: (args: AccountSalesforceArgs) => {
        let path = `/sf/v1/customers`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getAssetSalesforce: builder.query<AssetSalesforce[], AssetSalesforceArgs>({
      query: (args: AssetSalesforceArgs) => {
        let path = `/sf/v1/assets`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMachineTypes: builder.query<MachineType[], void>({
      query: () => {
        return `/on/v1/machine-type`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    getTimeZones: builder.query<string[], void>({
      query: () => {
        return `/on/v1/timezone`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    updateMachineOnboardingStatus: builder.mutation<void, Partial<MachineOnboardingStatusInput>>({
      query: (args) => defaultPutQuery(args, `/on/v1/machine-onboarding-status`),
      invalidatesTags: ['MachineOnboardingTags', 'MachineOnboardingByIdTag'],
      transformResponse: defaultTransformResponse
    }),
    uploadDiagram: builder.mutation<void, FileUpload & MachineOnboardingDiagramParams>({
      query: (args: FileUpload & MachineOnboardingDiagramParams) => {
        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/dg/v1/manual-digitization?machine_id=${args.machineId}&salesforce_machine_id=${
            args.salesforceMachineId
          }&business_unit_id=${args.businessUnit.toString()}`,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    uploadMaintenanceSchedule: builder.mutation<
      UploadMaintenanceScheduleResponse,
      MachineOnboardingMaintenanceScheduleParams
    >({
      query: (args: MachineOnboardingMaintenanceScheduleParams) => {
        return {
          url: `/fps/v1/maintenance-schedule-import-from-rows/${args.machineId}`,
          method: 'POST',
          body: snakeCaseKeysDeep(args.maintenceScheduleImportRows as BaseType[])
        };
      },
      transformResponse: defaultTransformResponse
    }),
    validateUploadMaintenanceSchedule: builder.mutation<
      MaintenceScheduleImportRow[],
      MachineOnboardingMaintenanceScheduleParams
    >({
      query: (args: MachineOnboardingMaintenanceScheduleParams) => {
        return {
          url: `/fps/v1/validate-maintenance-schedule-import-from-rows/${args.machineId}`,
          method: 'POST',
          body: args
        };
      },
      transformResponse: defaultTransformResponse
    }),
    validateUploadMaintenanceScheduleExcel: builder.mutation<
      MaintenceScheduleImportRow[],
      FileUpload & MachineOnboardingMaintenanceScheduleParams
    >({
      query: (args: FileUpload & MachineOnboardingMaintenanceScheduleParams) => {
        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/fps/v1/validate-maintenance-schedule-import/${args.machineId}?skip_header=${
            args.skipHeader || true
          }`,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    saveMachineOnboarding: builder.mutation<SaveOnboardingMachine, SaveOnboardingMachine>({
      query: (args: SaveOnboardingMachine) => {
        return {
          url: `/on/v1/machine-onboarding`,
          method: 'POST',
          body: args
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getPartHierarchy: builder.query<PartHierarchy, PartHierarchyArgs>({
      query: (args: PartHierarchyArgs) => {
        let path = `/dg/v1/part_hierarchy`;
        path = path + addArgsToPath(args as BaseType);
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getMaintenanceExcelTemplate: builder.query<string, void>({
      query: () => {
        return `/fps/v1/maintenance-schedule-template`;
      },
      transformResponse: defaultTransformResponse
    }),

    getDiagramNoErp: builder.query<DataQualityInImage[], PartHierarchyArgs>({
      query: (args: PartHierarchyArgs) => {
        let path = `/dg/v1/dq-in-diagram-no-erp/`;
        path = path + args.machineId;
        return path;
      },
      transformResponse: defaultTransformResponse
    }),

    getDiagramZeroPrice: builder.query<DataQualityInImage[], PartHierarchyArgs>({
      query: (args: PartHierarchyArgs) => {
        let path = `/dg/v1/dq-zero-price/`;
        path = path + args.machineId;
        return path;
      },
      transformResponse: defaultTransformResponse
    }),

    getDiagramNoImage: builder.query<DataQualityInImage[], PartHierarchyArgs>({
      query: (args: PartHierarchyArgs) => {
        let path = `/dg/v1/dq-in-diagram-no-image/`;
        path = path + args.machineId;
        return path;
      },
      transformResponse: defaultTransformResponse
    }),
    getPartsInBomNotLinkedToERP: builder.query<PartNode[], string>({
      query: (machineId: string) => {
        return `/dg/v1/parts-with-no-children/${machineId}`;
      },
      providesTags: ['PartsNotInErpTag'],
      transformResponse: defaultTransformResponse
    }),
    getPartsInAssemblyNotLinkedToERP: builder.query<PartNodeExtension[], string>({
      query: (machineId: string) => {
        return `/dg/v1/parts-not-in-erp/${machineId}`;
      },
      providesTags: ['PartsNotInErpTag'],
      transformResponse: defaultTransformResponse
    }),
    updateModifiedPartsNumber: builder.mutation<
      void,
      { machineId: string; modifiedParts: PartUpdate[] }
    >({
      query: ({ machineId, modifiedParts }) =>
        defaultPatchQueryNoSkakeCase<PartUpdate[]>(
          modifiedParts,
          `/dg/v1/update-part-number/${machineId}`
        ),
      invalidatesTags: ['PartsNotInErpTag', 'BubbleEditsTag'],
      transformResponse: defaultTransformResponse
    }),
    getProductTagTemplate: builder.query<string, void>({
      query: () => {
        return `/fps/v1/product-tag-template`;
      },
      transformResponse: defaultTransformResponse
    }),
    uploadProductsPart: builder.mutation<void, FileUpload & ProductsPartsUploadParams>({
      query: (args: FileUpload & ProductsPartsUploadParams) => {
        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/fps/v1/product-category-import?machine_id=${
            args.machineId
          }&skip_header=${args.skipHeader.toString()}`,
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getMasterTagList: builder.query<MasterTagList[], void>({
      query: () => {
        return `/tl/v1/master-tag-list`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getMasterTagListMappings: builder.query<MasterTagList[], MasterTagListMappingArgs>({
      query: (machineId: MasterTagListMappingArgs) => {
        return `/tl/v1/master-tag-list-mappings${addArgsToPath(machineId)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    uploadPhotoPart: builder.mutation<
      PartsPhotoUploadResponse | void,
      MultipleFileUpload & PartsPhotoUploadParams
    >({
      query: (args: MultipleFileUpload & PartsPhotoUploadParams) => {
        const formData = new FormData();
        for (let i = 0; i < args.files.length; i++) {
          formData.append('files', args.files[i]);
        }
        return {
          url: `/fps/v1/part-photo-import?business_unit=${args.businessUnit}`,
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getPartsWithoutBubbles: builder.query<PartNode[], PartHierarchyArgs>({
      query: ({ machineId }) => {
        return `/dg/v1/parts-with-no-bubbles/${machineId}`;
      },
      providesTags: ['EditableBubblesTag'],
      transformResponse: defaultTransformResponse
    }),
    // Endpoint for machine onboarding clickable diagrams
    getMachineOnboardingPartsByIds: builder.query<Part[], PartsByIdsArgs>({
      query: (args: PartsByIdsArgs) => {
        const otherArgs: PartsByIdsArgs = {
          subParts: args.subParts,
          flagAssemblies: args.flagAssemblies,
          includeResources: args.includeResources,
          onlyImages: args.onlyImages,
          machineId: args.machineId,
          sku: args.sku,
          businessUnitId: args.businessUnitId
        };
        return {
          url: '/dg/v1/parts' + addArgsToPath(otherArgs),
          method: 'POST',
          body: args.uuids
        };
      },
      providesTags: ['EditableBubblesTag'],
      transformResponse: defaultTransformResponse
    }),
    updateBubble: builder.mutation<void, UpdateBubbleArgs>({
      query: (bubbleChanges: UpdateBubbleArgs) =>
        defaultPutQuery<UpdateBubbleArgs>(bubbleChanges, '/dg/v1/update-bubble'),
      invalidatesTags: ['EditableBubblesTag', 'BubbleEditsTag'],
      transformResponse: defaultTransformResponse
    }),
    addBubble: builder.mutation<CreateBubbleArgs, CreateBubbleArgs>({
      query: (bubbleData: CreateBubbleArgs) =>
        defaultPostQuery<CreateBubbleArgs>(bubbleData, '/dg/v1/add-bubble'),
      invalidatesTags: ['EditableBubblesTag', 'BubbleEditsTag'],
      transformResponse: defaultTransformResponse
    }),
    deleteMasterTagListVersion: builder.mutation<void, DeleteMasterTagListVersionParams>({
      query: (args: DeleteMasterTagListVersionParams) => {
        return defaultDeleteQuery<DeleteMasterTagListVersionParams>(
          `/tl/v1/master-tag-list-version${addArgsToPath(args)}`
        );
      },
      invalidatesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getMachineModels: builder.query<MachineModel[], string>({
      query: (machine_type_code: string) => {
        return `/tl/v1/machine-models?machine_type_code=${machine_type_code}`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    createMachineConfigJSONFile: builder.mutation<JSON, MachineConfigParams>({
      query: (args: MachineConfigParams) =>
        defaultPostQuery<MachineConfigParams>(
          args,
          `/tl/v1/create_machine_config_json?machine_id=${args.machineId}&push_to_gateway=${args.pushToGateway}`
        ),
      // This endpoint updates calles the onboarding service directly,
      // so force a refetch of onboarding machines
      invalidatesTags: ['MachineOnboardingTags', 'MachineOnboardingByIdTag'],
      transformResponse: defaultTransformResponse
    }),
    // Alert Configs
    createAlertConfig: builder.mutation<AlertConfig, AlertConfig>({
      query: (alert: AlertConfig) =>
        defaultPostQuery<AlertConfig>(alert, '/mh/v2/machine-alert-configurations'),
      invalidatesTags: ['AlertConfigs'],
      transformResponse: defaultTransformResponse
    }),
    updateAlertConfig: builder.mutation<AlertConfig, AlertConfig>({
      query: (alert: AlertConfig) =>
        defaultPutQuery<AlertConfig>(alert, `/mh/v2/machine-alert-configurations/${alert.id}`),
      invalidatesTags: ['AlertConfigs'],
      transformResponse: defaultTransformResponse
    }),
    patchAlertConfig: builder.mutation<
      AlertConfig,
      {
        alert: AlertConfig;
        alertId: string;
      }
    >({
      // Accepts a partial alert config
      // BE will merge the partial alert config with the existing alert config
      // our use case for delete is { alert: { expunge: true }, alertId: 'someId'}
      query: ({ alert, alertId }: { alert: AlertConfig; alertId: string }) =>
        defaultPatchQuery<AlertConfig>(alert, `/mh/v2/machine-alert-configurations/${alertId}`),
      invalidatesTags: ['AlertConfigs'],
      transformResponse: defaultTransformResponse
    }),
    getAlertConfigsByMachineId: builder.query<AlertConfig[], AlertConfigQueryParams>({
      query: (params: AlertConfigQueryParams) =>
        `/mh/v2/machine-alert-configurations${addArgsToPath(params)}`,
      providesTags: ['AlertConfigs'],
      transformResponse: defaultTransformResponse
    }),
    getAlertConfigById: builder.query<AlertConfig, string>({
      query: (alertId: string) => `/mh/v2/machine-alert-configurations/${alertId}`
    }),
    // Alerts
    getAlertsByMachineId: builder.query<MachineAlert[], MachineAlertQueryParams>({
      query: (args: AlertQueryParams) => {
        const { machineId, ...params } = args;
        // must provide active if not sending startDatetime and endDatetime
        return `/mh/v2/machine/${machineId}/machine-alerts${addArgsToPath(params)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getUserManagement: builder.query<PaginatedResults<Group>, UserManagementGroupsParams>({
      query: (args: UserManagementGroupsParams) => {
        let path = `/usr/v1/${args.type}s`;
        path = path + addArgsToPath(args);
        return path;
      },
      providesTags: ['Groups', 'Users'],
      transformResponse: defaultTransformResponse
    }),
    getUserManagementGroupById: builder.query<GroupItem, string>({
      query: (id: string) => `/usr/v1/group?group_id=${id ?? ''}`,
      providesTags: ['Groups'],
      transformResponse: defaultTransformResponse
    }),
    addEditGroupUserManagement: builder.mutation<GroupItem, GroupItem>({
      query: (group: GroupItem) => defaultPostQuery<GroupItem>(group, `/usr/v1/group`),
      invalidatesTags: ['Groups', 'Users'],
      transformResponse: defaultTransformResponse
    }),
    deleteGroupUserManagement: builder.mutation<void, { groupId: Id }>({
      query: ({ groupId: groupId }) => defaultDeleteQuery(`usr/v1/group?group_id=${groupId}`),
      invalidatesTags: ['Groups', 'Users'],
      transformResponse: defaultTransformResponse
    }),
    getUserManagementPermissions: builder.query<UserManagementPermission[], void>({
      query: () => {
        return `/usr/v1/permissions`;
      },
      transformResponse: defaultTransformResponse
    }),
    validateUserEmailAvailable: builder.mutation<void, ValidateUserEmailAvailableParams>({
      query: (args: ValidateUserEmailAvailableParams) => {
        let url = `/usr/v1/validate-email?email=${args.email}`;
        if (args.userId) url += `&user_id=${args.userId}`;
        return {
          url,
          method: 'GET'
        };
      },
      transformResponse: defaultTransformResponse
    }),
    saveUsers: builder.mutation<UserItem[], UserItem[]>({
      query: (users: UserItem[]) => defaultPostQuery<UserItem[]>(users, `/usr/v1/user`),
      invalidatesTags: ['Users', 'Groups'],
      transformResponse: defaultTransformResponse
    }),
    deleteUser: builder.mutation<void, { userId: Id }>({
      query: ({ userId: userId }) => defaultDeleteQuery(`/usr/v1/user?user_id=${userId}`),
      invalidatesTags: ['Users', 'Groups'],
      transformResponse: defaultTransformResponse
    }),
    getReviewMachineAllMasterMachineTagLists: builder.query<
      ReviewMachineMtlData,
      ReviewMachineMtlQueryParams
    >({
      query: (args: ReviewMachineMtlQueryParams) =>
        `/tl/v1/review-all-master-machine-tag-lists?machine_id=${args.machineId}`,
      providesTags: ['ReviewMachineMtlTag'],
      transformResponse: defaultTransformResponse
    }),
    saveReviewMachineMtlKdm: builder.mutation<void, ReviewMachineMtlRequest | undefined>({
      query: (reviewMachineMtlRequest: ReviewMachineMtlRequest) =>
        defaultPostQuery<ReviewMachineMtlRequest>(
          reviewMachineMtlRequest,
          '/tl/v1/save-review-machine-tag-lists-kdm'
        ),
      transformResponse: defaultTransformResponse,
      invalidatesTags: ['ReviewMachineMtlTag']
    }),
    saveReviewMachineMtlDsdm: builder.mutation<void, ReviewMachineMtlRequest | undefined>({
      query: (reviewMachineMtlRequest: ReviewMachineMtlRequest) =>
        defaultPostQuery<ReviewMachineMtlRequest>(
          reviewMachineMtlRequest,
          '/tl/v1/save-review-machine-tag-lists-dsdm'
        ),
      transformResponse: defaultTransformResponse,
      invalidatesTags: ['ReviewMachineMtlTag']
    }),
    saveReviewMachineMtlMqtt: builder.mutation<void, ReviewMachineMtlRequest | undefined>({
      query: (reviewMachineMtlRequest: ReviewMachineMtlRequest) =>
        defaultPostQuery<ReviewMachineMtlRequest>(
          reviewMachineMtlRequest,
          '/tl/v1/save-review-machine-tag-lists-mqtt'
        ),
      transformResponse: defaultTransformResponse,
      invalidatesTags: ['ReviewMachineMtlTag']
    }),
    getTagListVersionsByMtlId: builder.query<MasterTagListVersion[], string>({
      query: (masterTagListId: string) =>
        `/tl/v1/master-tag-list-versions-by-mtl-id?master_tag_list_id=${masterTagListId}`,
      transformResponse: defaultTransformResponse
    }),
    getMasterTagListTemplate: builder.query<string, string>({
      query: (edgeType: DigitalEdgeType) =>
        `/tl/v1/master-tag-list-template?digital_edge_type=${edgeType}`,
      transformResponse: defaultTransformResponse
    }),
    validateMasterTagListImport: builder.mutation<
      MtlAttrDsdmWithError[] | MtlAttrKdmWithError[] | MtlAttrMqttWithError[],
      MasterTagListImportParams
    >({
      query: (args: MasterTagListImportParams) => {
        const { digitalEdgeType, file, skipHeader } = args;

        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/tl/v1/validate-master-tag-list-import${addArgsToPath({
            digitalEdgeType: digitalEdgeType,
            skipHeader: skipHeader !== undefined ? skipHeader : true
          })}`,
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    saveMappingMasterTagList: builder.mutation<void, MasterTagListMappingPayload>({
      query: (args: MasterTagListMappingPayload) =>
        defaultPostQuery<MasterTagListMappingPayload>(args, '/tl/v1/save-machine-mtl-mapping'),
      // This endpoint updates calles the onboarding service directly,
      // so force a refetch of onboarding machines
      invalidatesTags: ['MachineOnboardingTags', 'MachineOnboardingByIdTag'],
      transformResponse: defaultTransformResponse
    }),
    getMasterTagListVersionById: builder.query<MasterTagListWrapped, MasterTagListVersionParams>({
      query: (args: MasterTagListVersionParams) => {
        return `/tl/v1/master-tag-list-by-version-id${addArgsToPath(args)}`;
      },
      providesTags: ['MasterTagListVersion'],
      transformResponse: defaultTransformResponse
    }),
    getProvisionGateways: builder.query<string[], void>({
      query: () => {
        return `/on/v1/machine-provision-gateway-mac-ids`;
      },
      transformResponse: defaultTransformResponse
    }),
    updateProvisionGateway: builder.mutation<void, UpdateProvisionGatewayArgs>({
      query: (args) => {
        return defaultPostQuery(
          args,
          `/on/v1/save-machine-provision-gateway${addArgsToPath(args)}`
        );
      },
      invalidatesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    getUnmappedMasterTagList: builder.query<UnmappedMasterTagListType, MasterTagListMappingArgs>({
      query: (machineId: MasterTagListMappingArgs) => {
        return `/tl/v1/unmapped-master-tag-lists${addArgsToPath(machineId)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getManualUnmappedMasterTagList: builder.query<
      UnmappedMasterTagListType,
      MasterTagListMappingArgs
    >({
      query: (args: MasterTagListMappingArgs) => {
        const { ...params } = args;
        return `/tl/v1/unmapped-master-tag-lists${addArgsToPath(params)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getUnmappedCustomMasterTagList: builder.query<
      UnmappedMasterTagListType,
      MasterTagListMappingArgs
    >({
      query: (machineId: MasterTagListMappingArgs) => {
        return `/tl/v1/unmapped-custom_master-tag-lists${addArgsToPath(machineId)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getImportedMachineTagList: builder.query<ImportedMachineTagList, MasterTagListMappingArgs>({
      query: (args: MasterTagListMappingArgs) => {
        return `/tl/v1/imported-machine-tag-lists${addArgsToPath(args)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getDrivers: builder.query<Driver[], void>({
      query: () => {
        return `/tl/v1/driver`;
      },
      transformResponse: defaultTransformResponse
    }),
    getDeviceTypes: builder.query<DeviceType[], DeviceTypesArgs>({
      query: (args) => {
        return `/tl/v1/device_type${addArgsToPath(args)}`;
      },
      transformResponse: defaultTransformResponse
    }),
    importMachineTagListExcel: builder.mutation<string, FileUpload & ImportMachineTagListParams>({
      query: (args: FileUpload & ImportMachineTagListParams) => {
        const formData = new FormData();
        formData.append('file', args.file);
        return {
          url: `/tl/v1/machine-tag-list-import-${args.digitalEdgeType.toLocaleLowerCase()}${addArgsToPath(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (({ file, digitalEdgeType, ...o }) => o)(args)
          )}`,
          method: 'POST',
          body: formData
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getUnmappedMachineTagList: builder.query<UnmappedMachineTagList, MachineTagListMappingArgs>({
      query: (machineId: MachineTagListMappingArgs) => {
        return `/tl/v1/unmapped-machine-tag-lists${addArgsToPath(machineId)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),

    getManualUnmappedMachineTagList: builder.query<
      UnmappedMachineTagList,
      MachineTagListMappingArgs
    >({
      query: (args: MachineTagListMappingArgs) => {
        const { ...params } = args;
        return `/tl/v1/unmapped-machine-tag-lists${addArgsToPath(params)}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),

    saveMasterToMachineMapping: builder.mutation<void, MasterToMachineMappingPayload>({
      query: (args: MasterToMachineMappingPayload) =>
        defaultPostQuery<MasterToMachineMappingPayload>(args, '/tl/v1/map-master-to-machine'),
      transformResponse: defaultTransformResponse
    }),
    // Machine Management

    sendReviewAndPublishMachineData: builder.mutation<
      void,
      { status_diagram: boolean; status_maintenance_schedule: boolean; machine_id: string }
    >({
      query: ({ machine_id, status_diagram, status_maintenance_schedule }) => ({
        url: `/on/v1/submit-to-fps${addArgsToPath({
          machine_id: machine_id,
          submit_diagram: status_diagram,
          submit_maintenance_schedule: status_maintenance_schedule
        })})`,
        method: 'POST',
        body: {}
      }),
      transformResponse: defaultTransformResponse
    }),
    getMachineTagListTemplate: builder.query<string, string>({
      query: (edgeType: DigitalEdgeType) =>
        `/tl/v1/machine-tag-list-template?digital_edge_type=${edgeType}`,
      transformResponse: defaultTransformResponse
    }),
    deleteMachineTagList: builder.mutation<void, DeleteMachineTagListParams>({
      query: (args: DeleteMachineTagListParams) => {
        return defaultDeleteQuery<DeleteMachineTagListParams>(
          `/tl/v1/imported-machine-tag-list${addArgsToPath(args)}`
        );
      },
      transformResponse: defaultTransformResponse
    }),
    updateMachineToMasterMapping: builder.mutation<void, MachineToMasterMappingParams>({
      query: (args) =>
        defaultPutQuery(
          args,
          `/on/v1/machine-to-master-mapping?machine_id=${
            args.machineId
          }&machine_to_master_mapping=${args.machineToMasterMapping ? 'true' : 'false'}`
        ),
      invalidatesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getBubbleEditsForMachine: builder.query<EditedBubbleRecord[], { machineId: string }>({
      query: (args: { machineId: string }) => {
        return `/dg/v1/bubble_edits?machine_id=${args.machineId}`;
      },
      providesTags: ['BubbleEditsTag'],
      transformResponse: defaultTransformResponse
    }),
    deleteCustomMasterTagList: builder.mutation<void, DeleteCustomMasterTagsParams>({
      query: (args) => {
        return {
          url: `/tl/v1/custom-master-tag-list-attributes?machine_id=${args.machineId}`,
          method: 'DELETE',
          body: args.customTagIds
        };
      },
      transformResponse: defaultTransformResponse
    }),
    getMachinesByMasterTagListId: builder.query<OnboardingMachine[], { masterTagListId: string }>({
      query: (args: { masterTagListId: string }) => {
        return `/tl/v1/master-tag-list/${args.masterTagListId}/machines-onboarding`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    getSalesforceMachineById: builder.query<Machine, { machineId: string }>({
      query: (args: { machineId: string }) => {
        return `/fps/v1/check-machine/${args.machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getKeepwareFile: builder.query<Machine, { machineId: string }>({
      query: (args: { machineId: string }) => {
        return `/tl/v1/get_machine_config_json?machine_id=${args.machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getPowerBiDataById: builder.query<CreatePowerBiMachineData[], { machineId: string }>({
      query: (args: { machineId: string }) => {
        const path = `/mh/v1/machine_power_bi/${args.machineId}/`;
        return path;
      },
      providesTags: ['PowerBiData'],
      transformResponse: defaultTransformResponse
    }),
    createPowerBiData: builder.mutation<CreatePowerBiMachineData, CreatePowerBiMachineData>({
      query: (args: CreatePowerBiMachineData) => ({
        url: `/mh/v1/machine-power-bi/`,
        method: 'POST',
        body: snakeCaseKeysDeep(args)
      }),
      invalidatesTags: ['PowerBiData'],
      transformResponse: defaultTransformResponse
    }),
    updatePowerBiData: builder.mutation<CreatePowerBiMachineData, CreatePowerBiMachineData>({
      query: (args: CreatePowerBiMachineData) => ({
        url: `/mh/v1/machine_power_bi/${args.machineID}/${args.workspaceID}/${args.reportID}/`,
        method: 'PATCH',
        body: snakeCaseKeysDeep(args)
      }),
      invalidatesTags: ['PowerBiData'],
      transformResponse: defaultTransformResponse
    }),
    deletePowerBiData: builder.mutation<CreatePowerBiMachineData, CreatePowerBiMachineData>({
      query: (args: CreatePowerBiMachineData) => ({
        url: `mh/v1/machine_power_bi/${args.machineID}/${args.workspaceID}/${args.reportID}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PowerBiData'],
      transformResponse: defaultTransformResponse
    }),
    getIsMachineOnboarded: builder.query<
      { machineOnboard: string | boolean },
      { id: string | boolean }
    >({
      query: (args: { id: string | boolean }) => {
        return `/on/v1/check-onboarding?salesforceid=${args.id}`;
      },
      providesTags: ['MachineOnboardingTags'],
      transformResponse: defaultTransformResponse
    }),
    getMachineTagListBasedOnId: builder.query<MasterTagListArgs[], { id: string }>({
      query: (args: { id: string }) => {
        return `tl/v1/master-tag-list?machine_id=${args.id}`;
      },
      providesTags: ['MasterTagListTag'],
      transformResponse: defaultTransformResponse
    }),
    getAlertEnums: builder.query<AlertEnumTypes, void>({
      query: () => {
        return 'mh/v2/types/alerts';
      },
      transformResponse: defaultTransformResponse
    }),
    getAlerts: builder.query<IGetAlerts[], { machineId: string }>({
      query: (args: { machineId: string }) => {
        return `/mh/v2/machines/${args.machineId}/alerts`;
      },
      providesTags: ['MachineAlertsTag'],
      transformResponse: defaultTransformResponse
    }),
    deleteAlert: builder.mutation<void, IDeleteAlert>({
      query: (args: IDeleteAlert) => defaultDeleteQuery(`/mh/v2/alerts/${args.alertId}`),
      invalidatesTags: ['MachineAlertsTag'],
      transformResponse: defaultTransformResponse
    }),
    saveAlert: builder.mutation<void, SaveAlertPayload>({
      query: (args: SaveAlertPayload) =>
        defaultPostQuery(args.data, `/mh/v2/machines/${args.machineId}/alerts`),
      invalidatesTags: ['MachineAlertsTag'],
      transformResponse: defaultTransformResponse
    }),
    getAlertStatementTags: builder.query<AlertStatementTag[], { machineId: string }>({
      query: (args: { machineId: string }) => {
        return `mh/v1/machine-tags/${args.machineId}`;
      },
      transformResponse: defaultTransformResponse
    }),
    getAlertById: builder.query<IGetAlerts, { alertId: string }>({
      query: (args: { alertId: string }) => {
        return `/mh/v2/alerts/${args.alertId}`;
      },
      providesTags: ['MachineAlertsTag'],
      transformResponse: defaultTransformResponse
    }),
    updateAlertById: builder.mutation<void, TAlertData>({
      query: (alert: TAlertData) => defaultPutQuery<TAlertData>(alert, `/mh/v2/alerts/${alert.id}`),
      invalidatesTags: ['MachineAlertsTag'],
      transformResponse: defaultTransformResponse
    })
  })
});

export const {
  useGetAsepticMachineHealthKpiQuery,
  useGetAsepticMachineHealthAlarmByLaneQuery,
  useGetTopAsepticMachineHealthChangeoverQuery,
  useGetTopAsepticMachineHealthChangeoverByIdQuery,
  useGetAsepticMachineHealthChangeoverDetailsQuery,
  useGetAsepticMachineHealthChangeoverByDateRangeQuery,
  useGetOrganizationByIdQuery,
  useGetOrganizationsQuery,
  useGetPlantsQuery,
  useGetPlantByIdQuery,
  useGetLanguagesQuery,
  useGetOrdersQuery,
  useGetOrderMachinesQuery,
  useGetLinesQuery,
  useGetMachineByIdQuery,
  useGetMachinePressureQuery,
  useGetPartsByMachineIdQuery,
  useGetFilteredOnStockPartsQuery,
  useGetPartsByIdsMutation,
  useGetPartByIdQuery,
  useGetProductsByMachineIdQuery,
  useGetMachinesQuery,
  useValidateTokenQuery,
  useGetUserQuery,
  useGetUserByIdQuery,
  useCreateOrderMutation,
  useDraftOrderQuoteMutation,
  useConfirmOrderMutation,
  useAddProductToCartMutation,
  useUpdateCartProductMutation,
  useDeleteCartProductsMutation,
  useGetCartProductsQuery,
  useGetMachineHealthByBuKpiQuery,
  useGetMachineStatesByBuQuery,
  useGetMachineHealthByProductTypeKpiQuery,
  useGetMachineHealthByIdQuery,
  useGetMachineHealthByIdsQuery,
  useGetPressurizeCycleDataByIdQuery,
  useGetPressurizeStateDataByIdQuery,
  useSavedProductMutation,
  useGetSavedProductsQuery,
  useDeleteSavedProductMutation,
  useGetMaintenanceEventsQuery,
  useCreateMaintenanceEventsMutation,
  useUpdateMaintenanceEventsMutation,
  useCreateDataScienceSurveyMutation,
  useGetDataScienceSurveyQuery,
  useCreateHelpEmailMutation,
  useMapMasterMatchingTagsMutation,
  useClearRecentlyCompletedMaintenanceSchedulesMutation,
  useDownloadSelectedPlannedMaintenanceEventsMutation,
  useGetPowerBiTokenQuery,
  useSearchQuery,
  useGetMachineCleaningSessionsQuery,
  useGetMachineCleaningSessionDetailsQuery,
  useGetMachineCleaningStatesQuery,
  useGetMachineAlarmsQuery,
  useGetAvureAlarmsQuery,
  useGetDSIAlarmsQuery,
  useGetMachineConfiguredAlarmsQuery,
  useImportConfiguredAlarmsMutation,
  useGetProsealProductionOverviewKpiQuery,
  useGetProsealProductionPacksPerIntervalQuery,
  useGetProsealProductionStatusesQuery,
  useGetProsealProductionRecipesQuery,
  useLazyGetProsealProductionRecipesQuery,
  useGetProsealRecipeStatsQuery,
  useSendProsealMachineLiveDataHeartbeatMutation,
  useGetProsealAdminRecipeQuery,
  useUpdateProSealAdminRecipeMutation,
  useGetMachineCleaningUtilityMetricsKpiQuery,
  useGetMachineCleaningSessionsKpiQuery,
  useGetMachineOverviewTagsQuery,
  useGetMachineDataAnalysisTagsQuery,
  useGetMachineLastCleaningSessionQuery,
  useGetMachineProductionMetricsQuery,
  useGetAccountInfoQuery,
  useUpdateAccountInfoMutation,
  useGetMachineOverviewAlarmsQuery,
  useGetMachineUtilizationQuery,
  useGetMachineThermalStatesQuery,
  useGetMachineConnectionStatusQuery,
  useGetMachineVisionKpiQuery,
  useGetThermalStatesLatestQuery,
  useGetKeyIndicatorsHistoryQuery,
  useGetDriveSystemStatesLatestQuery,
  useGetDriveSystemStatesQuery,
  useGetMachineStatesCategoriesQuery,
  useGetMachineTagsHistoryQuery,
  useGetProductByIdQuery,
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useDeleteTemplateMutation,
  useGetProductsQuery,
  useGetProductTagsQuery,
  useCreateTemplateMutation,
  useGetLineStatusQuery,
  useGetLineInfoQuery,
  useGetMachineStatusQuery,
  useGetMachineDataScienceAlertsQuery,
  useCreateDataScienceAlertSurveyMutation,
  useGetDataScienceAlertDetailsQuery,
  useGetLineMachinesStatusQuery,
  useGetSalesforceAccountsQuery,
  useGetSalesforceMachinesQuery,
  useGetSubcomponentsQuery,
  useGetProsealProductionAnalysisAllDataQuery,
  useLazyGetProsealProductionAnalysisAllDataExcelQuery,
  useGetMaintenanceScheduleQuery,
  useGetMaintenanceEventGroupsQuery,
  useGetProsealDowntimeQuery,
  useLazyGetProsealDowntimeQuery,
  useUploadMachineImageMutation,
  useGetMachineAssetsQuery,
  useGetMachineConfiguratorDataQuery,
  useCopyMachineConfigurationDataMutation,
  useUpdateMachineConfiguratorDataMutation,
  useGetBusinessUnitMasterTagListQuery,
  useGetMachineWidgetDataQuery,
  useGetConfiguredWidgetQuery,
  useGetMachineTagUnitClassesQuery,
  useDeleteMachineMasterTagMutation,
  useUpdateMachineMasterTagMutation,
  useDeleteMachineTagUnitClassMutation,
  useUpdateMachineTagUnitClassMutation,
  useCreateMachineTagUnitClassMutation,
  useImportConfiguredMasterTagListMutation,
  useSendMasTagListTableColumnDataMutation,
  useGetMasTagListTableColumnQuery,
  useGetMachineMasterTagListQuery,
  useGetMachinesCurrentRunMetricQuery,
  useGetMachineStatusByIdsQuery,
  useGetBusinessUnitsQuery,
  useGetHelpPageContactsQuery,
  useUploadLineViewImageMutation,
  useGetLineViewAssetsQuery,
  useGetOnboardingMachinesQuery,
  useGetOnboardingMachineByIdQuery,
  useGetAccountSalesforceQuery,
  useGetAssetSalesforceQuery,
  useGetMachineTypesQuery,
  useGetTimeZonesQuery,
  useUpdateMachineOnboardingStatusMutation,
  useUploadDiagramMutation,
  useUploadMaintenanceScheduleMutation,
  useValidateUploadMaintenanceScheduleMutation,
  useValidateUploadMaintenanceScheduleExcelMutation,
  useSaveMachineOnboardingMutation,
  useGetLineAndMachinesStatusesByLineIdQuery,
  useGetPartHierarchyQuery,
  useLazyGetMaintenanceExcelTemplateQuery,
  useGetDiagramNoErpQuery,
  useGetDiagramZeroPriceQuery,
  useGetDiagramNoImageQuery,
  useGetPartsInBomNotLinkedToERPQuery,
  useGetPartsInAssemblyNotLinkedToERPQuery,
  useUpdateModifiedPartsNumberMutation,
  useLazyGetProductTagTemplateQuery,
  useUploadProductsPartMutation,
  useGetMasterTagListQuery,
  useGetMasterTagListMappingsQuery,
  useCreateAlertConfigMutation,
  useGetAlertConfigsByMachineIdQuery,
  useUpdateAlertConfigMutation,
  usePatchAlertConfigMutation,
  useUploadPhotoPartMutation,
  useGetPartsWithoutBubblesQuery,
  useUpdateBubbleMutation,
  useAddBubbleMutation,
  useDeleteMasterTagListVersionMutation,
  useLazyGetMachineOnboardingPartsByIdsQuery,
  useGetMachineModelsQuery,
  useCreateMachineConfigJSONFileMutation,
  useGetUserManagementQuery,
  useGetUserManagementGroupByIdQuery,
  useAddEditGroupUserManagementMutation,
  useDeleteGroupUserManagementMutation,
  useGetUserManagementPermissionsQuery,
  useGetTagListVersionsByMtlIdQuery,
  useGetReviewMachineAllMasterMachineTagListsQuery,
  useSaveReviewMachineMtlKdmMutation,
  useSaveReviewMachineMtlDsdmMutation,
  useSaveReviewMachineMtlMqttMutation,
  useGetMasterTagListTemplateQuery,
  useValidateMasterTagListImportMutation,
  useGetMasterTagListVersionByIdQuery,
  useGetAlertsByMachineIdQuery,
  useValidateUserEmailAvailableMutation,
  useSaveUsersMutation,
  useDeleteUserMutation,
  useSaveMappingMasterTagListMutation,
  useGetProvisionGatewaysQuery,
  useUpdateProvisionGatewayMutation,
  useGetUnmappedMasterTagListQuery,
  useGetManualUnmappedMasterTagListQuery,
  useGetUnmappedCustomMasterTagListQuery,
  useGetProductsWithSpecifiedCurrenciesQuery,
  useGetImportedMachineTagListQuery,
  useGetDriversQuery,
  useGetDeviceTypesQuery,
  useImportMachineTagListExcelMutation,
  useSendReviewAndPublishMachineDataMutation,
  useGetUnmappedMachineTagListQuery,
  useGetManualUnmappedMachineTagListQuery,
  useSaveMasterToMachineMappingMutation,
  useGetMachineTagListTemplateQuery,
  useDeleteMachineTagListMutation,
  useUpdateMachineToMasterMappingMutation,
  useGetBubbleEditsForMachineQuery,
  useGetSalesforceMachineByIdQuery,
  useDeleteCustomMasterTagListMutation,
  useGetMachinesByMasterTagListIdQuery,
  useGetKeepwareFileQuery,
  useCreatePowerBiDataMutation,
  useUpdatePowerBiDataMutation,
  useDeletePowerBiDataMutation,
  useGetIsMachineOnboardedQuery,
  useGetMachineTagListBasedOnIdQuery,
  useGetAlertStatementTagsQuery,
  useGetAlertEnumsQuery,
  useGetAlertsQuery,
  useDeleteAlertMutation,
  useSaveAlertMutation,
  useGetAlertByIdQuery,
  useUpdateAlertByIdMutation,
  useGetPowerBiDataByIdQuery
} = iopsApi;
