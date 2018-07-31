const descriptor = {
    host: 'localhost',
    port: 8081,
    protocol: 'http:',
    actions: [
        {
            name: 'listEventsByUserId',
            method: 'GET',
            path: '/api/event/{username}',
            header: {
                'Authorization': 'Bearer {accestoken}',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                accessToken: {
                    type: 'header',
                    alias: 'accestoken'
                },
                userName: {
                    type: 'param',
                    alias: 'username'
                },
                page: {
                    type: 'query',
                    alias: 'page'
                }
            }
        },
        {
            name: 'getEventTypes',
            method: 'GET',
            path: '/api/event_type',
            header: {
                'Authorization': 'Bearer {accestoken}',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                accessToken: {
                    type: 'header',
                    alias: 'accestoken'
                }
            }
        },
        {
            name: 'addEvent',
            method: 'POST',
            path: '/api/event',
            header: {
                'Authorization': 'Bearer {accestoken}',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                accessToken: {
                    type: 'header',
                    alias: 'accestoken'
                },
                page: {
                    type: 'query',
                    alias: 'page'
                },
                type: {
                    type: 'body',
                    alias: 'type'
                },
                value: {
                    type: 'body',
                    alias: 'value'
                }
            }
        }, 
        {
            name: 'login',
            method: 'POST',
            path: '/api/login',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                userName: {
                    type: 'query',
                    alias: 'username'
                },
                password: {
                    type: 'query',
                    alias: 'password'
                }
            }
        }
    ]
};

export default descriptor;
