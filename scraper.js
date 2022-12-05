const fetch = require('node-fetch')
var express = require('express');
var app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));


async function getLyrics(query) {
    try {
        const res = await fetch(`https://www.google.com/search?q=${query}+lyrics`)
        const body = await res.text();
        var data = []
        data = body.split('Source:')
        data = data[0].split('<div class="hwx">')

        var lyrics = data[1]
        var actualLyrics = ""
        var insert = true
        for (let index = 0; index < lyrics.length; index++) {
            if (lyrics[index] == "<") {
                insert = false
            }
            if (lyrics[index] == ">") {
                insert = true
            }
            if (insert == true) {
                if (lyrics[index] != ">") {
                    actualLyrics += lyrics[index]
                }
            }

        }
    } catch (error) {

    }
    return actualLyrics
}


app.get('/:query', async function (req, res) {
    var query = req.params.query
    var lyrics = await getLyrics(query)
    console.log(query)
    res.end(JSON.stringify(lyrics));
})

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

app.listen(port, host, function () {
    console.log('Running on ' + host + ':' + port);
});
