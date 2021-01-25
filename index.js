var array = [];
var port = process.env.PORT || 3000;
var express = require("express");
const videoUrlLink = require('video-url-link');
var app = express();
app.get("/", function (request, response) {
    var urlmain = __dirname + request.url;
    var id = gup("id", urlmain);
    videoUrlLink.youtube.getInfo('https://youtu.be/' + id, { hl: 'en' }, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            response.send(info.formats);
        }
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
