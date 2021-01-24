var array = [];
var port = process.env.PORT || 3000;
var express = require("express");
var app = express();
const https = require('https');
app.get("/", function (request, response) {
    var urlmain = __dirname + request.url;
    var id = gup("id", urlmain);
    https.get(`https://www.yt-download.org/api/button/mp3/${id}`, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        res.setEncoding("utf-8");
        res.on('data', (body) => {
            var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return body.replace(urlRegex, function (url) {
                array.push(url)
                if (array.length == 7) {
                    response.setHeader('Content-Type', 'application/json');
                    var PATTERN = 'https://www.yt-download.org/download/',
    filtered = array.filter(function (str) { return str.includes(PATTERN); });
                    response.json({
                        "320 kbps": filtered[0],
                        "256 kbps": filtered[1],
                        "192 kbps": filtered[2],
                        "128 kbps": filtered[3],
                    });
                    array = [];
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
