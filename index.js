const httprequest = require('request');
var http = require('http');
const videoUrlLink = require('video-url-link');
var responsearray = [];
var array = [];
http.createServer(function (request, response) {
    var urlmain = __dirname + request.url;
    var query = gup('query', urlmain);
    var key = gup('key', urlmain);
    var maxResults = gup('maxResults', urlmain);
    response.writeHead(200, { 'Content-Type': 'text/html' });
    httprequest(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&key=${key}`, function (error, res, body) {
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
                                response.write(JSON.stringify(responsearray))
                                response.end();
                            }
                        });
                    });
                }
            });
        }
    });
}).listen(8080);
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
