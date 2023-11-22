//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// get signup page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// add a newsletter
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.sName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us14.api.mailchimp.com/3.0/lists/f1d4c09dc4'

  const options = {
    method: "POST",
    auth: "teo:3364cb536a656ad1e76d6d395cf67ab9-us14"
  }

  //success or failure
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();


  console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
});

// audi id
// f1d4c09dc4
// api key
// 3364cb536a656ad1e76d6d395cf67ab9-us14
