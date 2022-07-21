require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')

require('./models/db');


const {Question} = require('./models/questionSchema');
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

  const response = new Input({
    UserID: req.body.userID,
    Response: [],

});
await Input.create(response);

    res.sendFile(__dirname+'\\views\\question.html');
})


app.post('/:questionNumber', async (req, res) => {
    questionNumber = req.params.questionNumber;
    let userID = req.body.UserID;
    delete req.body.UserID;
    var userResponses = await Input.findOne({ UserID: userID });
    
    const questionResponse = new Question({
        questionNumber: questionNumber,
        ...req.body
    
    });

    let a = userResponses.Response;
    a.push(questionResponse);

    await userResponses.update({Response: a})

    //await Input.create(response);
    console.log(userResponses)
    
    res.sendFile(__dirname+`\\views\\question${questionNumber}.html`);
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));