# How to View Logs and Monitor Your Application (Sentry-Only)

This guide explains how to view and analyze logs from the D3 Chart Viewer application using Sentry's comprehensive monitoring platform.

## 🛠️ Monitoring Overview

### **Sentry** - Complete Application Monitoring

- **Error Tracking**: Real-time error tracking with stack traces
- **Performance Monitoring**: Page load times, transaction durations, Core Web Vitals
- **Session Replay**: Visual recordings of user sessions
- **User Analytics**: Custom events and user behavior tracking
- **Release Tracking**: Monitor deployment health and error rates

## 🔗 Accessing Your Sentry Dashboard

1. **URL**: [https://sentry.io/organizations/your-org/](https://sentry.io/organizations/your-org/)
2. **Project**: `d3-custom-creation`
3. **Login**: Use your organization credentials

## 📊 Key Sentry Features for Your App

### 1. **Issues & Error Tracking**

- **Real-time Errors**: JavaScript exceptions, network failures
- **Error Context**: User info, browser details, breadcrumbs
- **Stack Traces**: Detailed error location with source maps
- **Error Grouping**: Similar errors grouped for easy management

### 2. **Performance Monitoring**

- **Page Load Performance**: First Paint, LCP, FID, CLS
- **Transaction Tracking**: Chart rendering, form submissions
- **Network Monitoring**: API call performance (weather widget)
- **Core Web Vitals**: Google's performance metrics

### 3. **Session Replay**

- **Visual Recordings**: See exactly what users experienced
- **DOM Interactions**: Click, scroll, input events
- **Console Logs**: JavaScript errors and warnings
- **Network Activity**: API calls and responses

### 4. **Custom Events & Analytics**

- **Page Views**: Home, About, Contact pages
- **User Actions**: Chart interactions, form submissions
- **Performance Metrics**: Custom timing measurements
- **Business Events**: Conversion tracking

## 🔍 How to Investigate Issues

### 1. **Error Investigation Workflow**

#### Step 1: Identify Critical Issues

1. Go to **Issues** tab in Sentry
2. Sort by **"Priority"** or **"Event Count"**
3. Look for issues affecting multiple users
4. Check error trends over time

#### Step 2: Analyze Error Details

1. Click on an issue to see:
   - **Error message and stack trace**
   - **User context** (browser, OS, user ID)
   - **Breadcrumbs** (user actions leading to error)
   - **Tags and context** (page, chart type, etc.)

#### Step 3: Watch Session Replay

1. Click on **"Session Replay"** tab in the issue
2. Watch the user session to see:
   - What the user was doing before the error
   - UI state when error occurred
   - User interaction patterns

### 2. **Performance Investigation**

#### Monitor Core Web Vitals:

1. Go to **Performance** → **Web Vitals**
2. Check scores for:
   - **LCP (Largest Contentful Paint)**: Chart loading speed
   - **FID (First Input Delay)**: Interaction responsiveness
   - **CLS (Cumulative Layout Shift)**: Visual stability

#### Analyze Slow Transactions:

1. Go to **Performance** → **Transactions**
2. Sort by **P95 Duration** to find slow pages
3. Focus on key pages:
   - `/` (Home/Dashboard)
   - `/about` (About page)
   - `/contacts/new` (Contact form)

#### Debug Chart Performance:

1. Look for custom measurements in transaction details
2. Check for D3.js rendering performance
3. Monitor data parsing and validation times

### 3. **User Experience Analysis**

#### Track User Journeys:

1. Go to **Discover** → **Query Builder**
2. Filter by **Event Type**: "Page View"
3. Analyze user navigation patterns
4. Monitor conversion funnels (contact form completion)

#### Monitor Feature Usage:

1. Create custom queries for:
   - Chart type selection frequency
   - Custom data usage vs. default data
   - Form completion rates
   - Error rates by page

## 🚨 Setting Up Alerts

### Recommended Alert Rules:

1. **High Error Rate**: Error rate > 5% for 5 minutes
2. **Performance Degradation**: P95 > 3 seconds for key pages
3. **New Issues**: Any new error type detected
4. **Release Monitoring**: Error spike after deployment

### Creating Alerts:

1. Go to **Alerts** → **Create Alert Rule**
2. Choose trigger conditions
3. Set notification channels (email, Slack, etc.)
4. Configure alert sensitivity

## 📱 Key Events Being Tracked

### Automatic Tracking:

- **JavaScript Exceptions**: All unhandled errors
- **Performance Metrics**: Page loads, transactions
- **User Sessions**: Session replay for error cases
- **Network Requests**: API calls and responses

### Custom Events:

- **Page Views**: `logPageView()` calls with context
- **User Actions**: `logUserAction()` for interactions
- **Form Events**: Validation, submission, errors
- **Chart Interactions**: Rendering, data changes
- **Navigation**: Page transitions with context

## 🛠️ Debugging Specific App Features

### 1. **Chart Rendering Issues**

**Sentry Shows**: D3.js errors, data parsing failures
**Look For**:

- JSON validation errors in breadcrumbs
- Custom data vs. default data usage
- Chart type selection patterns
- Performance of different chart types

### 2. **Contact Form Problems**

**Sentry Shows**: Validation errors, submission failures
**Look For**:

- Form field validation patterns
- Email uniqueness errors
- Submission success rates
- User abandonment points

### 3. **Weather Widget Issues**

**Sentry Shows**: API failures, network errors
**Look For**:

- OpenWeatherMap API response times
- Network connectivity issues
- Location-based error patterns

### 4. **Navigation & Routing**

**Sentry Shows**: React Router errors, component mounting issues
**Look For**:

- Page transition errors
- Component lifecycle issues
- URL parsing problems

## 📈 Monitoring Best Practices

### Daily Monitoring:

1. **Check Sentry Dashboard** (5 minutes)

   - Review issues from last 24 hours
   - Monitor error rate trends
   - Check performance alerts

2. **Review Session Replays** (10 minutes)
   - Watch 2-3 recent error sessions
   - Look for UX improvement opportunities
   - Understand user behavior patterns

### Weekly Analysis:

1. **Performance Review**:

   - Compare week-over-week Core Web Vitals
   - Analyze transaction performance trends
   - Review chart rendering performance

2. **Feature Usage Analysis**:

   - Track chart type popularity
   - Monitor form completion rates
   - Analyze user journey patterns

3. **Error Pattern Analysis**:
   - Identify recurring issues
   - Monitor error resolution effectiveness
   - Plan preventive measures

## 🔐 Data Privacy & Security

### Data Handling:

- **PII Protection**: Form inputs are masked in session replays
- **Data Retention**: 30-day retention on free tier
- **GDPR Compliance**: User data deletion available
- **Security**: HTTPS-only data transmission

## 📞 Support & Escalation

### Escalation Triggers:

- Error rate > 10% for 15+ minutes
- Critical errors affecting >50 users
- Performance degradation > 100% increase
- New security-related errors

### Documentation:

- Screenshot Sentry error details
- Include session replay URLs
- Provide user context and timeline
- Note deployment correlation

## 🔗 Helpful Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Performance Monitoring Best Practices](https://docs.sentry.io/product/performance/)

---

## 📝 Sentry-Only Configuration

Your application now uses **Sentry exclusively** for:

- ✅ **Error Tracking** with enhanced context
- ✅ **Performance Monitoring** with Core Web Vitals
- ✅ **Session Replay** with user interaction tracking
- ✅ **Custom Event Tracking** for business metrics
- ✅ **User Feedback** integration for better support

### Benefits:

- **Simplified Setup**: One dashboard for everything
- **Cost Effective**: Generous free tier, predictable pricing
- **Complete Coverage**: All monitoring needs in one place
- **Better Performance**: Smaller bundle size (-14kB)
- **Easier Maintenance**: Single integration to manage

---

_Last Updated: October 2025_
_Version: 2.0 - Sentry-Only Edition_
