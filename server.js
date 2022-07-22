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
  res.sendFile(__dirname + "\\views\\login.html");
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
      let currentQuestion = responses[responses.length - 1].questionNumber;
      if (currentQuestion == 8) {
        res.sendFile(__dirname + "\\views\\thank_you.html");
      } else {
        res.sendFile(
          __dirname + `\\views\\question${currentQuestion + 1}.html`
        );
      }
    } else {
      const user = new User({
        ID: req.body.userID,
      });

      await User.create(user);

      const response = new Input({
        UserID: req.body.userID,
        Response: [],
      });
      await Input.create(response);

      res.sendFile(__dirname + "\\views\\question0.html");
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

    if (nextQuestionNumber === 9) {
      res.sendFile(__dirname + `\\views\\thank_you.html`);
    } else {
      res.sendFile(__dirname + `\\views\\question${nextQuestionNumber}.html`);
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
