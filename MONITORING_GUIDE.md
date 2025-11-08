# How to View Logs and Monitor Your Application

This guide explains how to view and analyze logs from the D3 Chart Viewer application using Sentry and LogRocket monitoring tools.

## 🛠️ Monitoring Tools Overview

### 1. **Sentry** - Error Monitoring & Performance Tracking

- **Purpose**: Real-time error tracking, performance monitoring, and release health
- **Data Collected**: JavaScript errors, network failures, performance metrics, user interactions
- **Best For**: Debugging crashes, monitoring app stability, performance optimization

### 2. **LogRocket** - Session Recording & User Experience

- **Purpose**: Session recording, user behavior analysis, and detailed debugging
- **Data Collected**: DOM interactions, network requests, console logs, user actions
- **Best For**: Understanding user behavior, reproducing bugs, UX analysis

## 🔗 Accessing Your Monitoring Dashboards

### Sentry Dashboard

1. **URL**: [https://sentry.io/organizations/your-org/](https://sentry.io/organizations/your-org/)
2. **Project**: `d3-custom-creation`
3. **Login**: Use your organization credentials

### LogRocket Dashboard

1. **URL**: [https://app.logrocket.com/](https://app.logrocket.com/)
2. **Project**: `your-app-id/your-project-name`
3. **Login**: Use your LogRocket account credentials

## 📊 Key Metrics to Monitor

### Sentry Metrics

- **Error Rate**: Percentage of sessions with errors
- **Performance Score**: Page load times and transaction durations
- **Release Health**: Crash-free sessions and adoption rates
- **User Impact**: Number of users affected by issues

### LogRocket Metrics

- **Session Quality**: User experience scores
- **Rage Clicks**: Frustrated user interactions
- **Dead Clicks**: Clicks that don't register
- **Console Errors**: JavaScript errors captured in sessions

## 🔍 How to Investigate Issues

### 1. **Error Investigation Workflow**

#### In Sentry:

1. Go to **Issues** tab
2. Sort by **"Last Seen"** or **"Events"** to prioritize
3. Click on an issue to see:
   - Error details and stack trace
   - User context (browser, OS, location)
   - Breadcrumbs leading to the error
   - LogRocket session URL (in tags)

#### Follow up in LogRocket:

1. Copy the LogRocket session URL from Sentry
2. Watch the session recording to see what the user was doing
3. Review console logs and network requests
4. Check for UI/UX issues that may have led to the error

### 2. **Performance Investigation**

#### In Sentry:

1. Go to **Performance** tab
2. Look for slow transactions
3. Check **Web Vitals** for Core Web Vitals scores
4. Identify bottlenecks in specific pages:
   - Home/Dashboard (`AppContent`)
   - About page
   - Contact form

#### In LogRocket:

1. Filter sessions by **"Slow Pages"**
2. Watch recordings to see loading behavior
3. Check network tab for slow API calls
4. Review console for performance warnings

### 3. **User Experience Analysis**

#### Key Pages to Monitor:

- **Home/Dashboard** (`/`): Chart rendering, data input validation
- **About Page** (`/about`): Content loading, weather widget
- **Contact Form** (`/contacts/new`): Form validation, submission success

#### LogRocket Insights:

1. **Heatmaps**: See where users click most
2. **Funnels**: Track user journeys through forms
3. **Conversion Tracking**: Monitor successful form submissions
4. **Error Sessions**: Filter sessions with JavaScript errors

## 🚨 Setting Up Alerts

### Sentry Alerts

1. Go to **Alerts** → **Create Alert Rule**
2. Recommended alerts:
   - Error rate exceeds 5% for 5 minutes
   - New release has >10 errors in first hour
   - Performance degradation (P95 > 3 seconds)

### LogRocket Notifications

1. Go to **Settings** → **Notifications**
2. Set up alerts for:
   - Sessions with high rage click counts
   - Sessions with console errors
   - New error types detected

## 📱 Key Application Events Being Tracked

### User Actions Logged:

- **Page Views**: Home, About, Contact pages
- **Chart Interactions**: Type changes, data rendering
- **Form Interactions**: Validation failures, submissions
- **Navigation**: Page transitions
- **Errors**: JavaScript exceptions, network failures

### Performance Metrics:

- **Page Load Times**: Time to interactive for each page
- **Chart Render Time**: D3.js rendering performance
- **API Response Times**: Weather widget, contact form submissions
- **Memory Usage**: JavaScript heap size

## 🛠️ Debugging Common Issues

### 1. **Chart Rendering Failures**

- **Sentry**: Look for D3.js related errors
- **LogRocket**: Watch user's data input and chart interaction
- **Check**: JSON validation errors, missing data properties

### 2. **Contact Form Issues**

- **Sentry**: Form validation and submission errors
- **LogRocket**: User form filling behavior
- **Check**: Email uniqueness errors, required field validation

### 3. **Weather Widget Problems**

- **Sentry**: API call failures and network errors
- **LogRocket**: Loading states and error messages
- **Check**: API key validity, CORS issues

### 4. **Navigation Issues**

- **Sentry**: React Router errors
- **LogRocket**: User click patterns and page transitions
- **Check**: Route configuration, component mounting errors

## 📈 Monitoring Best Practices

### Daily Monitoring Checklist:

1. **Check Sentry Dashboard**:

   - Review new issues from last 24 hours
   - Monitor error rate trends
   - Check performance regression

2. **Review LogRocket Sessions**:

   - Watch 2-3 recent error sessions
   - Check user satisfaction scores
   - Look for UI/UX improvement opportunities

3. **Performance Review**:
   - Monitor Core Web Vitals
   - Check chart rendering performance
   - Review API response times

### Weekly Deep Dive:

1. **Trend Analysis**: Compare week-over-week metrics
2. **User Journey Analysis**: Review conversion funnels
3. **Release Impact**: Monitor error rates after deployments
4. **Feature Usage**: Track adoption of chart types and features

## 🔐 Data Privacy & Compliance

### Data Handling:

- **User PII**: Email addresses in contact forms are masked in LogRocket
- **Session Storage**: 30-day retention policy
- **Error Data**: Stack traces and user context stored securely
- **GDPR Compliance**: Users can request data deletion

### Security Measures:

- **Environment Variables**: DSN keys stored securely
- **Network Security**: HTTPS-only data transmission
- **Access Control**: Role-based access to monitoring dashboards

## 📞 Support & Escalation

### When to Escalate:

- Error rate > 10% for more than 15 minutes
- New critical errors affecting >100 users
- Performance degradation > 50% increase in load times
- Security-related errors or suspicious activity

### Escalation Process:

1. **Document**: Screenshots from both Sentry and LogRocket
2. **Provide Context**: User session URLs, error IDs
3. **Include Timeline**: When issue started, frequency
4. **Add Impact**: Number of users affected

## 🔗 Useful Links

- [Sentry Documentation](https://docs.sentry.io/)
- [LogRocket Documentation](https://docs.logrocket.com/)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [Web Vitals Guide](https://web.dev/vitals/)

---

## 📝 Configuration Details

### Environment Setup:

```bash
# Production Environment
SENTRY_DSN=https://d992f2b7acab38e657e40b45ccfcca89@o4510044604858368.ingest.us.sentry.io/4510074726776832
LOGROCKET_APP_ID=your-app-id/your-project-name

# Development Environment
SENTRY_DEBUG=true
SENTRY_SAMPLE_RATE=1.0
LOGROCKET_SAMPLE_RATE=1.0
```

### Integration Points:

- **Main App**: `src/monitoring.ts` - Central configuration
- **Error Boundaries**: `src/components/ErrorBoundary.tsx`
- **User Identification**: `src/hooks/useUserIdentification.ts`
- **Page Tracking**: Each major component has `logPageView()` calls
- **User Action Tracking**: Form submissions, navigation, chart interactions

---

_Last Updated: October 2025_
_Version: 1.0_
