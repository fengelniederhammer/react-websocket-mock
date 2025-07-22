import { ws } from 'msw';

const webSocketLink = ws.link('ws://localhost:3001');

export const webSocketMock = webSocketLink.addEventListener('connection', ({ client }) => {
    let intervalId: number = 0;
    let messageId = 1;

    intervalId = window.setInterval(() => {
        const message = {
            id: messageId++,
            timestamp: new Date().toISOString(),
            data: `Sample data ${messageId - 1}`,
            type: 'stream_data',
        };

        client.send(JSON.stringify(message));
    }, 2000);

    client.addEventListener('message', (event) => {
        try {
            const request = JSON.parse(event.data as string);

            if (request.type === 'get_details' && request.id) {
                const response = {
                    id: request.id,
                    type: 'details_response',
                    details: `Detailed information for object ${request.id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                    timestamp: new Date().toISOString()
                };

                client.send(JSON.stringify(response));
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    })

    client.addEventListener('close', () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }
    });
});
