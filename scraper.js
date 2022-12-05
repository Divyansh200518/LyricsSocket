const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

const { executablePath } = require('puppeteer');


async function scrapeSong(url) {
    const browser = await puppeteer.launch({ headless: true, executablePath: executablePath() });
    const page = await browser.newPage();
    await page.goto(url);
    const [lyricsElement] = await page.$$('.xaAUmb');
    const lyrics = await lyricsElement.getProperty('innerText');
    const lyricsTxt = await lyrics.jsonValue();
    browser.close()
    return lyricsTxt
}


const http = require('http').createServer();
const PORT = 5000;
const io = require('socket.io')(http, {
    cors: { origin: "*" }
})

io.on('connection', socket => {
    console.log("A user connected")
    socket.on('message', async (message) => {
        io.emit('confirmation', "confirmed")
        var searchQuery = message
        searchQuery = searchQuery.split(" ")
        searchQuery = searchQuery.join("+")
        var url = "https://www.google.com/search?q=" + searchQuery + "+lyrics"
        lyrics = await scrapeSong(url)
        io.emit('message', lyrics)
    })

})

// http.listen(8080, () =>console.log('listening on http://localhost:8080'));
http.listen(process.env.PORT || PORT, '0.0.0.0', () => console.log(`listening on ${PORT}`));
