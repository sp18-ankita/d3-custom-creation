import './monitoring.ts';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LDProvider } from 'launchdarkly-react-client-sdk';
import App from './App.tsx';
import './index.css';

// A "context" is a data object representing users, devices, organizations, and other entities.
// You'll need this later, but you can ignore it for now.
const context = {
  kind: 'user',
  key: 'user-key-123abcde',
  email: 'biz@face.dev',
};

// The clientSideID is your SDK key.
// This value is automatically retrieved from LaunchDarkly.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LDProvider clientSideID="690822ed438bfd09a7dc7bfb" context={context}>
      <App />
    </LDProvider>
  </StrictMode>,
);
