const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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

app.get('/*', (req, res) => {
    res.render('pages/404');
})

const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on http://localhost:${server.address().port}`));