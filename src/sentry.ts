// Sentry configuration for React application
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://d992f2b7acab38e657e40b45ccfcca89@o4510044604858368.ingest.us.sentry.io/4510074726776832',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Performance Monitoring
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  // Session Replay
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.01 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

  environment: import.meta.env.MODE || 'development',
  debug: import.meta.env.MODE !== 'production',
});
