// Import with ESM syntax since we're using "type": "module"
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://d992f2b7acab38e657e40b45ccfcca89@o4510044604858368.ingest.us.sentry.io/4510074726776832",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  
  // Set sample rate for performance monitoring (optional)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Set the environment
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV !== 'production',
});
