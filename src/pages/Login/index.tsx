// 3rd party libraries
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// Types
import { Location } from 'history';
import { User } from 'types';

// Api
import { useGetCartProductsQuery } from 'api';

// Hooks
import { useAuth } from 'hooks';

// Components
import { Button } from 'components';
import { useAuthToken, useUser } from 'selectors';

// Constants
import { sfEnabled } from 'constants/featureFlags';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-self: center;
  font-family: ${(props) => props.theme.typography.family};
  color: ${(props) => props.theme.colors.text.darkgray};
`;
const Card = styled.div`
  background-color: ${(props) => props.theme.colors.borders.border02.fill};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
  padding: 1rem;
  min-width: 20rem;
  width: 25vw;
`;
const ErrorBox = styled.div`
  color: ${(props) => props.theme.colors.validations.error.primary.fill};
  background-color: ${(props) => props.theme.colors.validations.error.accent.fill};
  font-size: 1rem;
  padding: 1rem;
`;
const Form = styled.form``;
interface ErrorProps {
  error?: boolean;
}
const Label = styled.label`
  display: block;
  margin: 1rem 0 0.25rem 0;
`;
const Input = styled.input<ErrorProps>`
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem;
  border-width: 0.0625rem;
  border-radius: 0.25rem;
  border-style: solid;
  padding: 0.75rem;

  color: ${({ error, theme }) =>
    error ? theme.colors.validations.error.primary.fill : theme.colors.text.darkgray};
  border-color: ${({ error, theme }) =>
    error ? theme.colors.validations.error.primary.fill : theme.colors.text.darkgray};
`;
const SubmitButton = styled(Button)`
  margin: 1.5rem 0 0 0;
`;

interface State {
  username: null | string;
  usernameError: boolean;
  password: null | string;
  passwordError: boolean;
  error: null | string;
}
export default function Login(): React.ReactElement {
  const [state, setState] = useState<State>({
    username: null,
    usernameError: false,
    password: null,
    passwordError: false,
    error: null
  });
  const [skipSFCartQuery, setSkipSFCartQuery] = React.useState(!sfEnabled());
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const auth = useAuth();
  const authToken = useAuthToken();
  const user = useUser() as User;

  useGetCartProductsQuery(
    {
      accountId: user?.plants[0]
    },
    { skip: skipSFCartQuery }
  );

  // Redirect immediately if we're on the login page with a valid token
  useEffect(() => {
    if (authToken) {
      const { from } = location.state || { from: { pathname: '/' } };
      history.replace(from);
    }
  }, [authToken]);

  const handleChange = (key: keyof State) => {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setState({
        ...state,
        // Unset any text input
        error: null,
        usernameError: false,
        passwordError: false,
        [key]: event?.target?.value ?? null
      });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const statePatch: Partial<Pick<State, 'error' | 'usernameError' | 'passwordError'>> = {};
    if (!state.username) {
      statePatch['usernameError'] = true;
      statePatch['error'] = 'Please provide a username';
    }
    if (!state.password) {
      statePatch['passwordError'] = true;
      statePatch['error'] = 'Please provide a password';
    }
    if (!state.username && !state.password) {
      statePatch['error'] = 'Please provide a username and password';
    }

    // If any error jump out here
    if (statePatch?.error) {
      setState({
        ...state,
        ...statePatch
      });
      return;
    }

    const { from } = location.state || { from: { pathname: '/' } };

    if (auth?.signin) {
      try {
        await auth.signin(state.username ?? '', state.password ?? '');
      } catch (err) {
        setState({
          ...state,
          usernameError: true,
          passwordError: true,
          error: (err as Error)?.message
        });
        return;
      }
      if (sfEnabled()) setSkipSFCartQuery(false);
      history.replace(from);
    } else {
      throw new Error('Signin handler not ready');
    }
  };

  return (
    <Container>
      <Card>
        {state.error && (
          <ErrorBox>
            <FontAwesomeIcon size="lg" icon={faExclamationCircle} />
            &nbsp;
            {state.error}
          </ErrorBox>
        )}
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            name="username"
            error={state.usernameError}
            value={state.username ?? ''}
            onChange={handleChange('username')}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            error={state.passwordError}
            value={state.password ?? ''}
            onChange={handleChange('password')}
          />

          <SubmitButton type="submit" variant="primary">
            Login
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
}
