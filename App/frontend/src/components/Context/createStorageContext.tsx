//--No Need To Look At This--//

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

/**
 * Options for creating a storage-backed React Context.
 * @template T The type of the value stored in the context.
 */

type CreateStorageContextOptions<T> = {
  /** A unique prefix for your application's localStorage keys (e.g., 'MyAwesomeApp_'). */
  appNamePrefix: string;
  /** The specific key under which this context's data will be stored in localStorage (e.g., 'Theme', 'AuthData'). */
  storageKey: string;
  /** The default value for the context if nothing is found in localStorage or when reset. */
  defaultValue: T;
  /** A descriptive name for the context, used in error messages (e.g., 'Auth', 'UserPreferences'). */
  contextName: string;
};

/**
 * A factory function to create a React Context, Provider, and Hook that
 * automatically persists its state to localStorage.
 *
 * @template T The type of the value stored in the context.
 * @param {CreateStorageContextOptions<T>} options Configuration for the context.
 * @returns An object containing the Provider component and the useHook for the created context.
 */
export function createStorageContext<T>(options: CreateStorageContextOptions<T>) {
  const { appNamePrefix, storageKey, defaultValue, contextName } = options;

  type ContextType = {
    value: T;
    set: (value: T) => void;
    remove: () => void;
  };

  const SpecificContext = createContext<ContextType | undefined>(undefined);

  /**
   * Helper to read from localStorage safely (SSR friendly)
   */
  const readFromStorage = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    const item = window.localStorage.getItem(`${appNamePrefix}${storageKey}`);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.warn(`Failed to parse storage key "${storageKey}" for context "${contextName}"`, e);
      }
    }
    return defaultValue;
  };

  const Provider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<T>(defaultValue);

    // Initialize on mount
    useEffect(() => {
      setValue(readFromStorage());
    }, []);

    const set = useCallback((newValue: T) => {
      // 1. Update React State
      setValue((prev) => {
        // Optimization: Prevent re-render if value is identical
        if (prev === newValue) return prev;
        return newValue;
      });

      // 2. Update LocalStorage
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(`${appNamePrefix}${storageKey}`, JSON.stringify(newValue));
        }
      } catch (error) {
        console.error(`Error saving to storage for context "${contextName}"`, error);
      }
    }, [appNamePrefix, storageKey, contextName]);

    const remove = useCallback(() => {
      // 1. Reset to default in State
      setValue(defaultValue);

      // 2. Remove from LocalStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`${appNamePrefix}${storageKey}`);
      }
    }, [appNamePrefix, storageKey, defaultValue]);

    const contextValue = useMemo(() => ({ value, set, remove }), [value, set, remove]);

    return <SpecificContext.Provider value={contextValue}>{children}</SpecificContext.Provider>;
  };

  const useSpecificContext = () => {
    const context = useContext(SpecificContext);
    if (!context) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return context;
  };

  return { Provider, useSpecificContext, SpecificContext };
}