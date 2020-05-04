/*
Project Caitlin Calendar API v.08
---------------------------------------------------------------------------------

Feb 17, 2020:
This file only serves as a API now which is to perform API calls to Google Calendar
to complete CRUD functionality

Jan 12, 2020:
Alpha stages, we can grab data from google calendar API
to site and also submit a small event. Also we are able to display
a crude calendar currently

Jan 14, 2020:
The Month calendar is showing decent.

Bugs
-----------
1.For the events, if the event we are current looking at doesn't have
a time, it will mess up the calendar display.
*/

//  Adding the firebase storage
// var admin = require("firebase-admin");

var express = require("express");
var app = express();
app.use(express.static(__dirname + "/build")); //REC
var bodyParser = require("body-parser"); //body-parser is use to capture req parameters
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({ extended: true })); //for body parser to parse correctly
// Use express-session for session variables to support log in functionality
var session = require("express-session");
app.use(session({secret: "An open secret"}));
// Connect to firebase to check for matched passwords
import firebase from "./firebase";

const port = process.env.PORT || 5000;
app.set("view engine", "ejs");
//start of google calendar API stuff
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
var calenAuth = null,
  calendar = null;
var calendarID = "iodevcalendar@gmail.com"; //Change here for some else's calendar
// var calendarID = "pmarathay@gmail.com"
// var calendarID = "jeremyhmanalo@gmail.com"
//Required code for any of the above to work
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
setUpAuth(); //sets all the necessary authentication and vars "calenAuth", and "calendar"
//end of calendar API stuff

/*
fullCalByInterval:
Given start and end parameters from request, it will return all events from
the google calendar BUT convert it to the format that is accepted by Full Calendar

*/
app.get("/fullCalByInterval", function (req, result) {
  console.log("server get fullCalByInterval");
  // console.log("passed in params start date "  + req.query.start);
  // console.log("passed in params end date"  + req.query.end);
  // result.json({result: "We have sucessfully sent back "});

  if (!req.query.start || !req.query.end) {
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  } else {
    var startParam = new Date(req.query.start);
    var endParam = new Date(req.query.end);
    console.log(
      "start : ",
      startParam.toISOString(),
      " end:",
      endParam.toISOString()
    );
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
  }
  calendar.events.list(
    {
      calendarId: calendarID,
      timeMin: startParam.toISOString(),
      timeMax: endParam.toISOString(),
      maxResults: 999,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      //CallBack
      if (err) {
        return result.send("The post request returned an error: " + err);
      }

      var A = []; //The resultant Array
      var B = res.data.items;

      for (let i = 0; i < B.length; i++) {
        if (B[i].start.date == null) {
          var temp = {
            id: B[i].id,
            title: B[i].summary,
            start: B[i].start.dateTime,
            end: B[i].end.dateTime,
          };
        } else {
          var start0 = new Date(B[i].start.date);
          var end0 = new Date(B[i].start.date);
          start0.setHours(0, 0, 0, 0);
          end0.setHours(23, 59, 59, 59);
          var temp = {
            id: B[i].id,
            allDay: true,
            title: B[i].summary,
            start: start0,
            end: end0,
          };
        }
        A.push(temp);
      }
      // result.json(res.data.items);
      result.send(A);
    }
  );
});

