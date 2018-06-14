// Setting up dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

var port = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/echoscraper");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Route displaying home page with all unsaved scraped artiles
app.get("/", function(req, res) {   
    //Create handlebars object to help render every unsaved article on the homepage
    var hbsObject = {
    article: data
    };
    // Grab every document in the Articles collection
    db.Article.find({"saved": false})
    .then(function(dbArticle) {
      //Send back unsaved articles to the client
      res.json(dbArticle);
     
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    //render home page
    res.render("home", hbsObject);

});

//Displays saved page
app.get("/saved", function(req, res) {   
  res.render("saved");
});



// Listen on port
app.listen(port, function() {
  console.log("App running on port " + port);
});

