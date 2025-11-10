// Sentry-only monitoring configuration for React application
import * as Sentry from '@sentry/react';

// Initialize Sentry with comprehensive monitoring
Sentry.init({
  dsn:
    import.meta.env.VITE_SENTRY_DSN ||
    'https://d992f2b7acab38e657e40b45ccfcca89@o4510044604858368.ingest.us.sentry.io/4510074726776832',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Enable Sentry's own session replay
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true, // Mask sensitive form inputs
    }),
    Sentry.feedbackIntegration({
      // Optional: Add user feedback widget
      colorScheme: 'system',
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: parseFloat(
    import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ||
      (import.meta.env.MODE === 'production' ? '0.1' : '1.0'),
  ),

  // Session Replay - Higher rates since we're not using LogRocket
  replaysSessionSampleRate: parseFloat(
    import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ||
      (import.meta.env.MODE === 'production' ? '0.1' : '1.0'),
  ),
  replaysOnErrorSampleRate: parseFloat(
    import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0',
  ),

  // Enhanced error tracking
  sendDefaultPii: true,
  attachStacktrace: true,

  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development',
  debug: import.meta.env.MODE !== 'production',

  beforeSend(event) {
    // Add additional context to events
    if (event.tags) {
      event.tags.monitoringTool = 'sentry-only';
    } else {
      event.tags = { monitoringTool: 'sentry-only' };
    }
    return event;
  },
});

// Utility functions for custom logging (Sentry-only)
export const logPageView = (pageName: string, additionalData?: Record<string, unknown>) => {
  // Log page view as breadcrumb
  Sentry.addBreadcrumb({
    message: `Page viewed: ${pageName}`,
    level: 'info',
    data: additionalData,
    category: 'navigation',
  });

  // Also track as custom event
  Sentry.captureMessage(`Page View: ${pageName}`, {
    level: 'info',
    tags: { eventType: 'pageView', page: pageName },
    extra: additionalData,
  });
};

export const logUserAction = (action: string, data?: Record<string, unknown>) => {
  Sentry.addBreadcrumb({
    message: `User action: ${action}`,
    level: 'info',
    data,
    category: 'user',
  });

  // For important actions, also create events
  if (action.includes('Submit') || action.includes('Error') || action.includes('Failed')) {
    Sentry.captureMessage(`User Action: ${action}`, {
      level: action.includes('Error') || action.includes('Failed') ? 'warning' : 'info',
      tags: { eventType: 'userAction', action },
      extra: data,
    });
  }
};

export const logError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, {
    tags: { ...context, errorSource: 'manual' },
    level: 'error',
  });
};

// Enhanced user identification for Sentry
export const identifyUser = (userId?: string, userEmail?: string, userName?: string) => {
  Sentry.setUser({
    id: userId || `anonymous_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: userEmail,
    username: userName || 'Anonymous User',
  });
};

// Performance monitoring helpers
export const measurePerformance = async <T>(
  name: string,
  operation: () => Promise<T> | T,
  additionalTags?: Record<string, string>,
): Promise<T> => {
  return Sentry.startSpan(
    {
      name,
      op: 'function',
      attributes: additionalTags,
    },
    async () => {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        logError(error as Error, { operationName: name });
        throw error;
      }
    },
  );
};
