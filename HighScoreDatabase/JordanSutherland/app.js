const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.render('index', {} );
});

app.get('/highscores', (req, res) => {
    res.render('highscores', {} );
});

app.get('/game', (req, res) => {
    res.render('game', {} );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});