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

app.post("/code", async (req, res) => {
  object = JSON.parse(Object.keys(req.body));
  var user = await User.findOne({ ID: object.user });
  res.send(user.code);
});

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.post("/survey", async (req, res) => {
  object = JSON.parse(Object.keys(req.body)[0]);
  var user = await User.findOne({ ID: object.user });
  await user.updateOne({
    age: object.age,
    gender: object.gender,
    country: object.country,
    state: object.state,
    city: object.city,
    education: object.education,
    occupation: object.occupation,
    knowledge: object.knowledge,
    experience: object.experience,
    feedback: object.feedback,
  });

  res.send(user.code);
});

app.post("/login", async (req, res) => {
  let userID = req.body.userID;
  console.log("Login");
  console.log(userID);
  if (!userID) {
    return res.status(422).send("Error in request");
  }

  try {
    var userResponses = await Input.findOne({ UserID: userID });

    if (userResponses) {
      console.log("entered if");
      console.log(userResponses);
      let responses = userResponses.Response;
      if (responses.length != 0) {
        currentQuestion = responses[responses.length - 1].questionNumber;
        if (currentQuestion == 9) {
          var user_db = await User.findOne({ ID: userID });
          if (!user_db.age) {
            return res.sendFile(__dirname + "/views/survey.html");
          }
          res.sendFile(__dirname + "/views/thank_you.html");
        } else {
          res.sendFile(
            __dirname + `/views/question${currentQuestion + 1}.html`
          );
        }
      } else {
        res.sendFile(__dirname + `/views/question0.html`);
      }
    }
    else {
      console.log("entered else for user creation");
      let code = makeid(5);
      const user = new User({
        ID: req.body.userID,
        code: code,
      });
      console.log("User creation:");
      console.log(req.body.userID);
      User.create(user);

      const response = new Input({
        UserID: req.body.userID,
        Response: [],
      });
      Input.create(response);

      res.sendFile(__dirname + "/views/question0.html");
    }
  }
  catch (e) {
    return res.status(422).send("A error occurred");
  }
});

app.post("/:questionNumber", async (req, res) => {
  let nextQuestionNumber = req.params.questionNumber;
  let userID = req.body.UserID;
  console.log("New question user ID:");
  console.log(userID);
  console.log("New question qno:");
  console.log(nextQuestionNumber);

  if (!nextQuestionNumber || !userID) {
    return res.status(422).send(userID + ": Error in request");
  }

  try {
    //delete req.body.UserID;
    var userResponses = await Input.findOne({ UserID: userID });

    const questionResponse = new Question({
      questionNumber: nextQuestionNumber - 1,
      ...req.body,
    });

    let a = userResponses.Response;
    a.push(questionResponse);

    await userResponses.updateOne({ Response: a });

    if (nextQuestionNumber == 10) {
      res.sendFile(__dirname + `/views/survey.html`);
    } else {
      console.log("Next qno");
      console.log(nextQuestionNumber);
      res.sendFile(__dirname + `/views/question${nextQuestionNumber}.html`);
    }
  } catch (e) {
    return res.status(422).send("Error in request");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
