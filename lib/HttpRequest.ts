import http from 'http';
import { Request } from './types';

export default class HttpRequest {
    apply(options: Request, body: string = ''): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const httpReq = http.request(options, (httpRes) => {
                let rawBody = '';

                httpRes.on('data', (data) => {
                    rawBody += data;
                });

                httpRes.on('end', () => {
                    const statusCode = httpRes.statusCode || 500;

                    if (statusCode < 400 || statusCode > 600) {
                        resolve({
                            value: rawBody,
                            code: httpRes.statusCode,
                            message: ''
                        });
                    } else {
                        reject({
                            value: rawBody,
                            code: httpRes.statusCode,
                            message: 'error'
                        });
                    }
                });               
            });

            httpReq.on('error', (e) => {
                reject(e.message);
            });

            if (options.method !== 'GET' && body) {
                httpReq.write(body);
            }

            httpReq.end();
        });
    }
}
