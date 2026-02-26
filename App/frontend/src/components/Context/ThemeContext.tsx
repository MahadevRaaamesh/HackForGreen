

import { createStorageContext } from './createStorageContext';

// Define the specific type for your Theme context
export type ThemeValue = 'light' | 'dark' | 'system';

const {
  Provider: ThemeProvider,
  useSpecificContext: useTheme,
  SpecificContext: ThemeContext, // Exporting for advanced use cases like testing or specific context access
} = createStorageContext<ThemeValue>({
  appNamePrefix: 'AppName_', // Your application's unique prefix
  storageKey: 'Theme', // Key for localStorage
  defaultValue: 'system', // Default value for the theme
  contextName: 'Theme', // Name for error messages
});

export { ThemeProvider, useTheme, ThemeContext };