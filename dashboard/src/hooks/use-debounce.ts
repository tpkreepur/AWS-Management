import { useCallback, useRef } from "react";

/**
 * Custom hook for debouncing function calls.
 * Delays the execution of a function until after a specified delay has passed since the last call.
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns Debounced version of the callback function
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

/**
 * Custom hook for throttling function calls.
 * Limits the execution of a function to at most once per specified interval.
 * @param callback - The function to throttle
 * @param interval - The minimum interval between calls in milliseconds
 * @returns Throttled version of the callback function
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= interval) {
        // Execute immediately if enough time has passed
        lastCallRef.current = now;
        callback(...args);
      } else {
        // Schedule execution for the remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, interval - timeSinceLastCall);
      }
    },
    [callback, interval]
  );

  return throttledCallback as T;
}

/**
 * Utility function to create a debounced version of any function.
 * Useful for scenarios outside of React components.
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns Debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Utility function to create a throttled version of any function.
 * Useful for scenarios outside of React components.
 * @param func - The function to throttle
 * @param interval - The minimum interval between calls in milliseconds
 * @returns Throttled version of the function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  interval: number
): T {
  let lastCall = 0;
  let timeout: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= interval) {
      lastCall = now;
      func(...args);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, interval - timeSinceLastCall);
    }
  }) as T;
}
