import 'mocha';
import HttpRequest from '../../lib/HttpRequest';
import { expect } from 'chai';
import queryString from 'querystring';

const nock = require('nock');

describe('/lib/HttpRequest', () => {
    let request: HttpRequest;
    let mock:any;

    beforeEach(() => {
        request = new HttpRequest();
    });

    describe('GET requests', () => {
        const requestMock = {
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            host: 'localhost',
            method: 'GET',
            path: '/api/event/fake_user?page=1',
            port: 8081,
            protocol: 'http:',
            setHost: true
        };

        describe('successful scenario', () => {
            before(() => {
                mock = nock('http://localhost:8081')
                    .get('/api/event/fake_user')
                    .query({
                        page: '1'
                    })
                    .reply(200, 'hello');
            });
        
            after(() => {
                mock.isDone();
            });

            it('should return a promise', (done) => {
                request.apply(requestMock).then((response) => {
                    expect(response).to.be.deep.equal({
                        value: 'hello',
                        code: 200,
                        message: ''
                    });
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });     

        describe('failing event', () => {
            before(() => {
                mock = nock('http://localhost:8081')
                    .get('/api/event/fake_user')
                    .query({
                        page: '1'
                    })
                    .reply(500, 'internal error');
            });
        
            after(() => {
                mock.isDone();
            });

            it('should return a promise', (done) => {
                request.apply(requestMock).catch((response) => {
                    expect(response).to.be.deep.equal({
                        value: '',
                        code: 500,
                        message: 'error'
                    });
                    done();
                });
            });
        });        
    });

    describe('POST requests', () => {
        const requestMock = {
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            host: 'localhost',
            method: 'POST',
            path: '/api/event?page=1',
            port: 8081,
            protocol: 'http:',
            setHost: true
        };

        describe('successful scenario', () => {
            before(() => {
                mock = nock('http://localhost:8081')
                    .post('/api/event', { type: 'asdf', value: '78'})
                    .query({
                        page: '1'
                    })
                    .reply(200, 'hello');
            });
        
            after(() => {
                mock.isDone();
            });

            it('should return a promise', (done) => {
                request.apply(requestMock, queryString.stringify({ type: 'asdf', value: '78'}))
                    .then((response) => {
                        expect(response).to.be.deep.equal({
                            value: 'hello',
                            code: 200,
                            message: ''
                        });
                        done();
                    }).catch((err) => {
                        console.log(err);
                        done();
                    });
            });
        });        
    });

    describe('when replying an error', () => {
        const requestMock = {
            headers: {
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            host: 'localhost',
            method: 'GET',
            path: '/api/event/fake_user?page=1',
            port: 8081,
            protocol: 'http:',
            setHost: true
        };

        before(() => {
            mock = nock('http://localhost:8081')
            .get('/api/event/fake_user')
            .query({
                page: '1'
            })
            .replyWithError('something awful happened');
        });
    
        after(() => {
            mock.isDone();
        });

        it('should return a promise', () => {
            return request.apply(requestMock)
                .then((response) => {
                    console.log(response);
                }).catch((err) => {
                    expect(err).to.be.equal('something awful happened');
                });
        });
    });
});
