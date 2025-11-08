# Sentry-Only Monitoring Configuration Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://d992f2b7acab38e657e40b45ccfcca89@o4510044604858368.ingest.us.sentry.io/4510074726776832
VITE_SENTRY_ENVIRONMENT=development

# Optional: Override default sampling rates
# VITE_SENTRY_TRACES_SAMPLE_RATE=1.0
# VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=1.0
# VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
```

## Setup Instructions

1. **Sentry Configuration**:

   - The DSN is already configured for your project
   - Set appropriate environment (development/production)
   - No additional setup required

2. **Test Configuration**:
   - Run the application
   - Check browser console for Sentry initialization
   - Verify no configuration errors

## Production Settings

For production deployment, the monitoring configuration in `src/monitoring.ts` automatically adjusts:

```typescript
// Production settings (automatically applied)
tracesSampleRate: 0.1; // 10% of transactions
replaysSessionSampleRate: 0.1; // 10% of sessions
replaysOnErrorSampleRate: 1.0; // 100% of error sessions
```

## Features Included

### ✅ Comprehensive Error Tracking

- JavaScript exceptions with stack traces
- Component-level error boundaries
- User context and breadcrumbs

### ✅ Performance Monitoring

- Page load times and Core Web Vitals
- Chart rendering performance
- API response times

### ✅ Session Replay

- Visual session recordings
- User interaction tracking
- DOM state capture

### ✅ User Analytics

- Page view tracking
- User action logging
- Navigation patterns

## Benefits of Sentry-Only Setup

- **Simplified Configuration**: One tool, one dashboard
- **Cost Effective**: Generous free tier, predictable pricing
- **Complete Coverage**: All monitoring needs in one platform
- **Better Performance**: Smaller bundle size
- **Easier Maintenance**: Single integration to manage
