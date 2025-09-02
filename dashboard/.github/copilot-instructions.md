---
applyTo: "**"
---

# Copilot Instructions

## Overall Architecture

This is a Next.js application using the App Router. The architecture is designed to separate UI components from data fetching logic and to allow for easy switching between mock and real AWS data.

The core data flow is as follows:

1.  **UI Components** (in `src/components/`) use...
2.  **Custom Hooks** (in `src/hooks/`) to fetch data.
3.  These hooks call internal **API Routes** (in `src/app/api/aws/**`).
4.  The API routes use the **Services Layer** (in `src/services/`) to get data.
5.  The services layer uses the **AWS SDK** to fetch real data.

## Data Fetching Pattern

The most important pattern is the service abstraction for AWS data.

- `src/services/aws-data.service.ts` defines the interface for all AWS data operations.
- `src/services/real-aws-data.service.ts` is the implementation that uses the AWS SDK to fetch live data.
- For development and testing, a mock service can be used that implements the `aws-data.service.ts` interface, allowing the app to run without AWS credentials.

When adding new data fetching capabilities:

1.  Add the method to the `aws-data.service.ts` interface.
2.  Implement the method in `real-aws-data.service.ts`.
3.  Create a new API route in `src/app/api/aws/` that calls the new service method.
4.  Create a new hook in `src/hooks/` to fetch data from the new API route.
5.  Use the hook in your component.

## UI and Components

- The UI is built with **shadcn/ui**. Reusable, custom-built components are in `src/components/`.
- Core UI elements from shadcn are located in `src/components/ui/`.
- The main dashboard layout is in `src/components/Dashboard.tsx` and rendered on the main page at `src/app/page.tsx`.

## Development Workflow

- Run the development server with `npm run dev`.
- The application works with mock data by default.
- To connect to real AWS data, you must set up your environment as described in the `README.md`. The recommended method is to set the `AWS_PROFILE` environment variable.

## General Instructions

- Whenever you run a command in the terminal, pipe the output to a file, output.txt, that you can read from. Make sure to overwrite each time so that it doesn't grow too big. There is a bug in the current version of Copilot that causes it to not read the output of commands correctly. This workaround allows you to read the output from the temporary file instead.
- `cat` the contents of output.txt so you can also read it directly.
