# Dashboard

## Setup

- Install latest Node.js LTS (as of this writing it is v16) - [Download here](https://nodejs.org/en/download/)
- Install [Yarn, currently still using Yarn 1](https://classic.yarnpkg.com/en/) - `npm install -g yarn`
- Run `yarn install` or `yarn` to install dependencies
- Run `yarn start` to run the app

## Code layout (Legacy layout, do NOT use when creating new components. Please see below.)

- `src/components` - function-based components
- `src/constants` - scripts that contain any constants (e.g., routes, the navigation structure, test data) so that it is contained in one location, and not left locally in the components that use them
- `src/hooks` - custom hooks that affect local state and are used by multiple components (e.g., search, filtering)
- `src/icons` - functions that produce icons dynamically (as SVGs) so that their color can be altered easily
- ` src/pages` - containers that hold multiple components
- `src/themes` - object(s) providing the typography, color, and outlines
- `src/types` - types and interfaces defined in one location for ease of import across the codebase

## New Folder structure (08/03/23):

```
├── common
      ├── components (larger components using elements from UI folder, no business logic here)
			├── Form
			├── Widget
			├── TableForWhatever
			├── Sidebar
      ├── pages
	        ├── Proseal
			    ├── hooks...
				...
			├── DSI
				├── useHookData
				├── Overview tab
				...
			...

├── ui (small ui elements, no business logic)
	 ├── input.tsx
	 ├── pieChart.tsx
	 ├── button.tsx
	 ├── checkbox.tsx
     ├── ...

     ├── assets/ (images)

├── Hooks (global hooks that are used for all pods, BU specific will go into BU specific page, for example pages/DSI...)
├── Constants (stays the same and keeps constant values, pod and cross pod specific)
├── Helpers (stays the same, used for cross pod helper functions)

```

### Generate new components

- Run `npx generate-react-cli component MyNewComponent` - this will create a new folder `src/components/MyNewComponent` with `MyNewComponent.tsx` and `MyNewComponent.test.tsx`
- Add the new component as an export in `src/components/index.ts` for easy importing, like

```
export { default as MyNewComponent } from 'components/MyNewComponent/MyNewComponent';
```

### Generate new pages

- Run `npx generate-react-cli component MyNewPage --path=src/common/pages` - this will create a new folder `src/pages/MyNewPage` with `MyNewPage.tsx` and `MyNewPage.test.tsx`
- Add the new component as an export in `src/pages/index.ts` for easy importing, like

```
export { default as MyNewPage } from 'pages/MyNewPage/MyNewPage';
```

### Testing

This codebase is using Jest, React Testing Library, and React Test Renderer for testing code and reporting code coverage.

- To run tests and to "watch" for changes while in development, run `yarn test`
- To get the code coverage information while watching locally `yarn test --coverage --watchAll`
- To produce a code coverage report that is output to `<root-folder>/code-coverage/`, run `yarn test-coverage`

### Storybook component library

Re-useable components are documented using [Storybook](https://storybook.js.org/docs/react/get-started/introduction), to provide us with a convenient way to develop and interact with the component library. As new components are developed, those which are suitable for re-use should be added to storybook, so they are easily viewable by other developers.

Suitable components should have a counterpart `{componentName}.story.tsx` file located next to the main component file.

To run storybook locally on port 6006:

```
yarn storybook
```

At the moment, if you have node `18.0.0`, you may need to run storybook locally with the command below, or it might fail to run. Reference link to issue - [storybook github issue 18019](https://github.com/storybookjs/storybook/issues/18019).

```
yarn storybook -h localhost
```

## Libraries and frameworks

- [React](https://reactjs.org/) - frontend library
- [React Router](https://reactrouter.com/) - navigation
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) - linting and code formatting
- [Style Components](https://styled-components.com/) - Styling
- [Font Awesome (React)](https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react) - Icons, using the free set
- [TypeScript](https://www.typescriptlang.org/) - "A strongly typed programming language which builds on JavaScript"
- [Victory](https://formidable.com/open-source/victory/) -
- [Jest](https://jestjs.io/) - A "delightful Javascript Testing Framework"
- [React Testing Library](https://testing-library.com/) - A library with additional testing utilities.
- [React Test Renderer](https://reactjs.org/docs/test-renderer.html) - Another testing package used to render React components as pure Javascript objects (helps with component pseudo-integration testing)
- [Storybook](https://storybook.js.org) - Storybook is an open source tool for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.
- [React Tables](https://tanstack.com/table/v8) -

### API setup / customization

By default, the frontend will proxy to the cloud deployed `develop` version of
the backend API. To customize this / change this to run against a locally
running version of the backend API, see the instructions in the `.env.development`. Also if you're consistently making this change, consider
providing your own `.env.development.local` to override these variables more
permanently without `git` pestering you.

## Adding new API endpoints with different prefixes for local development

- Create a prefix like `REACT_APP_API_PREFIX=/api` in .env.development
- Create a variable for the endpoint like `REACT_APP_PROXY_API=http://localhost:8000` in .env.development
- Add an entry in `setupProxy.js` like other entries to route the endpoint to the correct port
- `app.use( process.env.REACT_APP_API_PREFIX ?? '/', createProxyMiddleware({ target: process.env.REACT_APP_PROXY_API, changeOrigin: true, pathRewrite }) );`
