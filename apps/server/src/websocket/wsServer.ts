import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { WebSocketMessage } from '@qagent/shared';

export class ExecutionWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  public init(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      // Send initial connection ack
      ws.send(
        JSON.stringify({
          event: 'connected',
          data: { message: 'QAgent WebSocket streaming connected', timestamp: new Date().toISOString() },
        })
      );

      ws.on('message', (message: string) => {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          }
        } catch (e) {
          // ignore malformed
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', () => {
        this.clients.delete(ws);
      });
    });
  }

  public broadcast<T = any>(event: WebSocketMessage['event'], data: T) {
    const payload: WebSocketMessage<T> = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };
    const json = JSON.stringify(payload);

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const wsServer = new ExecutionWebSocketServer();
