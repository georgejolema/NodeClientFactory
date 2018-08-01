import { MapRequest } from './Map';
import http from 'http';

export interface Request {
    protocol: string;
    host?: string;
    hostName?: string;
    family?: number;
    port: number;
    localAddress?: string;
    socketPath?: string;
    method: string;
    path: string;
    headers: MapRequest<string | number>;
    auth?: string;
    agent?: http.Agent | undefined;
    timeout?: number;
}