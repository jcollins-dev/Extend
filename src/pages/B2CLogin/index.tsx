// 3rd party libraries
import React, { useEffect } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from 'constants/authConfig';
import { useMsal } from '@azure/msal-react';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NavigateToB2C = () => {
  const { instance } = useMsal();
  const location = useLocation<{ from: Location }>();

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } };
    loginRequest.redirectStartPage = from.pathname;
    instance.loginRedirect(loginRequest);
  }, []);
  return null;
};

export default function B2CLogin(): React.ReactElement {
  const location = useLocation<{ from: Location }>();
  return (
    <div>
      <AuthenticatedTemplate>
        <Redirect
          to={{
            pathname: location.state.from.pathname
          }}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <NavigateToB2C />
      </UnauthenticatedTemplate>
    </div>
  );
}
