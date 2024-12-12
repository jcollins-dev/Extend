// 3rd party libraries
import React, { ReactElement, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useLocation
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from 'constants/authConfig';

import { AppV2 } from 'common/App';

// Sentry
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Constants
import breakpoint from 'constants/breakpoints';
import { JBTRoutes } from 'constants/routes';
import { sideNavItems } from 'constants/nav';
import Footer from './components/Footer/Footer';
import Header from 'components/Header/Header';
import helpImage from './img/Group 33437.svg';

// Components
import {
  Loader,
  PageHeader,
  PermissionWrapper,
  PowerBIEmbedded,
  SidebarNav,
  Typography,
  Test
} from 'components';

import { ToastContainer } from 'react-toastify';

// Hooks
import { useAuthB2C, usePageTracking, usePermissions } from 'hooks';

// Pages
import {
  AddNewMachine,
  Admin,
  B2CLogin,
  CheckHierarchy,
  Dashboard,
  FindMachine,
  FleetDashboardPage,
  FleetMachineDetail,
  HelpPage,
  ReportPage,
  Line,
  Login,
  Machine,
  MachineManagement,
  MachinePmPartsPage,
  MaintenanceServiceDashboard,
  MaintenanceServiceMachineDashboard,
  PartPage,
  PartsCatalogPage,
  PartsSuggestions,
  ProductDetailPage,
  SFOrdersPage,
  Site,
  UserManagement,
  MTLConfigurationMapping,
  ReviewAndPublishPage,
  DemoTable
} from 'pages';

import CreateAlertPage from 'pages/AlertsPage/CreateAlert';

import OnboardingPage from 'pages/MachineManagement/OnboardingPage';
import MasterTagListDashBoard from 'pages/MasterTagListDashBoard';
import MaintenanceSchedule from 'pages/MachineManagement/MaintenanceSchedule';
import AccessDenied from 'pages/Permission/AccessDenied';

// Icons
import { faBell, faTools } from '@fortawesome/free-solid-svg-icons';
import { UserShieldIcon, MachineManagementIcon } from 'icons';

// Theme
import theme from 'themes';
import { GlobalStyle } from 'themes/GlobalStyle';

// Provider
import { LanguageProvider, FleetNavigationProvider } from 'providers';

// Helpers
import { getLanguageId, getUserLanguage, getUserRegion } from 'helpers';
import { getPermissionNameByLocation } from 'pages/Permission/utils';

// State actions
import { useAuthToken } from 'selectors';

import { useValidateTokenQuery } from 'api';
import { Role } from 'types';
import { AlertManagement } from 'pages/AlertManagement/AlertManagament';
import { AlertTemplateManagement } from 'pages/AlertManagement/AlertTemplateManagement';
import { AlertCreator } from 'pages/AlertCreator/AlertCreatorWelcome';

// Sentry initialization script
const history = createBrowserHistory();

const TRACE_SAMPLE_RATE = process.env.NODE_ENV === 'development' ? 1.0 : 0.2;
Sentry.init({
  debug: false,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history)
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: TRACE_SAMPLE_RATE
});

// TODO - Split framing elements below into new components
const Frame = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
`;

const MainContent = styled.div`
  background-color: ${(props) => props.theme.colors.borders.border02.fill};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
  flex-grow: 1;
  overflow-x: hidden;
  margin-left: 3.75rem;
  @media ${breakpoint.device.lg} {
    margin-left: 11.875rem;
  }
`;

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f1f7ff;
  padding: 30px;
  align-items: center;
  height: 152px;
`;

const HelpText = styled.div`
  font-size: 60px;
  font-weight: 400;
  font-family: Roboto;
  color: #303e47;
`;

interface CustomRouteProps extends RouteProps {
  children?: React.ReactNode;
}

const TrackedRoute = ({ children, ...rest }: CustomRouteProps): React.ReactElement => {
  usePageTracking();
  return <Route {...rest}>{children}</Route>;
};

const PrivateRoute = ({ children, ...rest }: CustomRouteProps): React.ReactElement => {
  const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';
  const [authToken] = useState(useAuthToken());
  const [authPending, setAuthPending] = useState(true);
  const auth = useAuthB2C();
  console.log({ authToken });

  useEffect(() => {
    if (b2cflag) {
      auth.getAccessToken();
      auth.getUserResources();
      setAuthPending(false);
    }
  }, [authToken]);
  return (
    <TrackedRoute
      {...rest}
      render={({ location }) => {
        if (authToken) {
          return (
            <PermissionWrapper
              page={getPermissionNameByLocation(location.pathname)}
              redirect={true}
            >
              <>{children}</>
            </PermissionWrapper>
          );
        }

        if (b2cflag && authPending) {
          return <Loader />;
        } else {
          return (
            <Redirect
              to={{
                pathname: JBTRoutes.login,
                // Populate state to redirect back here after login
                state: { from: location }
              }}
            />
          );
        }
      }}
    />
  );
};

const ProsealCheck = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { pathname } = useLocation();

  const basePath = pathname.split('/').filter((slug) => slug !== '')[0];

  if (basePath === 'proseal-demo') return <AppV2 />;

  return <>{children}</>;
};

