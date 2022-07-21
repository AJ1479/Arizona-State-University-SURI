require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')

require('./models/db');


const Question = require('./models/questionSchema');
const User = require('./models/userSchema');
const Input = require('./models/responsesSchema');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));
app.use('/react_deploy', express.static("react_deploy"));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'\\views\\login.html');
})

app.post('/login', async(req, res) => {
    console.log(req.body);
    const user = new User({
        ID: req.body.userID,
  });
  await User.create(user);
    res.sendFile(__dirname+'\\views\\question.html');
})


app.post('/:questionNumber', (req, res) => {
    questionNumber = req.params.questionNumber;
    console.log(req.body);
    res.sendFile(__dirname+`\\views\\question${questionNumber}.html`);
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));