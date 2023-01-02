const fetch = require('node-fetch')
var express = require('express');
var app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));


async function getLyrics(query, language) {
    try {
        if (language == "english") {
            const res = await fetch(`https://www.google.com/search?q=${query}+lyrics+musixmatch`)
            const body = await res.text();
            var index = 0
            var atag = ""
            var found = false
            var link = ""
            while (index < body.length) {
                if (body[index] == "<" && body[index + 1] == "a") {
                    found = true
                    index++
                }
                if (found) {
                    atag += body[index]
                }
                if (body[index + 1] == ">") {
                    found = false

                    if (atag.includes("https://www.musixmatch.com")) {
                        link = atag.split("q=")[1].split("&amp")[0]
                        break
                    }

                    atag = ""
                }
                index++
            }




            const resLyrics = await fetch(link)
            const bodyLyrics = await resLyrics.text();
            data = bodyLyrics.split('<span class="lyrics__content__ok">')
            var lyrics = ""
            lyrics += data[1].split("</span>")[0] + "\n"
            lyrics += data[2].split("</span>")[0]
        }

        else if (language == "hindi") {
            const res = await fetch(`https://www.google.com/search?q=${query}+lyrics+lyricsknow`)
            const body = await res.text();
            var index = 0
            var atag = ""
            var found = false
            var link = ""
            while (index < body.length) {
                if (body[index] == "<" && body[index + 1] == "a") {
                    found = true
                    index++
                }
                if (found) {
                    atag += body[index]
                }
                if (body[index + 1] == ">") {
                    found = false
                    if (atag.includes("https://lyricsknow.com")) {
                        link = atag.split("q=")[1].split("&amp")[0]
                        break
                    }
                    atag = ""
                }
                index++
            }

            const resLyrics = await fetch(link)
            const bodyLyrics = await resLyrics.text();
            lyrics = bodyLyrics.split("text-align: center;'>")[1].split("<style>")[0].split("\n")
            lyrics = lyrics.join("")
        }

    } catch (error) {

    }
    return lyrics
}

app.get('/:query/:language', async function (req, res) {
    var query = req.params.query
    query = (query.split(" ")).join("+")
    var language = req.params.language
    if (language == undefined || language == "undefined") {
        language = "hindi"
    }
    var lyrics = await getLyrics(query, language)
    res.end(JSON.stringify(lyrics));
})


// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

app.listen(port, host, function () {
    console.log('Running on ' + host + ':' + port);
});
