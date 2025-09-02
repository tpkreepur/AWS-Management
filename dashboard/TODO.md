# TODO.md

## Code Quality & Maintainability

- [ ] Add/Improve Documentation
  - Add JSDoc comments to all service methods and hooks.
  - Document public APIs and components, especially in services and hooks.
  - Update README with setup, architecture, and usage details.

- [ ] TypeScript Strictness
  - Enable strict mode in tsconfig.json if not already enabled.
  - Audit all type definitions for completeness and explicitness (e.g., avoid any).

- [ ] Error Handling
  - Standardize error handling in API routes and services (e.g., consistent error responses, logging).
  - Ensure all hooks and components display meaningful error messages to users.

- [ ] Code Duplication
  - Review for duplicate logic in service and hook layers (e.g., repeated quick actions logic).
  - Refactor common patterns into utility functions where appropriate.

- [ ] SOLID & DRY Principles
  - Audit service classes for single responsibility and interface segregation.
  - Refactor any large or multi-purpose functions into smaller, focused units.

## Performance

- [ ] Optimize Data Fetching
  - Add caching for expensive or frequently called AWS API requests.
  - Debounce/throttle user-triggered actions in UI components (e.g., QuickActions).

- [ ] Frontend Performance
  - Audit components for unnecessary re-renders; use React.memo and hooks like useMemo/useCallback where needed.
  - Ensure all images and assets are optimized and use lazy loading.

## Security

- [ ] Input Validation & Sanitization
  - Validate and sanitize all inputs in API routes (use zod or yup).
  - Audit for potential data exposure in error messages and API responses.

- [ ] Authentication/Authorization
  - Ensure sensitive API routes are protected (middleware or server-side checks).
  - Review AWS credentials handling and environment variable usage.

## Testing

- [ ] Increase Test Coverage
  - Add unit tests for all service methods and hooks.
  - Add integration tests for API routes.
  - Add Playwright/E2E tests for critical user flows (e.g., dashboard, quick actions).

- [ ] Test Quality
  - Use role-based locators and web-first assertions in Playwright tests.
  - Co-locate tests with components and services.

## Dependencies

- [ ] Audit Dependencies
  - Check for outdated or vulnerable dependencies in package.json.
  - Remove unused packages and update to latest stable versions.

## Miscellaneous

- [ ] Linting & Formatting
  - Ensure ESLint and Prettier are configured and enforced.
  - Fix any outstanding lint errors or warnings.

- [ ] Mock/Real AWS Data Toggle
  - Make it easy to switch between mock and real AWS data (document the process, add environment variable support).
