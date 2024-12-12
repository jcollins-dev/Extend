# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New dependency for routing, [react-router](https://reactrouter.com/)
- Sidebar navigation components and routing structure
- New dependency for handling charts and graphs, [victory](https://formidable.com/open-source/victory/docs/victory-chart/)
- Components for machine health KPIs (bar graph visuals)
- Card component to represent a machine overview on the Machine Health dashboard page
- Machine health dashboard and detail pages
- New dependency for basic table functionality, [rc-table](https://github.com/react-component/table)
- Base table component intended to be the table other table components extend
- Components for search, sort, and filter capapbilities
- New dependency for gesture/touch interactions, [swiper](https://swiperjs.com/)
- New dependency to help with common JS/TS programming needs, [lodash](https://lodash.com/)
- New dependency for powerful date and time formatting functions, [moment](https://momentjs.com/)
- New dependency for common color and visual transformations, [polished](https://polished.js.org/)
- Components for PDP (product detail page)
- Components for Fault History on the Machine Health machine pages
- Data model setup to match planned data models for backend
- Testing coverage reports (have to be run manually at the moment)
- Improved test coverage
- Generalized hooks to allow for more reusable filter, search, and sort functionality
- Components for the Parts Catalog page
- New dependencies for state management, [redux](https://redux.js.org/), [react-redux](https://github.com/reduxjs/react-redux), [react-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
- New dependency to ease retrieving data from the backend and storing it in the frontend, [redux toolkit](https://redux-toolkit.js.org/)
- Connecting frontend to backend data and storing it in the state
- First iteration of user authentication with OAuth
- New dependency for a component displays a visual loading animation, [react-loader-spinner](https://mhnpd.github.io/react-loader-spinner/)
- Components for the clickable hierarchy of machine parts
- Data connection for the Parts Catalog, getting parts data from syteline, to the backend, to the frontend
- New dependency that provides a UI switch component, [react-switch](https://github.com/markusenglund/react-switch#readme)
- Preventnative Maintenance Machine Parts page and components created
- New dependency to trap focus for modals [focus-trap-react](https://github.com/focus-trap/focus-trap-react)
- New hook `useKeypress` to handle keyboard events (e.g., `ESC` can be used to close a modal)
- Flyout component that acts as a modal
- Components to present additional details and actions on the Preventative Maintenance table of the Parts Suggestions page
- New dependency for pagination UI component [react-paginate](https://github.com/AdeleD/react-paginate)
- New custom pagination component, and accompanying `usePaginatedQueryOffset` hook

### Changed

### Removed
