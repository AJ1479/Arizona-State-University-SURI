require('dotenv').config();

const path = require('path')
const express = require('express');
// const ejs = require('ejs');
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));
app.use('/react_deploy', express.static("react_deploy"));

app.get('/', (req, res) => {
    res.render('index', { title: 'hello' });
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));