/* Constant Require Section */
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

/* Body Parser */
app.use(bodyParser.urlencoded({
  extened: true
}));

/* Static Folder */
app.use(express.static("public")); /* 讓本地style.css跟圖片可以上線 */

/* Tracking HTML File */
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

/* Signup Route */
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  /* Stringify inputed data */
  const jsonData = JSON.stringify(data);

  const url = "https://us12.api.mailchimp.com/3.0/lists/11656a7443";
  const options = {
    method: "POST",
    auth: "text or name:bb09958760b2b39e1ae88c11e1a6145a-us12"
  };

  /* Requesting and send back our data to mailchimp */
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("jsonData", function(data) {
      console.log(JSON.parse(data));
    });
    console.log("Adding new audience successfully");
  });

  request.write(jsonData);
  request.end();

});

/* Redirect the user to the home route*/
app.post("/failure", function(req, res){
  res.redirect("/")
})

app.listen(3000, function() {
  console.log("connect to port 3000 successfully");
});
