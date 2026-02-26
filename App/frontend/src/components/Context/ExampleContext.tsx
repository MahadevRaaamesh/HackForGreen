//--Import Factory--//
import { createStorageContext } from './createStorageContext';

//--Change Data Type--//

export type ExampleValue = 'value1' | 'value2';

const {
  Provider: ExampleProvider,
  useSpecificContext: useExample,
  SpecificContext: ExampleContext, // Exporting for advanced use cases like testing or specific context access
} = createStorageContext<ExampleValue>({
  appNamePrefix: 'AppName_', // Your application's unique prefix
  storageKey: 'Auth', // Key for localStorage
  defaultValue: 'value1', // Default value for unauthenticated state
  contextName: 'Auth', // Name for error messages
});

export { ExampleProvider, useExample , ExampleContext };