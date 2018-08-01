import { MapRequest, ParamDescriptor } from './types';
import RequestCollection from './utils/RequestCollection';
import RequestParser from './utils/RequestParser';
import queryString from 'querystring';
import { ParamType } from './enum';

export default class RequestBuilder {
    protected params: RequestCollection<ParamDescriptor>;
    protected method: string;
    protected path: string;
    protected protocol: string;
    protected header: RequestCollection<string>;

    constructor(protected host: string, protected port: number) {
        this.header = new RequestCollection();
        this.params = new RequestCollection();
        this.method = 'GET';
        this.path = '/';
        this.protocol = 'http:';
    }

    public get Params() {
        return this.params;
    }

    public get Header() {
        return this.header;
    }

    public setMethod(method: string) {
        this.method = method;
        return this;
    }

    public setPath(path: string) {
        this.path = path;
        return this;
    }


    public createRequestOptions(params: MapRequest<string>) {
        const parser = new RequestParser();
        // compile header
        const headerCollection = this.params.filter((param) => param.type === ParamType.HEADER);
        const headerPair = parser.pairConfigDefinition(headerCollection, params);
        const rawRequestHeader = parser.replaceValue(headerPair, JSON.stringify(this.header.collection));
        // compile params
        const paramsCollection = this.params.filter((param) => param.type === ParamType.PARAM);
        const paramsPair = parser.pairConfigDefinition(paramsCollection, params);
        let path = parser.replaceValue(paramsPair, this.path);
        // compile query
        const queryCollection = this.params.filter((param) => param.type === ParamType.QUERY);
        const queryPair = parser.pairConfigDefinition(queryCollection, params);
        const query = queryString.stringify(queryPair);

        if (query) {
            path += '?' + query;
        }
        // compile body
        const bodyCollection = this.Params.filter((param) => param.type === ParamType.BODY);
        const body = queryString.stringify(parser.pairConfigDefinition(bodyCollection, params));

        // edit header
        
        const headers = <MapRequest<string | number>>JSON.parse(rawRequestHeader);
        if (this.method !== 'GET' && body != '') {
            headers['Content-Length'] = Buffer.byteLength(body);
        }       

        const request = {
            headers,
            hostname: this.host,
            method: this.method,
            path: path,
            port: this.port,
            protocol: this.protocol,
        };

        return { request, body };
    }

}
