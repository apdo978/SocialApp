import { Server } from 'http';
import { SocketService } from './socket.service';

// WebSocket context to make it available throughout the application
let socketInstance: SocketService | null = null;

export const initializeSocket = (server: Server) => {
    socketInstance = new SocketService(server);
    
    return socketInstance;
};

export const getSocketInstance = () => {
    if (!socketInstance) {
        throw new Error('Socket.IO has not been initialized');
    }
    return socketInstance;
};
