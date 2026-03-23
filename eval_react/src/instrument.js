import * as Sentry from "@sentry/react";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (sentryDsn) {
  const tracePropagationTargets = [/^\//];

  if (apiUrl) {
    tracePropagationTargets.push(apiUrl);
  }

  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    tracePropagationTargets,
    environment: import.meta.env.MODE,
  });
}