const App = (): ReactElement => {
  const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';
  // Hook to make sure the user session is properly expired:
  // - checks at the interval of the env var or every 30 seconds

  const { t, i18n } = useTranslation(['common']);

  const validateInterval = process.env.REACT_APP_VALIDATE_INTERVAL_MILLI
    ? parseInt(process.env.REACT_APP_VALIDATE_INTERVAL_MILLI)
    : 30000;
  useValidateTokenQuery(undefined, { pollingInterval: validateInterval });

  const permission = usePermissions();
  const role = permission?.role;

  const language = i18n.language;
  const languageId = getLanguageId(i18n.language);
  const languageName = getUserLanguage(i18n.language, i18n.language);
  const languageNameInEnglish = getUserLanguage(i18n.language);
  const region = getUserRegion(i18n.language);
  const [toggleContent, setToggleContent] = useState<boolean>(false);
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <LanguageProvider
          context={{ language, languageId, languageName, languageNameInEnglish, region }}
        >
          <ProsealCheck>
            <ThemeProvider theme={theme}>
              {/* Global toast container */}
              <ToastContainer
                position="top-center"
                autoClose={4000}
                newestOnTop={true}
                closeOnClick
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                limit={3}
                style={{ width: '25rem', borderRadius: '5px' }}
              />
              <GlobalStyle />
              <Header />
              <Frame className="page-frame">
                <Switch>
                  <TrackedRoute path={JBTRoutes.login}>
                    {b2cflag ? <B2CLogin /> : <Login />}
                  </TrackedRoute>

                  <TrackedRoute path={JBTRoutes.accessDenied}>
                    <AccessDenied />
                  </TrackedRoute>

                  <PrivateRoute path="/">
                    <FleetNavigationProvider>
                      <SidebarNav
                        items={sideNavItems}
                        role={role}
                        toggleContent={toggleContent}
                        setToggleContent={setToggleContent}
                      />
                      <MainContent
                        style={
                          !toggleContent
                            ? {
                                width: 'calc(100vw - 4.325rem)',
                                marginLeft: '16.325rem',
                                marginBottom: '50px'
                              }
                            : {
                                width: 'calc(100vw - 12.325rem)',
                                marginLeft: '4.325rem',
                                marginBottom: '50px'
                              }
                        }
                      >
                        <Switch>
                          <Route
                            exact
                            path="/"
                            render={() => {
                              return permission &&
                                permission?.machines.length > 0 &&
                                role &&
                                role === Role.User ? (
                                <Redirect
                                  to={JBTRoutes.customerReports.replace(
                                    ':machineId',
                                    permission?.machines[0]
                                  )}
                                />
                              ) : (
                                <Redirect to={JBTRoutes.dashboard} />
                              );
                            }}
                          />
                          {/* Notifications */}
                          <TrackedRoute path={JBTRoutes.notifications}>
                            <PageHeader
                              heading={t('notifications')}
                              icon={{ iconElement: faBell, iconType: 'fa' }}
                            />
                            <Test />
                            <Typography variant="h1">Coming soon</Typography>
                          </TrackedRoute>

                          {/* Fleet */}
                          <TrackedRoute exact path={JBTRoutes.fleet}>
                            <FleetDashboardPage />
                          </TrackedRoute>

                          <TrackedRoute exact path={JBTRoutes.fleetMachine}>
                            <FleetMachineDetail />
                          </TrackedRoute>

                          {/*Master tag list*/}
                          <TrackedRoute exact path={JBTRoutes.machineMasterTagListDashBoard}>
                            <MasterTagListDashBoard toggleContent={toggleContent} />
                          </TrackedRoute>

                          {/* Site */}
                          <TrackedRoute path={JBTRoutes.site}>
                            <Site />
                          </TrackedRoute>

                          {/* Line */}
                          <TrackedRoute path={JBTRoutes.line}>
                            <Line />
                          </TrackedRoute>

                          {/* Machine  */}
                          <TrackedRoute path={JBTRoutes.machine}>
                            <Machine />
                          </TrackedRoute>

                          {/* Maintenance */}
                          <TrackedRoute path={JBTRoutes.maintenanceServicemachine}>
                            <MaintenanceServiceMachineDashboard />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceService}>
                            <MaintenanceServiceDashboard />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceServiceevents}>
                            MAINTENANCE - SERVICE EVENTS
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceRoutine}>
                            MAINTENANCE - ROUTINE MAINTENANCE
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceManuals}>
                            <PageHeader
                              heading="Manuals and guides"
                              icon={{ iconElement: faTools, iconType: 'fa' }}
                            />
                            <Typography variant="h1">Coming soon</Typography>
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceRemotediagnostics}>
                            MAINTENANCE - REMOTE DIAGNOSTICS
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.maintenanceMachinepmparts}>
                            <MachinePmPartsPage />
                          </TrackedRoute>
                          <Route
                            exact
                            path={JBTRoutes.maintenance}
                            render={() => {
                              return <Redirect to={JBTRoutes.maintenanceService} />;
                            }}
                          />

                          {/* Parts */}
                          <TrackedRoute exact path={JBTRoutes.partsCatalog}>
                            <PartsCatalogPage />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsMachine}>
                            <PartPage />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsSuggestions}>
                            <PartsSuggestions />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsLeadtimes}>
                            PARTS - LEAD TIMES
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsOrders}>
                            <SFOrdersPage />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsInventory}>
                            PARTS - INVENTORY
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.partsProduct}>
                            <ProductDetailPage />
                          </TrackedRoute>
                          <Route
                            exact
                            path={JBTRoutes.parts}
                            render={() => {
                              return <Redirect to={JBTRoutes.partsCatalog} />;
                            }}
                          />
                          {/* AddNewMachine */}
                          {role && role === Role.Admin && (
                            <TrackedRoute path={JBTRoutes.adminAddNewMachine}>
                              <AddNewMachine />
                            </TrackedRoute>
                          )}

                          {/* Admin */}
                          {role && role === Role.Admin && (
                            <TrackedRoute path={JBTRoutes.admin}>
                              <Admin />
                            </TrackedRoute>
                          )}

                          {/* iOPS */}
                          <TrackedRoute exact path={JBTRoutes.iops}>
                            <PowerBIEmbedded />
                          </TrackedRoute>

                          {/* User Management */}
                          <TrackedRoute path={JBTRoutes.userManagement}>
                            <PageHeader
                              mb="1rem"
                              heading={t('card_group_user_management')}
                              icon={{ iconElement: UserShieldIcon, iconType: 'custom' }}
                            />
                            <UserManagement />
                          </TrackedRoute>

                          {/* Machine Management */}
                          <TrackedRoute path={JBTRoutes.machineManagement}>
                            <PageHeader
                              mb="1rem"
                              heading={t('card_machine_management')}
                              icon={{ iconElement: MachineManagementIcon, iconType: 'custom' }}
                            />
                            <MachineManagement />
                          </TrackedRoute>

                          {/* Alert Management */}
                          {role && role === Role.Admin && (
                            <TrackedRoute path={JBTRoutes.alertManagement}>
                              <AlertManagement />
                            </TrackedRoute>
                          )}
                          {/* Alert Creator */}
                          {role && (
                            <TrackedRoute path={JBTRoutes.alertCreator}>
                              <AlertCreator />
                            </TrackedRoute>
                          )}
                          {/* Alert Management */}
                          {role && role === Role.Admin && (
                            <TrackedRoute path={JBTRoutes.alertTemplateManagement}>
                              <AlertTemplateManagement />
                            </TrackedRoute>
                          )}

                          {/* Demo Table */}
                          {role && role === Role.Admin && (
                            <TrackedRoute path={JBTRoutes.demoTable}>
                              <DemoTable />
                            </TrackedRoute>
                          )}

                          <TrackedRoute path={JBTRoutes.machineManagementNew}>
                            <FindMachine />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.machineManagementHierarchy}>
                            <CheckHierarchy />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.machineManagementMtlConfigurationMapping}>
                            <MTLConfigurationMapping />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.machineReviewAndPublish}>
                            <ReviewAndPublishPage />
                          </TrackedRoute>
                          {/* Customer Reports */}
                          <TrackedRoute path={JBTRoutes.customerReports}>
                            <ReportPage />
                          </TrackedRoute>
                          {/* Help */}
                          <TrackedRoute path={JBTRoutes.help}>
                            <HelpContainer>
                              <HelpText>{t('help')}</HelpText>
                              <img style={{ paddingTop: 70 }} src={helpImage}></img>
                            </HelpContainer>
                            {/*<Typography variant="h1">Coming soon</Typography>*/}
                            <HelpPage />
                          </TrackedRoute>
                          {/* Settings */}
                          {/* <TrackedRoute path={JBTRoutes.settings}>
                          <Settings />
                        </TrackedRoute> */}
                          {/* Dashboard */}
                          <TrackedRoute path={JBTRoutes.dashboard}>
                            <Dashboard />
                          </TrackedRoute>
                          {/* New Asset Onboarding Page */}
                          <TrackedRoute path={JBTRoutes.onboardingMaintenanceSchedulePage}>
                            <MaintenanceSchedule />
                          </TrackedRoute>
                          <TrackedRoute path={JBTRoutes.onboardingPage}>
                            <OnboardingPage />
                          </TrackedRoute>
                          {/* Create Alert Page */}
                          {process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' && (
                            <TrackedRoute path={JBTRoutes.createAlert}>
                              <CreateAlertPage />
                            </TrackedRoute>
                          )}
                        </Switch>
                      </MainContent>
                    </FleetNavigationProvider>
                    {/* Commenting the below components as they are already present in Header section */}
                    {/* <ShowLanguages />
                  <SavedProductList />
                  <ContextAwareCart /> */}
                  </PrivateRoute>
                </Switch>
              </Frame>

              <Footer toggleContent={toggleContent} />
            </ThemeProvider>
          </ProsealCheck>
        </LanguageProvider>
      </Router>
    </MsalProvider>
  );
};

export default App;
