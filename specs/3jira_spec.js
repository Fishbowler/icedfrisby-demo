var frisby = require('icedfrisby');
var secrets = require('../secrets.js');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

frisby.globalSetup({
    request: {
        //proxy: 'http://127.0.0.1:8888'
    }
})

var jira_root = 'https://' + secrets.jira_domain + '.atlassian.net';
var jira_auth_url = jira_root + '/rest/auth/1/session';
var jira_ticket_url = jira_root + '/rest/api/2/issue/TTT-1';

frisby.create('JIRA will auth me')
    .post(jira_auth_url,null,{
        body: {
            username: secrets.jira_username,
            password: secrets.jira_password
        },
        json:true
    })
    .expectStatus(200)
    .after(function(error,response,body,headers){
        var setCookie = headers['set-cookie']
        var cookie = ''

        if (Array.isArray(setCookie)) {
            for (var i = 0, len = setCookie.length; i < len; i++) {
                cookie += setCookie[i].split(';')[0]
                if (i < len - 1)
                    cookie += '; '
            }
        }
        
        frisby.create('JIRA Ticket is assigned to the assignee')
            .get(jira_ticket_url,{
                headers: {
                    'Cookie': cookie,
                    "Content-Type" : "application/json"
                }
            })
            .expectStatus(200)
            .expectContainsJSON('fields.assignee',{name:secrets.jira_assignee})
        .toss()
    })
.toss()
    

