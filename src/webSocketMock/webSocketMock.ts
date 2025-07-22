import { ws } from 'msw';

const webSocketLink = ws.link('ws://localhost:3001');

export const webSocketMock = webSocketLink.addEventListener('connection', ({ client }) => {
    let intervalId: number = 0;
    let messageId = 1;

    client.addEventListener('message', () => {
        intervalId = window.setInterval(() => {
            const message = {
                id: messageId++,
                timestamp: new Date().toISOString(),
                data: `Sample data ${messageId - 1}`,
                type: 'stream_data',
            };

            client.send(JSON.stringify(message));
        }, 2000);
    });

    client.addEventListener('close', () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }
    });
});
