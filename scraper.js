const fetch = require('node-fetch')
var express = require('express');
var app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));


async function getLyrics(query, language, type) {
    try {
        if (type == "timed") {
            const res = await fetch(`https://www.megalobiz.com/search/all?qry=${query}`)
            const body = await res.text();
            var firstSearch = body.split("entity_full_member_data")[1].split("href=")[1].split(" ")[0]
            var requiredUrl = "https://www.megalobiz.com"
            for (let index = 0; index < firstSearch.length; index++) {
                if (firstSearch[index] == "/" || firstSearch[index] >= "A" && firstSearch[index] <= "z" || firstSearch[index] == "." || firstSearch[index] == "+" || firstSearch[index] >= "0" && firstSearch[index] <= "9") {
                    requiredUrl += firstSearch[index]
                }
            }
            var id = requiredUrl.split("/")[requiredUrl.split("/").length - 1].split(".")[1]
            const resLrc = await fetch(requiredUrl)
            const bodyLrc = await resLrc.text();
            var lyrics = bodyLrc.split(`lrc_${id}_lyrics">`)[1].split("</span>")[0]
            var lyricsArray = lyrics.split("<br>")
            var formattedLyricsArray = []
            for (let index = 0; index < lyricsArray.length; index++) {
                if (lyricsArray[index][2] >= "0" && lyricsArray[index][2] <= "9") {
                    var unformattedTime = lyricsArray[index].split("[")[1].split("]")[0]
                    var lrc = lyricsArray[index].split("[")[1].split("]")[1]
                    var formattedTime = parseFloat(unformattedTime.split(":")[0]) * 60 + parseFloat(unformattedTime.split(":")[1])
                    if (formattedTime > 0.1) {
                        formattedLyricsArray.push([formattedTime, lrc])
                    }
                }
            }
            console.log(formattedLyricsArray)
            return { 'lyrics': formattedLyricsArray }
        }
        else {
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
                return lyrics
            }
        }
    } catch (error) {

    }


}

app.get('/:query/:language/:type', async function (req, res) {
    var query = req.params.query
    query = (query.split(" ")).join("+")
    var language = req.params.language
    if (language == undefined || language == "undefined") {
        language = "hindi"
    }
    var type = req.params.type
    var lyrics = await getLyrics(query, language, type)
    res.end(JSON.stringify(lyrics));
})


// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

app.listen(port, host, function () {
    console.log('Running on ' + host + ':' + port);
});
