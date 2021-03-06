import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import descriptor from './mocks/eventDescriptor';

const Fraudster = require('fraudster');

describe('lib/index', () => {
    let sandbox = sinon.createSandbox();;
    let fraudster:any;
    let clientFactory:any;
    let fakeApply:any;

    beforeEach(() => {
        fakeApply = sandbox.stub().resolves();

        const fake = class {
            apply = fakeApply;
        };

        fraudster = new Fraudster({
            warnOnUnregistered: false,
            errorOnUnregistered: false,
            warnOnReplace: false,
            errorOnReplace: false,
        });

        fraudster.registerMock('./HttpRequest', fake);
        fraudster.enable();
        clientFactory = require('./../../lib').default;
    });

    afterEach(() => {
        fraudster.deregisterMock('./HttpRequest');
        fraudster.disable();
        sandbox.restore();
    })

    it('should create an object with the same methods as the ones defined in the descriptor', () => {
        const client: any = clientFactory(descriptor);
        expect(client.listEventsByUserId).to.be.a('function');
        expect(client.getEventTypes).to.be.a('function');
        expect(client.addEvent).to.be.a('function');
        expect(client.login).to.be.a('function');
    });

    it.skip('should call the request performer sending request object and params', async () => {
        const client: any = clientFactory(descriptor);
        await client.addEvent({
            accessToken: 'abc',
            page: '3',
            type: 'fake',
            value: 'fake1'
        });

        expect(fakeApply.calledWithExactly({ 
            headers: { 
                Authorization: 'Bearer abc',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 21 
            },
            hostname: 'localhost',
            method: 'POST',
            path: '/api/event?page=3',
            port: 8081,
            protocol: 'http:'
        }, 'type=fake&value=fake1')).to.be.true;
    });

    it('should call the request performer sending request object and params using post', async () => {
        const client: any = clientFactory(descriptor);
        await client.login({
            userName: 'abc',
            password: 'fake1'
        });

        expect(fakeApply.calledWithExactly({ 
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            hostname: 'localhost',
            method: 'POST',
            path: '/api/login?username=abc&password=fake1',
            port: 8081,
            protocol: 'http:'
        }, '')).to.be.true;
    });
});
