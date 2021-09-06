const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const RequestIp = require('@supercharge/request-ip')
const puppeteer = require('puppeteer');
const cors = require('cors');

app.use(cors({origin: '*'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
let browser, page, page1;
async function openBrowser() {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
    page = await browser.newPage();
    page1 = await browser.newPage();
}
openBrowser();

app.get('/burn/:address', async(req, res) => {
    if(!(req.params.address == 'undefined') || req.params.address.substr(0,2) == '0x') {
        try {
            await page.setViewport({
                width: 1900,
                height: 1000,
            });
            await page.goto(`https://bscscan.com/token/${req.params.address}`);
            await page.waitForSelector('span.hash-tag.text-truncate')
            let totalSupply = await page.evaluate(() => {
                return document.querySelector('span.hash-tag.text-truncate').textContent;
            });
            await page.goto(`https://bscscan.com/token/generic-tokenholders2?m=normal&a=${req.params.address}&s=1000000000000000000000000&sid=75ac412a2a3ca185d31dd6a17773b96f&p=1`);
            await page.waitForSelector('[data-toggle="tooltip"]')
            const innerHTML = await page.evaluate(() => {
                if(Array.from(document.querySelectorAll('[data-toggle="tooltip"]')).find(x => x.textContent=='Burn Address')) return Array.from(document.querySelectorAll('[data-toggle="tooltip"]')).find(x => x.textContent=='Burn Address').parentElement.nextElementSibling.textContent;
                else if(Array.from(document.querySelectorAll('a')).find(x => x.textContent=='0x0000000000000000000000000000000000000001')) return Array.from(document.querySelectorAll('a')).find(x => x.textContent=='0x0000000000000000000000000000000000000001').parentElement.parentElement.nextElementSibling.textContent;
                else if(Array.from(document.querySelectorAll('a')).find(x => x.textContent=='0x000000000000000000000000000000000000dead')) return Array.from(document.querySelectorAll('a')).find(x => x.textContent=='0x000000000000000000000000000000000000dead').parentElement.parentElement.nextElementSibling.textContent;
                else return '000';
            });
            res.status(200).send({
                totalSupply: Number(totalSupply.replace(/,/g, '')),
                balance: Number(innerHTML.replace(/,/g, ''))
            });
        } catch (err) {
            console.log("Could not create a browser instance => : ", err);
        }
    }
    else {
        res.json({
            balance: 0
        });
    }
})

app.get('/', (req, res) => {
    res.render('pages/home', { active: { home: true } });
})

app.get('/videos', (req, res) => {
    res.render('pages/videos', { active: { videos: true } });
})

app.get('/courses', (req, res) => {
    res.render('pages/courses', { active: { courses: true } });
})

app.get('/team', (req, res) => {
    res.render('pages/team', { active: { team: true } });
})

app.get('/contact', (req, res) => {
    res.render('pages/contact', { active: { contact: true } });
})

app.get('/admin', (req, res) => {
    res.render('pages/admin');
})

app.get('/best-programmer-in-bangladesh', (req, res) => {
    res.render('pages/best_programmer_in_bangladesh');
})

app.get('/my-ip', (req, res) => {
    const ip = RequestIp.getClientIp(req);
    res.send(ip);
})

app.get('/*', (req, res) => {
    res.render('pages/404');
})


const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on http://localhost:${server.address().port}`));