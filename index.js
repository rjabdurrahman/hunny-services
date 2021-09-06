const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const RequestIp = require('@supercharge/request-ip')
const puppeteer = require('puppeteer');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/burn/:address', async(req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
    const page = await browser.newPage();
    try {
        await page.setViewport({
            width: 1900,
            height: 1000,
        });
        await page.goto(`https://bscscan.com/token/generic-tokenholders2?m=normal&a=${req.params.address}&s=1000000000000000000000000&sid=75ac412a2a3ca185d31dd6a17773b96f&p=1`);
        await page.waitForSelector('[data-toggle="tooltip"]')
        const innerHTML = await page.evaluate(() => {
            if(Array.from(document.querySelectorAll('[data-toggle="tooltip"]')).find(x => x.textContent=='Burn Address') == undefined) return '000';
            else return Array.from(document.querySelectorAll('[data-toggle="tooltip"]')).find(x => x.textContent=='Burn Address').parentElement.nextElementSibling.textContent;
        });
        await browser.close();
        res.status(200).send({
            balance: Number(innerHTML.replace(/,/g, ''))
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
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