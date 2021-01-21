const httprequest = require('request');
const videoUrlLink = require('video-url-link');
var port = process.env.PORT || 3000
var express = require('express')
var app = express()
var responsearray = [];
var array = [];
app.get('/', function (request, response) {
    response.send("hello");
})

app.listen(port)
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
