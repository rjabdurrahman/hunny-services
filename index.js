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
    res.render('home', { active: { home: true } });
})

app.get('/admin', (req, res) => {
    res.render('pages/admin');
})

app.get('/*', (req, res) => {
    res.render('pages/404');
})

const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on http://localhost:${server.address().port}`));