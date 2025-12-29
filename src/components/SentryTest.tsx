import * as Sentry from '@sentry/react';
import React from 'react';
import ErrorButton from './ErrorButton';

const SentryTest: React.FC = () => {
  const testSentryCapture = () => {
    try {
      // This function doesn't exist and will throw an error
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      foo();
    } catch (e) {
      Sentry.captureException(e);
      alert('Error captured and sent to Sentry successfully!');
    }
  };

  const testSentryThrow = () => {
    // This will be caught by the Sentry Error Boundary
    throw new Error('This is a test error for Sentry Error Boundary!');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '5px' }}>
      <h3>Sentry Testing</h3>
      <p>Use these buttons to test Sentry error capturing:</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={testSentryCapture}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Test Manual Capture
        </button>
        <button
          onClick={testSentryThrow}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Test Error Boundary
        </button>
        <ErrorButton />
      </div>
      <small style={{ display: 'block', marginTop: '10px', color: '#666' }}>
        Manual Capture: Catches error and manually sends to Sentry
        <br />
        Error Boundary: Throws uncaught error for Error Boundary to handle
        <br />
        Break the world: Official Sentry test button (throws "This is your first error!")
      </small>
    </div>
  );
};

export default SentryTest;
