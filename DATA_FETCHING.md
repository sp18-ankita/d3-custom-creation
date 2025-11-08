# Data Fetching Hook System

This project includes a comprehensive data fetching system built around a powerful custom React hook that supports both REST and GraphQL APIs with built-in error handling, loading states, and retry logic.

## Core Hook: `useDataFetcher`

### Features

- ✅ **Unified API**: Handle both REST and GraphQL requests with the same hook
- ✅ **TypeScript Support**: Fully typed with generic support
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Error Handling**: Comprehensive error management with custom error types
- ✅ **Retry Logic**: Configurable retry attempts with exponential backoff
- ✅ **Request Cancellation**: Built-in request lifecycle management
- ✅ **Callback Support**: Success and error callbacks
- ✅ **HTTP Method Shortcuts**: Convenience methods for GET, POST, PUT, DELETE, PATCH

### Basic Usage

```tsx
import { useDataFetcher } from '../hooks/useDataFetcher';

const MyComponent = () => {
  const { get, post, graphql, data, loading, error, reset } = useDataFetcher();

  // REST API call
  const fetchData = async () => {
    const result = await get('https://api.example.com/data');
    console.log(result);
  };

  // GraphQL query
  const fetchGraphQLData = async () => {
    const result = await graphql({
      query: `query { users { id name email } }`,
      variables: { limit: 10 },
    });
    console.log(result);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <button onClick={fetchData}>Fetch REST Data</button>
      <button onClick={fetchGraphQLData}>Fetch GraphQL Data</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### Advanced Configuration

```tsx
const fetcher = useDataFetcher({
  defaultGraphQLEndpoint: 'https://my-graphql-api.com/graphql',
  defaultHeaders: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
  onError: error => {
    console.error('API Error:', error);
    // Send to monitoring service
  },
  onSuccess: data => {
    console.log('API Success:', data);
    // Analytics tracking
  },
});
```

## Specialized Service Hooks

### Contacts API (`useContactsAPI`)

A specialized hook for managing contact data through GraphQL:

```tsx
import { useContactsAPI } from '../services/contactServices';

const ContactsComponent = () => {
  const contactsAPI = useContactsAPI();

  const loadContacts = async () => {
    const contacts = await contactsAPI.getContacts(
      { consent: true }, // filter
      { field: 'name', order: 'ASC' }, // sort
      { page: 1, limit: 10 }, // pagination
    );
  };

  const addNewContact = async () => {
    const newContact = await contactsAPI.addContact({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      subject: 'Inquiry',
      message: 'Hello!',
      consent: true,
    });
  };

  return (
    <div>
      {contactsAPI.loading && <p>Loading contacts...</p>}
      {contactsAPI.error && <p>Error: {contactsAPI.error.message}</p>}

      <button onClick={loadContacts}>Load Contacts</button>
      <button onClick={addNewContact}>Add Contact</button>
    </div>
  );
};
```

### Weather API (`useWeatherAPI`)

A specialized hook for fetching weather data:

```tsx
import { useWeatherAPI } from '../services/weatherService';

const WeatherComponent = () => {
  const { fetchWeather, data, loading, error } = useWeatherAPI();

  const getWeather = async () => {
    const weather = await fetchWeather('London');
  };

  return (
    <div>
      {loading && <p>Loading weather...</p>}
      {error && <p>Weather error: {error.message}</p>}
      {data && (
        <div>
          <h3>{data.city}</h3>
          <p>
            {Math.round(data.temp)}°C - {data.description}
          </p>
          <img src={data.icon} alt={data.description} />
        </div>
      )}

      <button onClick={getWeather}>Get Weather</button>
    </div>
  );
};
```

## API Reference

### `useDataFetcher<T>(options?: UseDataFetcherOptions)`

#### Parameters

- `options` (optional): Configuration object
  - `defaultGraphQLEndpoint?: string` - Default GraphQL endpoint (default: 'http://localhost:4001/graphql')
  - `defaultHeaders?: Record<string, string>` - Default HTTP headers
  - `onError?: (error: ApiError) => void` - Error callback
  - `onSuccess?: <T>(data: T) => void` - Success callback
  - `retryAttempts?: number` - Number of retry attempts (default: 0)
  - `retryDelay?: number` - Delay between retries in ms (default: 1000)

#### Returns

Object with the following properties and methods:

##### State Properties

- `data: T | null` - The fetched data
- `loading: boolean` - Loading state
- `error: ApiError | null` - Error state

##### Methods

- `execute(config: RequestConfig): Promise<T | null>` - Execute a request
- `graphql(config: GraphQLConfig): Promise<T | null>` - GraphQL request
- `rest(config: RestConfig): Promise<T | null>` - REST request
- `get(url, params?, headers?): Promise<T | null>` - GET request
- `post(url, body?, headers?): Promise<T | null>` - POST request
- `put(url, body?, headers?): Promise<T | null>` - PUT request
- `delete(url, headers?): Promise<T | null>` - DELETE request
- `patch(url, body?, headers?): Promise<T | null>` - PATCH request
- `reset(): void` - Reset state

### Type Definitions

```tsx
interface ApiError {
  message: string;
  name: string;
  code?: string;
  details?: unknown;
}

interface GraphQLConfig {
  query: string;
  variables?: Record<string, unknown>;
  endpoint?: string;
}

interface RestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}
```

## Migration Guide

### From Axios to useDataFetcher

**Before:**

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await axios.get('/api/data');
    setData(response.data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

**After:**

```tsx
const { get, data, loading, error } = useDataFetcher();

const fetchData = async () => {
  await get('/api/data');
};
```

### From Custom GraphQL to useDataFetcher

**Before:**

```tsx
const graphqlRequest = async (query, variables) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
};
```

**After:**

```tsx
const { graphql } = useDataFetcher();

const fetchGraphQLData = async () => {
  const result = await graphql({ query, variables });
  return result;
};
```

## Testing

All hooks and services come with comprehensive test suites. See the test files for examples of how to mock and test the data fetching functionality:

- `src/hooks/useDataFetcher.test.tsx`
- `src/services/contactServices.test.tsx` (to be added)
- `src/services/weatherService.test.tsx`

## Demo Component

Check out the `APIDemo` component (`src/components/APIDemo.tsx`) for interactive examples of all the data fetching patterns.

## Best Practices

1. **Use specialized hooks** like `useContactsAPI` and `useWeatherAPI` when available
2. **Configure retry logic** for unreliable networks
3. **Implement proper error handling** with user-friendly error messages
4. **Use TypeScript generics** to get proper type checking for your data
5. **Reset state** when appropriate to prevent stale data issues
6. **Handle loading states** to improve user experience
