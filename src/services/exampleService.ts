// File: services/exampleService.ts
import { createInstrumentation, Log } from '@/utils/logger';

const logger = createInstrumentation('ExampleService');

export class ExampleService {
  // Example 1: Basic usage 
  @Log({
    message: 'Executing doSomething method',
    logResult: true,
  })
  doSomething() {
    logger.info('Doing something', { additionalInfo: 'Some details' });
    return 'Operation completed';
  }

  // Example 2: Using different log level
  @Log({
    level: 'info',
    message: 'Processing data',
    logArgs: true,
    logResult: true,
  })
  processData(data: any) {
    // Process the data
    return `Processed: ${JSON.stringify(data)}`;
  }

  // Example 3: Using custom log value
  @Log({
    logValue: (id: number) => {
      console.log('logValue called with:', id);
      return { userId: id };
    },
    logResult: true,
  })
  async fetchUserData(id: number) {
    console.log('fetchUserData called with:', id);
    const result = { id, name: 'John Doe', email: 'john@example.com' };
    console.log('fetchUserData result:', result);
    return result;
  }
  // Example 4: Logging errors
  @Log({
    level: 'warn',
    logError: true,
  })
  async riskyOperation() {
    if (Math.random() > 0.5) {
      throw new Error('Operation failed');
    }
    return 'Operation succeeded';
  }

  // Example 5: Minimal configuration
  @Log()
  simpleMethod() {
    return 'Simple operation';
  }

  // This method is not decorated, for comparison
  handleError() {
    logger.error('An error occurred', { error: new Error('Details here') });
  }
}