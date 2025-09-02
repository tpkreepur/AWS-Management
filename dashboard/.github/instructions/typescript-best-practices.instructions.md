---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript best practices for type safety and maintainability"
---

# TypeScript Best Practices

## Type Definition Guidelines

### Interface vs Type Aliases

```typescript
// Use interfaces for object shapes that might be extended
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use type aliases for unions, intersections, and computed types
type Status = "pending" | "approved" | "rejected";
type UserWithStatus = User & { status: Status };
```

### Strict Type Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Generic Constraints

```typescript
// Good: Constrain generics appropriately
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Use keyof for property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Utility Types and Advanced Patterns

### Built-in Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial for optional fields
type UserUpdate = Partial<User>;

// Pick for selecting specific fields
type UserPublic = Pick<User, "id" | "name" | "email">;

// Omit for excluding fields
type UserCreate = Omit<User, "id">;

// Record for key-value mappings
type UserRoles = Record<string, "admin" | "user" | "guest">;
```

### Custom Utility Types

```typescript
// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Non-nullable
type NonNullable<T> = T extends null | undefined ? never : T;

// Function parameters
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

## React TypeScript Patterns

### Component Props

```typescript
// Props interface with proper typing
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

// Component with proper typing
const Button: React.FC<ButtonProps> = ({
  variant,
  size = "medium",
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Hooks Typing

```typescript
// Custom hook with proper return type
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
```

### Event Handling

```typescript
// Proper event typing
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  // Process form data
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  // Handle input change
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === "Enter") {
    // Handle enter key
  }
};
```

## API and Data Typing

### API Response Types

```typescript
// Define API response shapes
interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Usage with fetch
async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch("/api/users");
  return response.json();
}
```

### Discriminated Unions

```typescript
// State management with discriminated unions
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: User[];
}

interface ErrorState {
  status: "error";
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

// Type-safe state handling
function renderUserList(state: AsyncState) {
  switch (state.status) {
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <UserList users={state.data} />;
    case "error":
      return <div>Error: {state.error}</div>;
  }
}
```

## Error Handling and Validation

### Type Guards

```typescript
// Type guard functions
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as User).id === "string" &&
    typeof (obj as User).name === "string" &&
    typeof (obj as User).email === "string"
  );
}

// Usage
function processUserData(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.name); // No type error
  }
}
```

### Schema Validation with Zod

```typescript
import { z } from "zod";

// Define schema
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().positive().optional(),
});

// Infer type from schema
type User = z.infer<typeof UserSchema>;

// Validate data
function createUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

## Performance and Bundle Optimization

### Dynamic Imports with Types

```typescript
// Dynamic import with proper typing
async function loadChart() {
  const { Chart } = await import("chart.js");
  return Chart;
}

// Lazy loading with React
const LazyComponent = React.lazy(() => import("./HeavyComponent"));
```

### Module Declaration

```typescript
// Declare modules for JavaScript libraries
declare module "legacy-library" {
  export function doSomething(param: string): number;
  export const VERSION: string;
}

// Extend global types
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
```

## Testing with TypeScript

### Type-Safe Testing

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Type-safe test utilities
function renderWithProviders(
  ui: React.ReactElement,
  options: {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
  } = {}
) {
  // Setup providers with proper typing
}

// Mock functions with proper typing
const mockOnClick = jest.fn<void, [React.MouseEvent<HTMLButtonElement>]>();
```

## Common Pitfalls to Avoid

### Any Type Usage

```typescript
// Bad: Using any defeats the purpose of TypeScript
function processData(data: any) {
  return data.someProperty.nested.value;
}

// Good: Use unknown and type guards
function processData(data: unknown) {
  if (isValidData(data)) {
    return data.someProperty.nested.value;
  }
  throw new Error("Invalid data structure");
}
```

### Non-null Assertion Misuse

```typescript
// Bad: Overusing non-null assertion
const user = getUser()!;
const name = user.profile!.name!;

// Good: Proper null checking
const user = getUser();
if (user?.profile?.name) {
  const name = user.profile.name;
  // Use name safely
}
```

### Type Assertions

```typescript
// Bad: Unsafe type assertion
const element = document.getElementById("myId") as HTMLInputElement;

// Good: Safe type checking
const element = document.getElementById("myId");
if (element instanceof HTMLInputElement) {
  // Use element safely
}
```

Always leverage TypeScript's type system to catch errors at compile time. Use strict type checking, avoid `any` when possible, and prefer type guards over type assertions for runtime safety.
