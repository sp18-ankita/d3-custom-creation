import React, { useState } from 'react';
import { useDataFetcher } from '../hooks/useDataFetcher';
import { useContactsAPI } from '../services/contactServices';
import { useWeatherAPI } from '../services/weatherService';

/**
 * Demo component showing different ways to use the data fetching hook
 */
export const APIDemo: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<'raw' | 'contacts' | 'weather'>('raw');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Data Fetching Hook Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setSelectedExample('raw')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: selectedExample === 'raw' ? '#007bff' : '#f8f9fa',
            color: selectedExample === 'raw' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Raw Hook Usage
        </button>
        <button
          onClick={() => setSelectedExample('contacts')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: selectedExample === 'contacts' ? '#007bff' : '#f8f9fa',
            color: selectedExample === 'contacts' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Contacts API
        </button>
        <button
          onClick={() => setSelectedExample('weather')}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedExample === 'weather' ? '#007bff' : '#f8f9fa',
            color: selectedExample === 'weather' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Weather API
        </button>
      </div>

      {selectedExample === 'raw' && <RawHookDemo />}
      {selectedExample === 'contacts' && <ContactsDemo />}
      {selectedExample === 'weather' && <WeatherDemo />}
    </div>
  );
};

/**
 * Demo of using the raw useDataFetcher hook directly
 */
const RawHookDemo: React.FC = () => {
  const fetcher = useDataFetcher({
    retryAttempts: 2,
    onError: error => console.error('API Error:', error),
    onSuccess: data => console.log('API Success:', data),
  });

  const handleRestCall = async () => {
    await fetcher.get('https://jsonplaceholder.typicode.com/posts/1');
  };

  const handleGraphQLCall = async () => {
    await fetcher.graphql({
      query: `
        query GetContacts($pagination: ContactsPagination) {
          contacts(pagination: $pagination) {
            contacts { id name email }
            total
          }
        }
      `,
      variables: { pagination: { page: 1, limit: 5 } },
    });
  };

  const handlePostCall = async () => {
    await fetcher.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1,
    });
  };

  return (
    <div>
      <h2>Raw Hook Usage Demo</h2>
      <p>
        This demonstrates direct usage of the useDataFetcher hook with different HTTP methods and
        GraphQL.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleRestCall}
          disabled={fetcher.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {fetcher.loading ? 'Loading...' : 'Fetch REST Data'}
        </button>

        <button
          onClick={handleGraphQLCall}
          disabled={fetcher.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {fetcher.loading ? 'Loading...' : 'Fetch GraphQL Data'}
        </button>

        <button
          onClick={handlePostCall}
          disabled={fetcher.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {fetcher.loading ? 'Loading...' : 'POST Data'}
        </button>

        <button onClick={fetcher.reset} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      {fetcher.error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <strong>Error:</strong> {fetcher.error.message}
        </div>
      )}

      {fetcher.data !== null && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}
        >
          <strong>Success:</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto' }}>
            {(() => {
              try {
                return typeof fetcher.data === 'string'
                  ? fetcher.data
                  : JSON.stringify(fetcher.data, null, 2);
              } catch {
                return 'Unable to display data';
              }
            })()}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Demo of using the contacts API service
 */
const ContactsDemo: React.FC = () => {
  const contactsAPI = useContactsAPI();

  const handleGetContacts = async () => {
    await contactsAPI.getContacts();
  };

  const handleGetContactsWithFilter = async () => {
    await contactsAPI.getContacts(
      { consent: true }, // filter
      { field: 'name', order: 'ASC' }, // sort
      { page: 1, limit: 3 }, // pagination
    );
  };

  const handleAddContact = async () => {
    await contactsAPI.addContact({
      name: 'Demo User',
      email: `demo-${Date.now()}@example.com`,
      phone: '1234567890',
      subject: 'Demo Contact',
      message: 'This is a demo contact created from the API demo.',
      consent: true,
    });
  };

  return (
    <div>
      <h2>Contacts API Demo</h2>
      <p>This demonstrates using the specialized contacts API hook.</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGetContacts}
          disabled={contactsAPI.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {contactsAPI.loading ? 'Loading...' : 'Get All Contacts'}
        </button>

        <button
          onClick={handleGetContactsWithFilter}
          disabled={contactsAPI.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {contactsAPI.loading ? 'Loading...' : 'Get Filtered Contacts'}
        </button>

        <button
          onClick={handleAddContact}
          disabled={contactsAPI.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {contactsAPI.loading ? 'Loading...' : 'Add Demo Contact'}
        </button>

        <button onClick={contactsAPI.reset} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      {contactsAPI.error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <strong>Error:</strong> {contactsAPI.error.message}
        </div>
      )}

      {contactsAPI.data !== null && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}
        >
          <strong>Success:</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto' }}>
            {(() => {
              try {
                return typeof contactsAPI.data === 'string'
                  ? contactsAPI.data
                  : JSON.stringify(contactsAPI.data, null, 2);
              } catch {
                return 'Unable to display data';
              }
            })()}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Demo of using the weather API service
 */
const WeatherDemo: React.FC = () => {
  const weatherAPI = useWeatherAPI();
  const [city, setCity] = useState('Bhubaneshwar');

  const handleFetchWeather = async () => {
    await weatherAPI.fetchWeather(city);
  };

  return (
    <div>
      <h2>Weather API Demo</h2>
      <p>This demonstrates using the specialized weather API hook.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{
            marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
          }}
        />

        <button
          onClick={handleFetchWeather}
          disabled={weatherAPI.loading}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {weatherAPI.loading ? 'Loading...' : 'Fetch Weather'}
        </button>

        <button onClick={weatherAPI.reset} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      {weatherAPI.error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <strong>Error:</strong> {weatherAPI.error.message}
        </div>
      )}

      {weatherAPI.data && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={weatherAPI.data.icon}
              alt={weatherAPI.data.description}
              width={50}
              height={50}
            />
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{weatherAPI.data.city}</h3>
              <p style={{ margin: '0' }}>
                {Math.round(weatherAPI.data.temp)}°C - {weatherAPI.data.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
