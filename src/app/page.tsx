// File: pages/index.tsx

import { ExampleService } from '@/services/exampleService';

export default function Home() {
  const service = new ExampleService();

service.doSomething();
service.processData({ key: 'value' });
service.fetchUserData(123);
// service.riskyOperation().catch(error => console.error(error));
service.simpleMethod();

  return (
    <h1>Home page</h1>
  );
}