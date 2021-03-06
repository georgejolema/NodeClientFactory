import 'mocha';
import { expect } from 'chai';
import RequestBuilder from './../../lib/RequestBuilder';
import descriptor from './mocks/eventDescriptor';
import { ParamType } from '../../lib/enum';

describe('lib/RequestBuilder', () => {
    let requestBuilder: RequestBuilder;
    beforeEach(() => {
        requestBuilder = new RequestBuilder('10.10.10.10', 8081);
    });

    it('should generate a request object when the proper params are passeed' , () => {
        const firstMethod = descriptor.actions[0];
        requestBuilder.setMethod(firstMethod.method)
            .setPath(firstMethod.path);

        requestBuilder.Header.append(firstMethod.header);
        requestBuilder.Params.append(firstMethod.params);
        const requestObject = requestBuilder.createRequestOptions({
            accessToken: 'abc',
            userName: 'fake_user',
            page: '1'
        });

        expect(requestObject.request).to.be.deep.equal({
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            hostname: '10.10.10.10',
            method: 'GET',
            path: '/api/event/fake_user?page=1',
            port: 8081,
            protocol: 'http:'
        });
    });

    it('should avoid adding query parameters if there are no querystring', () => {
        const firstMethod = descriptor.actions[0];
        requestBuilder.setMethod(firstMethod.method)
            .setPath(firstMethod.path);

        requestBuilder.Header.append(firstMethod.header);
        requestBuilder.Params.append(firstMethod.params);
        const requestObject = requestBuilder.createRequestOptions({
            accessToken: 'abc',
            userName: 'fake_user'
        });

        expect(requestObject.request).to.be.deep.equal({
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            hostname: '10.10.10.10',
            method: 'GET',
            path: '/api/event/fake_user',
            port: 8081,
            protocol: 'http:'
        });
    });

    it('should store the body params as querystring if the call turns out to be non-get and the header application/x-www-form-urlencoded', () => {
        const firstMethod = descriptor.actions[2];
        requestBuilder.setMethod(firstMethod.method)
            .setPath(firstMethod.path);

        requestBuilder.Header.append(firstMethod.header);
        requestBuilder.Params.append(firstMethod.params);
        const requestObject = requestBuilder.createRequestOptions({
            accessToken: 'abc',
            page: '190',
            type: 'asdf',
            value: '78'
        });

        expect(requestObject.request).to.be.deep.equal({
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded',
                "Content-Length": 18
            },
            hostname: '10.10.10.10',
            method: 'POST',
            path: '/api/event?page=190',
            port: 8081,
            protocol: 'http:'
        });

        expect(requestObject.body).to.be.equal('type=asdf&value=78');
    });

    it('should store the body params as querystring if the call turns out to be non-get and the header application/json', () => {
        const firstMethod = descriptor.actions[2];
        requestBuilder.setMethod(firstMethod.method)
            .setPath(firstMethod.path);

        requestBuilder.Header.append(Object.assign(firstMethod.header, { 'Content-Type': 'application/json' }));
        requestBuilder.Params.append(firstMethod.params);
        const requestObject = requestBuilder.createRequestOptions({
            accessToken: 'abc',
            page: '190',
            type: 'asdf',
            value: '78'
        });

        expect(requestObject.request).to.be.deep.equal({
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/json',
                "Content-Length": 28
            },
            hostname: '10.10.10.10',
            method: 'POST',
            path: '/api/event?page=190',
            port: 8081,
            protocol: 'http:'
        });

        expect(requestObject.body).to.be.equal(JSON.stringify({ type:'asdf', value: '78' }));
    });

    it('should store the body params as querystring if the call turns out to be non-get and no content-type header', () => {
        const firstMethod = descriptor.actions[2];
        requestBuilder.setMethod(firstMethod.method)
            .setPath(firstMethod.path);

        requestBuilder.Header.append({
            Authorization: firstMethod.header.Authorization
        });

        requestBuilder.Params.append(firstMethod.params);
        const requestObject = requestBuilder.createRequestOptions({
            accessToken: 'abc',
            page: '190',
            type: 'asdf',
            value: '78'
        });

        expect(requestObject.request).to.be.deep.equal({
            headers: {
                Authorization: 'Bearer abc',
                "Content-Length": 28
            },
            hostname: '10.10.10.10',
            method: 'POST',
            path: '/api/event?page=190',
            port: 8081,
            protocol: 'http:'
        });

        expect(requestObject.body).to.be.equal(JSON.stringify({ type:'asdf', value: '78' }));
    });
});