app.get("/x", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
//Landing Page
/*
The below does a query to the google calendar API and gets all the events of the current
month and then renders them On the month template
*/
app.get("/a", function (req, result) {
  var date = new Date();
  var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  calendar.events.list(
    {
      calendarId: calendarID,
      timeMin: firstDayOfMonth.toISOString(),
      timeMax: lastDayOfMonth.toISOString(),
      maxResults: 999,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      //CallBack
      if (err) return console.log("The API returned an error: " + err);
      events = res.data.items;
      result.json(events);
      console.log(events, "/a events");
      result.render("month", { events: events });
    }
  );
});

app.get("/getRecurringRules", (req, result) => {
  console.log(req.query.recurringEventId, "req getRecurringRules");

  if (req.query.recurringEventId) {
    calendar.events.get(
      {
        calendarId: calendarID,
        eventId: req.query.recurringEventId,
      },
      (err, res) => {
        //CallBack
        if (err) {
          return result.send("The get request returned an error: " + err);
        }
        console.log(res.data.recurrence, "getRecurringRules");
        result.json(res.data.recurrence);
      }
    );
  }
});

app.get("/getRecurringEventInstances", (req, result) => {
  console.log(
    req.query.timeMin,
    "getRecurringEventInstances",
    req.query.timeMax
  );

  if (req.query.recurringEventId) {
    if (!req.query.timeMin) {
      calendar.events.instances(
        {
          calendarId: calendarID,
          eventId: req.query.recurringEventId,
        },
        (err, res) => {
          //CallBack
          if (err) {
            return result.send("The get request returned an error: " + err);
          }
          console.log(res.data, "getRecurringEventInstances");
          result.json(res.data.items);
        }
      );
    } else {
      calendar.events.instances(
        {
          calendarId: calendarID,
          eventId: req.query.recurringEventId,
          timeMin: req.query.timeMin,
          timeMax: req.query.timeMax,
        },
        (err, res) => {
          //CallBack
          if (err) {
            return result.send("The get request returned an error: " + err);
          }
          console.log(res.data, "getRecurringEventInstances");
          result.json(res.data.items);
        }
      );
    }
  }
});

/*
*
*
*
getEventsByInterval:
There are two of the same functions here, I just haven't to decide
whether to use the post or get. They are essentially the same but
post is in a way more secure because the user can't see how the
data is retrieve.
*
*
*
*/
app.get("/getEventsByInterval", function (req, result) {
  console.log("passed in params start date ", req.query.start);
  // console.log("passed in params end date", req);

  if (!req.query.start || !req.query.end) {
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  } else {
    var startParam = new Date(req.query.start);
    var endParam = new Date(req.query.end);
    console.log("start : ", startParam, " end:", endParam);
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
    console.log("start : ", startParam, " end:", endParam);
  }
  calendar.events.list(
    {
      calendarId: calendarID,
      timeMin: startParam.toISOString(),
      timeMax: endParam.toISOString(),
      maxResults: 999,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      //CallBack
      if (err) {
        return result.send("The post request returned an error: " + err);
      }
      console.log(res.data, "geteventsbyinterval");
      result.json(res.data.items);
    }
  );
});

/*
Delete ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.post("/deleteEvent", function (req, result) {
  console.log(req.body.ID);
  calendar.events.delete(
    { calendarId: calendarID, eventId: req.body.ID },
    req.body.ID,
    (err, res) => {
      //CallBack
      if (err) {
        return result.send("The post request returned an error: " + err);
      }
      result.send("delete");
    }
  );
});

app.delete("/deleteRecurringEvent", (req, result) => {
  console.log(req.query.array[0], "deleteRecurringEvent");
  try {
    req.query.array.map((event) => {
      event = JSON.parse(event);
      console.log(event.id, "event.id");
      calendar.events.delete({
        calendarId: calendarID,
        eventId: event.id,
      });
    });
    result.send("delete");
  } catch (error) {
    console.log(error);
  }
});

/*
getEventsByInterval:
given a start and a end date from req, it will query those In the
google calendar and return events between those dates
*/
app.post("/getEventsByInterval", function (req, result) {
  if (!req.body.time.start || !req.body.time.end) {
    //If no parameters is passed, we return the current months events
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  } else {
    var startParam = new Date(req.body.time.start);
    var endParam = new Date(req.body.time.end);
    console.log("start : ", startParam, " end:", endParam);
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
  }
  calendar.events.list(
    {
      calendarId: calendarID,
      timeMin: startParam.toISOString(),
      timeMax: endParam.toISOString(),
      maxResults: 999,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      //CallBack
      if (err) {
        return result.send("The post request returned an error: " + err);
      }
      result.json(res.data.items);
    }
  );
});

/*
UPDATE ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.put("/updateEvent", function (req, result) {
  console.log("update request recieved");
  console.log(req.body.ID, req.body.extra);

  let newEvent = req.body.extra;

  calendar.events.update(
    {
      calendarId: calendarID,
      eventId: req.body.ID,
      // start: newEvent.start,
      // end: newEvent.end,
      resource: newEvent,
      // summary: newEvent.summary,
    },
    (err, res) => {
      //CallBack
      if (err) {
        return result.send("The post request returned an error: " + err);
      }
      result.send("update");
    }
  );
});

/*
app.listen(3001, function):
sets up the localhost with port 3001 as default address
for testing
*/
app.listen(port, function () {
  console.log("Webpage listening on port 5000, Time: " + new Date());
});

/*
create new Event
*/
app.post("/createNewEvent", function (req, res) {
  console.log(req.body);
  // console.log((new Date()).toISOString());
  console.log("inside create event route");

  /*
  var event = {
    'summary': req.body.title,
    // 'location': '800 Howard St., San Francisco, CA 94103',
    // 'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': req.body.start,
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': req.body.end,
      'timeZone': 'America/Los_Angeles',
    }
  };
*/
  calendar.events.insert(
    {
      auth: calenAuth,
      // calendarId: 'iodevcalendar@gmail.com',
      calendarId: calendarID,
      resource: req.body.newEvent,
    },
    function (err, event) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      console.log("Event created: %s", event.htmlLink);
      res.send("Evented Created");
    }
  );
});

