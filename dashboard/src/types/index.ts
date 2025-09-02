// Re-export all types from a central location
export * from "./aws";

// Common UI-related types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
