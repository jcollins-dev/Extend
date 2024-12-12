import {
  LogLevel,
  PublicClientApplication,
  Configuration,
  PopupRequest,
  RedirectRequest
} from '@azure/msal-browser';
import { B2CPolicies } from 'types';
import { EventType, InteractionType, AuthenticationResult } from '@azure/msal-browser';

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies: B2CPolicies = {
  names: {
    signUpSignIn: process.env.REACT_APP_B2C_SIGNUPSIGNIN_POLICY as string,
    forgotPassword: process.env.REACT_APP_B2C_FORGOTPASSWORD_POLICY as string,
    editProfile: process.env.REACT_APP_B2C_EDITPROFILE_POLICY as string
  },
  authorities: {
    signUpSignIn: {
      authority: process.env.REACT_APP_B2C_SIGNUPSIGNIN as string
    },
    forgotPassword: {
      authority: process.env.REACT_APP_B2C_FORGOTPASSWORD as string
    },
    editProfile: {
      authority: process.env.REACT_APP_B2C_EDITPROFILE as string
    }
  },
  authorityDomain: process.env.REACT_APP_B2C_AUTHORITY_DOMAIN as string
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_B2C_CLIENT_ID as string, // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Use a sign-up/sign-in user-flow as a default authority
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: process.env.REACT_APP_B2C_REDIRECT_URI as string, // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
    postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
};
export const protectedResources = {
  apiIops: {
    scopes: [process.env.REACT_APP_B2C_API_SCOPE_READ as string]
  }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest: RedirectRequest = {
  scopes: [...protectedResources.apiIops.scopes]
};

export const msalInstance = new PublicClientApplication(msalConfig);

// event defined as any because this data type is recommended by microsoft B2C documents
// eslint-disable-next-line
msalInstance.addEventCallback((event: any) => {
  if (event.eventType === EventType.LOGIN_FAILURE) {
    if (event.error && event.error.errorMessage.indexOf('AADB2C90118') > -1) {
      if (event.interactionType === InteractionType.Redirect) {
        msalInstance.loginRedirect(b2cPolicies.authorities.forgotPassword as RedirectRequest);
      } else if (event.interactionType === InteractionType.Popup) {
        msalInstance
          .loginPopup(b2cPolicies.authorities.forgotPassword as PopupRequest)
          .catch(() => {
            return;
          });
      }
    }
  }

  if (event.eventType === EventType.LOGIN_SUCCESS) {
    if (event?.payload) {
      /**
       * We need to reject id tokens that were not issued with the default sign-in policy.
       * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
       * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
       */
      if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.forgotPassword) {
        window.alert(
          'Password has been reset successfully. \nPlease sign-in with your new password'
        );
        return msalInstance.logoutRedirect();
      }
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  }
});
