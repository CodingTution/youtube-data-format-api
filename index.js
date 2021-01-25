var array = [];
var filtered = [];
var port = process.env.PORT || 3000;
var express = require("express");
var app = express();
const https = require('https');
app.get("/", function (request, response) {
    var urlmain = __dirname + request.url;
    var id = gup("id", urlmain);
    var type = gup("type", urlmain);
    if (type == "audio") {
        var filetype = "mp3"
    } else if (type == "video") {
        var filetype = "videos"
    }
    https.get(`https://www.yt2mp3s.me/api/button/${filetype}/${id}`, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        res.setEncoding("utf-8");
        res.on('data', (body) => {
            var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return body.replace(urlRegex, function (url) {
                array.push(url)
                if (array.length == 7) {
                    var PATTERN = 'yt2mp3s.me/download/',
                        filtered = array.filter(function (str) { return str.includes(PATTERN); });
                    var obejct = {
                        best: filtered[0],
                        high: filtered[1],
                        medium: filtered[2],
                        low: filtered[3]
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.json(obejct);
                    array = [];
                    filtered = [];
                }
                return '<a href="' + url + '">' + url + '</a>';
            });
        });

    }).on('error', (e) => {
        console.error(e);
    });
});

app.listen(port);
function gup(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
