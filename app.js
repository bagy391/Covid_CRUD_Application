const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const delay = require("express-delay");
const login_username = "inspark";
const login_password = "abc123";
const app = express();
var up = "";
var inc = "";

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/patientDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
const patientSchema = new mongoose.Schema({
  p_id: {type :String,unique:true},
  p_name: String,
  contact: String,
  admit_date: String,
  disch_date: String,
  p_db: String,
  gender: String
});
const Patient = mongoose.model("Patient", patientSchema);

const userSchema = new mongoose.Schema({
  email: String,
  pasword: String
});
const User = mongoose.model("User", userSchema);

//START PAGE


app.get("/", function(req, res) {
  //inc="Enter Username and Password."
  res.render("index", {
    inco: inc
  });
});
app.post("/insert", function(req, res) {
  res.sendFile(__dirname + "/insert.html");
});
app.post("/update", function(req, res) {
  res.sendFile(__dirname + "/search.html");
});
app.post("/search", function(req, res) {
  res.sendFile(__dirname + "/search.html");
});
//LOGIN


app.post("/", function(req, res) {
  var uname = req.body.usermame;
  var pass = req.body.password;

  if (uname === login_username && pass === login_password) {
    res.render("options");
  } else {
    inc = "Invalid Username/Password."
    res.render("index", {
      inco: inc
    });
  }

});





//ACTIVE CASES

app.post("/view", function(req, res) {
  Patient.find( function(err, foundItems) {

    res.render("view", {
      content: foundItems,
    });

  });

});



//LOGOUT

app.post("/logout", function(req, res) {
  inc = "Logged out successfully";
  res.render("index", {
    inco: inc
  });
});




//INSERT


app.post("/insert_suc", function(req, res) {
  const pat_id = req.body.p_id;
  const pat_name = req.body.p_name;
  const cont = req.body.contact;
  const a_d = req.body.admit_date;
  const b_d=req.body.p_db
  const gend=req.body.gender


  const patient = new Patient({
    p_id: pat_id,
    p_name: pat_name,
    contact: cont,
    admit_date: a_d,
    p_db :b_d,
    gender:gend
  });
  Patient.find({p_id:pat_id},function(err,found){
    if(found.length){
      res.send("<h1>Error:Patient ID already exist.</h1>");
    }
else{
  patient.save();
res.render("options");
}
});});


//SEARCH PATIENT

app.post("/searchPatient", function(req, res) {
  const pat_id = req.body.pat_id;
  const dis_date = req.body.pat_disch;
  //console.log(dis_date);
  Patient.updateOne({
    p_id: pat_id
  }, {
    disch_date: dis_date
  }, function(err) {
    if (!err) {
      Patient.find({
        p_id: pat_id
      }, function(err, foundItems) {
        if (foundItems) {
          res.render("view", {
            content: foundItems,

          });
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server at 3000");
});
