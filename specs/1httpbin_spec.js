var frisby = require('icedfrisby');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

frisby.globalSetup({
    request: {
        //proxy: 'http://127.0.0.1:8888',
        followRedirect: false
    }
})

frisby.create('httpbin will redirect me')
    .get('http://httpbin.org/redirect-to?url=http%3A%2F%2Fexample.com%2F')
    .expectStatus(302)
.toss()

frisby.create('httpbin will contain an awesome dan')
    .get('http://httpbin.org/response-headers?dan=awesome')
    .expectHeader('dan','awesome')
.toss()
