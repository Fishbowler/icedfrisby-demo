var frisby = require('icedfrisby');
var Joi = require('joi');
var secrets = require('../secrets.js');

var consumer_key = secrets.twitter_consumer_key;
var consumer_secret = secrets.twitter_consumer_secret;
var bearer_creds = consumer_key + ':' + consumer_secret;
var bearer_creds_base64 = (new Buffer(bearer_creds).toString('base64'));

var init_auth_header = 'Basic ' + bearer_creds_base64;

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

frisby.globalSetup({
    request: {
        //proxy: 'http://127.0.0.1:8888'
    }
})

frisby.create('Twitter will auth me')
    .post('https://api.twitter.com/oauth2/token', null, {
        body: 'grant_type=client_credentials'
    })
    .addHeader('Authorization',init_auth_header)
    .addHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8')
    .expectStatus(200)
    .after(function(error,response,body){
        let access_token = JSON.parse(body).access_token;
        let app_auth_header = 'Bearer ' + access_token;

        frisby.create('Twitter - NottsTest contains pizza and mentions rebelrecruiters')
            .get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=NottsTest&count=1')
            .addHeader('Authorization',app_auth_header)
            .expectStatus(200)
            .expectJSONTypes('*',{
                text: Joi.string().regex(/pizza/)
            })
            .expectContainsJSON('?',{
                "entities": {
                    "user_mentions": [{
                        "screen_name": "rebelrecruiters"
                    }]
                }
            })
        .toss()
    })
.toss()
