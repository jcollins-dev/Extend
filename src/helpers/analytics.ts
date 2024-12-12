import { AnalyticsCategories, AnalyticsEventTypes } from 'constants/analytics';

import ReactGA from 'react-ga4';
import { User } from 'types';

export interface AnalyticsEvent {
  category: AnalyticsCategories;
  action: AnalyticsEventTypes;
  label?: string | undefined;
  value?: number | undefined;
}

// static setup
const googleMeasurementID = process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;
const googleAnalyticsEnabled = Boolean(process.env.REACT_APP_ENABLE_GOOGLE_ANALYTICS);
let analyticsPreference: boolean;
export function analyticsEnabled(): boolean {
  return googleMeasurementID !== undefined && googleAnalyticsEnabled && analyticsPreference;
}

export function enableAnalyticsForUser(user: User): void {
  analyticsPreference = user.preferences && user.preferences['analytics'] === true;
  if (analyticsPreference && googleMeasurementID !== undefined) {
    console.log('Starting advanced analytics collection based on user preference');
    ReactGA.initialize(googleMeasurementID);
  } else {
    console.log('Advanced analytics disabled based on user preferences');
    ReactGA.reset();
  }
}

// undefined check not strictly necessary but typescript forbids a non-null assertion
if (analyticsEnabled() && googleMeasurementID !== undefined) {
  ReactGA.initialize(googleMeasurementID);
} else if (!googleAnalyticsEnabled) {
  console.warn('Google analytics is disabled. No user data will be tracked.');
}

// Wrapper around the event generation call to control the inputs
export function generateAnalyticsEvent(event: AnalyticsEvent): void {
  if (analyticsEnabled()) {
    ReactGA.event(event);
  } else if (googleMeasurementID === undefined) {
    console.warn('Failed to log analytics event! Google measurement ID was not set.');
  }
  // fail silently if google analytics disabled
}

export const generateAnalyticsPageView = (pagePath: string): void => {
  if (analyticsEnabled()) {
    ReactGA.send({ hitType: 'pageview', page: pagePath });
  } else if (googleMeasurementID === undefined) {
    console.warn('Failed to log analytics page view! Google measurement ID was not set.');
  }
};
