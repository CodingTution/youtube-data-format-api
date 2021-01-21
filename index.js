const httprequest = require('request');
const videoUrlLink = require('video-url-link');
var responsearray = [];
var array = [];
var port = process.env.PORT || 3000
var express = require('express')
var app = express()
var https = require('https');
app.get('/', function (request, response) {
    var urlmain = __dirname + request.url;
    var query = gup('query', urlmain);
    var key = gup('key', urlmain);
    var maxResults = gup('maxResults', urlmain);

    var options = {
        host: 'www.googleapis.com',
        port: 443,
        path: `/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&key=${key}`,
        method: 'GET'
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            var responsebody = JSON.parse(body).items;
            if (responsebody != undefined) {
                responsebody.map((item, index) => {
                    array.push(item.id.videoId);
                    if (array.length == 10) {
                        array.map((item, index) => {
                            videoUrlLink.youtube.getInfo(`https://youtu.be/${item}`, { hl: 'en' }, (error, info) => {
                                responsearray.push({
                                    details: info.details,
                                    formats: info.formats,
                                })
                                if (responsearray.length == 10) {
                                    response.send(JSON.stringify(responsearray))
                                }
                            });
                        });
                    }
                });
            }
        });
    });
    req.end();
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
