const descriptor = {
    host: 'localhost',
    port: 8081,
    protocol: 'http:',
    actions: [
        {
            path:'/test/{id}',
            method: 'POST',
            name: 'addEvent',
            header: {
                authorization: 'Bearer {accessToken}'
            },
            params: {
                id: {
                    type: 'param',
                    alias: 'id-1'
                },
                name: {
                    type: 'body',
                    alias: 'name'
                },
                page: {
                    type: 'query',
                    alias: 'page'
                },
                token: {
                    type: 'header',
                    alias: 'accesToken'
                }
            }
        }
    ]
};

export default descriptor;