/*
Log in ROUTE:
Given the trusted advisor's login, see if email and hashed password matches with what is stored in firebase. If it matches, set the session key for log in status.
*/
app.post("/TALogIn", function (req, result) {
  console.log(req.body.username,req.body.password);
  req.session.user = req.body.username;
  let db = firebase.firestore();
  // Run following when username/password don't match
  // result.json(false);
  // Run following when username/passowrd matches
  result.json(req.body.username);
});

/*
Log in status ROUTE:
Check session variables to know if a trusted advisor has logged in, and return the user's information if it is.
*/
app.get("/TALogInStatus", function (req, result) {
  if(req.session.user) {
    result.json(req.session.user);
  } else {
    result.json(false)
  }
});

/*
Log out ROUTE:
Remove session key so trusted advisor is no longer lgged in.
*/
app.get("/TALogInStatus", function (req, result) {
  req.session.destroy(function(err) {
  })
  result.json("success");
});


/**
find the user with email id
*/
// exports.FindUserDoc = functions.https.onCall(async (data, context) => {
//   // Grab the text parameter.
//   let emailId = data.emailId;
//   var emailId1 = emailId.toLowerCase();
//   var email = emailId1.split("@");
//   email[0] = email[0].split(".").join("");
//   email[0] = email[0].concat("@");
//   var emailId_final = email[0].concat(email[1]);
//   console.log(emailId1);
//   console.log(emailId_final);
//   var TADetails = {id:""};
//   let TAs = db.collection('trusted_advisor');
//   let userData = TAs.where('email_id', '==', emailId_final );
//   await userData.get()
//       .then(snapshot => {
//           if (snapshot.empty) {
//               console.log('No matching documents.');
//               return "User Not Found";
//           }
//       snapshot.forEach(doc => {
//           userDetails.id = doc.id;
//           console.log(userDetails);
//       });
//   })
//       .catch(err => {
//       console.log('Error getting documents', err);
//   });

//   return userDetails;
// });

//   return userDetails;
// });

// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//Below is all the google authorization code

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function saveCredentials(auth) {
  //Tyler: saveCredentials has been altered to just set-up, no listing events
  console.log("saveCredentials", auth);

  if (calenAuth == null) calenAuth = auth;
  if (calendar == null) calendar = google.calendar({ version: "v3", auth });
}

function setUpAuth() {
  // Load client secrets from a local file.
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), saveCredentials); //Tyler: saveCredentials has been altered to just set-up, no listing events
  });
}

//End of Google Auth Code
