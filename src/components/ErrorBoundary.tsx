import * as Sentry from '@sentry/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '../monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  pageName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    logError(error, {
      page: this.props.pageName,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    Sentry.withScope(scope => {
      scope.setTag('errorBoundary', this.props.pageName);
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.pageName,
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '20px',
            margin: '20px',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#fff5f5',
            color: '#c92a2a',
          }}
        >
          <h2>⚠️ Something went wrong on {this.props.pageName}</h2>
          <p>We've been notified of this error and are working to fix it.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Technical Details</summary>
            <pre
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
