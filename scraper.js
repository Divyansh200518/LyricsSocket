// const { writeFile } = require('fs');
// const { setTimeout } = require('timers/promises');
// const { clearInterval } = require('timers');


const fs = require("fs");

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

const { executablePath } = require('puppeteer');
const { setTimeout } = require("timers/promises");
const { clearInterval } = require("timers");

// const path = './music.json';
const dataObjectArray = []


async function scrapeSong(url) {
    const browser = await puppeteer.launch({ headless: true, executablePath: executablePath() });
    const page = await browser.newPage();
    await page.goto(url);
    const elements = await page.$x('//*[@id="root"]/div[2]/div[1]/div/main/div/div/section/ol/li[1]/div/article/div[2]/figure/div/img')
    await elements[0].click() 
    const timer = setInterval(async () => {
        try {
            const dataObject = {}
            const [el] = await page.$x('//*[@id="player"]/div[1]/figure/figcaption/h4/a');
            const title = await el.getProperty('title');
            const titleTxt = await title.jsonValue();

            const [el2] = await page.$x('//*[@id="music-player"]/div[2]/div[5]/video');
            const src = await el2.getProperty('src');
            const srcTxt = await src.jsonValue();

            const [el3] = await page.$x('//*[@id="player"]/div[1]/figure/figcaption/p');
            const artist = await el3.getProperty('textContent');
            const artistTxt = await artist.jsonValue();

            const [el4] = await page.$x('//*[@id="player"]/div[1]/figure/div/a/img');
            const banner = await el4.getProperty('src');
            const bannerSrc = await banner.jsonValue();

            dataObject["songName"] = titleTxt
            dataObject["songLink"] = srcTxt
            dataObject["artName"] = artistTxt
            dataObject["songBanner"] = bannerSrc

            if (srcTxt) {
                io.emit('message', dataObject)
                clearInterval(timer)
                browser.close()
            }

        } catch (error) {
            console.log(error)
        }
    }, 1000);




    // browser.close()
}


const http = require('http').createServer();
const port = 3000;
const hostname = '0.0.0.0';
const io = require('socket.io')(http,{
    cors:{origin: "*"}
})

io.on('connection',socket =>{
    console.log("A user connected")

    socket.on('message',(message)=>{
        var searchQuery = message
        var url = "https://www.jiosaavn.com/search/"+searchQuery
        scrapeSong(url)
    })

})

http.listen(port , hostname, () =>console.log(`listening on http://${hostname}:${port}/`));


function logger(){
    console.log("Finally")
}
