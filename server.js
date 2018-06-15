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
app.get("/", function (req, res) {
  // Grab every unsaved document in the Articles collection
  db.Article.find({ "saved": false })
    .then(function (dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      //Create handlebars object to help render every unsaved article on the homepage
      var hbsObject = {
        article: dbArticle
      };
      //Send back unsaved articles to the client
      //res.json(dbArticle);
      //render home page
      res.render("home", hbsObject);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the title and summary of every link, and save them as properties of the result object
      result.title = $(this).children("h2").text();
      result.summary = $(this).children(".summary").text();
      result.link = $(this).children("h2").children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  });
});


//Displays saved page
app.get("/saved", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ "saved": true })
    .then(function (dbArticle) {
      //Create handlebars object to help render every saved article on the homepage
      var hbsObject = {
        article: dbArticle
      };
      //Send back saved articles to the client
      res.json(dbArticle);
      //render home page
      res.render("home", hbsObject);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Save an article
app.post("/save/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    // Execute the above query
    .then(function (dbArticle) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Delete an article
app.post("/delete/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
    // Execute the above query
    .then(function (dbArticle) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(dbArticle);
      }
    });
});

// Listen on port
app.listen(port, function () {
  console.log("App running on port " + port);
}); 