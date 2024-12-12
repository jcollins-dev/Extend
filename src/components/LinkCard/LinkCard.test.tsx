// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import { default as theme } from 'themes';

// Components
import LinkCard from './LinkCard';

describe('LinkCard component', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter initialEntries={[JBTRoutes.fleet]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.fleet}>
            <LinkCard name="test name" link="/machines" cta="press here" />
          </Route>
        </ThemeProvider>
      </MemoryRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should render an <a> with the given link, display name, and call-to-action', () => {
    const testName = 'test name';
    const testLink = '/machines';
    const testCta = 'press here';

    render(
      <MemoryRouter initialEntries={[JBTRoutes.fleet]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.fleet}>
            <LinkCard name={testName} link={testLink} cta={testCta} />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByRole('link').length).toBe(1);
    expect(screen.getByRole('link').getAttribute('href')).toBe(testLink);
    expect(screen.getByText(testName)).toBeInTheDocument();
    expect(screen.getByText(testCta)).toBeInTheDocument();
  });
});
