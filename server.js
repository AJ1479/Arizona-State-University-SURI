require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

require("./models/db");

const { Question } = require("./models/questionSchema");
const User = require("./models/userSchema");
const Input = require("./models/responsesSchema");

const PORT = process.env.PORT || 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/react_deploy", express.static("react_deploy"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.post("/survey", async (req, res) => {
  object = JSON.parse(Object.keys(req.body)[0]);
  var user = await User.findOne({ ID: object.user });
  await user.update({ 
    age: object.age,
    gender: object.gender,
    country: object.country,
    state: object.state,
    city: object.city,
    education: object.education,
    occupation: object.occupation,
    knowledge: object.knowledge,
    experience: object.experience,
    feedback: object.feedback, });

    res.send(user.code);
  
  });

app.post("/login", async (req, res) => {
  let userID = req.body.userID;

  if (!userID) {
    return res.status(422).send("Error in request");
  }

  try {
    var userResponses = await Input.findOne({ UserID: userID });
    if (userResponses) {
      let responses = userResponses.Response;
      if(responses.length != 0){
        currentQuestion = responses[responses.length - 1].questionNumber
      if (currentQuestion == 9) {
        res.sendFile(__dirname + "/views/thank_you.html");
      } else {
        res.sendFile(
          __dirname + `/views/question${currentQuestion + 1}.html`
        );
      }
   }
  else{
    res.sendFile(
      __dirname + `/views/question0.html`
    );
  } } else {
      let code = makeid(5);
      const user = new User({
        ID: req.body.userID,
        code: code,
      });

      await User.create(user);

      const response = new Input({
        UserID: req.body.userID,
        Response: [],
      });
      await Input.create(response);

      res.sendFile(__dirname + "/views/question0.html");
    }
  } catch (e) {
    return res.status(422).send("A error occurred");
  }
});

app.post("/:questionNumber", async (req, res) => {
  let nextQuestionNumber = req.params.questionNumber;
  let userID = req.body.UserID;

  if (!nextQuestionNumber || !userID) {
    return res.status(422).send("Error in request");
  }

  try {
    delete req.body.UserID;
    var userResponses = await Input.findOne({ UserID: userID });

    const questionResponse = new Question({
      questionNumber: nextQuestionNumber - 1,
      ...req.body,
    });

    let a = userResponses.Response;
    a.push(questionResponse);

    await userResponses.update({ Response: a });

    if (nextQuestionNumber == 10) {
      res.sendFile(__dirname + `/views/survey.html`);
    } else {
      res.sendFile(__dirname + `/views/question${nextQuestionNumber}.html`);
    }
  } catch (e) {
    return res.status(422).send("Error in request");
  }
});




async function buildNodeApp() {
  const child = spawn(
    "cd react_app && npm i && npm run build && cd .. && node extras.js",
    { shell: true }
  );

  child.stdout.on("data", function (data) {
    console.log(data.toString());
  });

  child.on("exit", function (code, signam) {
    console.log("react app build complete");
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  buildNodeApp();
});
