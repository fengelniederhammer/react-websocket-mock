import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { setupWorker } from 'msw/browser';
import { webSocketMock } from './webSocketMock/webSocketMock.ts';

export const worker = setupWorker(webSocketMock);

await worker.start({
    onUnhandledRequest: 'error',
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
