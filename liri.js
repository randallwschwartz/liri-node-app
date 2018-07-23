// liri.js Homework by R. Schwartz
//
// Link to R. Schwartz portfolio at:
//    https://randallwschwartz.github.io/Bootstrap-Portfolio/portfolio.html
//

require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

// Grab stuff from the command line
var command = process.argv[2];
var inputTerm = process.argv.slice(3).join(" ");
console.log("Command: " + command + "\n" +
  "Input Term: " + inputTerm + "\n");

var runTwitter = function() {

  var client = new Twitter(keys.twitter);
   
  var params = {screen_name: 'WSchwartz12', count: 20};
  
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
//    console.log(tweets);

      console.log("Tweets printing for " + params.screen_name + ":" + '\n');

      var combinedTweets = [];

      for (i=0; i<tweets.length; i++) {
        var tweetData = ('Number: ' + (i+1) + '\n' + 
          tweets[i].created_at + '\n' + 
          tweets[i].text + '\n' +
          "-------------------------" + '\n');
        console.log(tweetData);
        combinedTweets.push(tweetData);
      };

      // Append tweetData to log.txt
      fs.appendFile("log.txt", combinedTweets, function(err) {
        if (err) throw err;
      });
    };
  });  
};

var runSpotify = function() {

  var spotify = new Spotify(keys.spotify);
   
  if (inputTerm === ""){
    inputTerm = "The Sign";
  };

  spotify.search({ type: 'track', query: inputTerm }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } 
   
    console.log("Spotify printing song: " + inputTerm + "." + '\n');

    console.log("Data:");
//    console.log(data.tracks.items[0]); 
    var songData = ("Artist: " + data.tracks.items[0].artists[0].name + '\n' + 
      "Album: " + data.tracks.items[0].album.name + '\n' +
      "Preview Here: " + data.tracks.items[0].preview_url + '\n' +
      "-------------------------" + '\n');
    console.log(songData);

    // Append songData to log.txt
    fs.appendFile("log.txt", songData, function(err) {
      if (err) throw err;
    });
    
  });
}

var runMovie = function() {

  console.log("Printing Movie: " + inputTerm + "." + '\n');

  if (inputTerm === ""){
    inputTerm = "Mr. Nobody.";
  };

  var url = "http://www.omdbapi.com/?t=" + inputTerm + "&y=&plot=short&apikey=trilogy";
  
  request(url, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); 

      var movieData = ("Title: " + JSON.parse(body)["Title"] + '\n' +
        "Year: " + JSON.parse(body)["Year"] + '\n' +
        "IMDB Rating: " + JSON.parse(body)["imdbRating"] + '\n' +
        "Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + '\n' +
        "Country: " + JSON.parse(body)["Country"] + '\n' +
        "Language: " + JSON.parse(body)["Language"] + '\n' +
        "Plot: " + JSON.parse(body)["Plot"] + '\n' +
        "Actors: " + JSON.parse(body)["Actors"] + '\n' +
        "-------------------------" + '\n');

      console.log(movieData);

      // Append movieData to log.txt
      fs.appendFile("log.txt", movieData, function(err) {
        if (err) throw err;
      });

    } else {
      console.log('error:', error); // Print the error if one occurred
    }

  });

}

var runRandom = function() {

  console.log("Looking at random.txt file.");

  fs.readFile("random.txt", "utf8", function(error, data) {
    if(error){
      console.log(error);
    }else{
  
      //split data, declare variables
      var dataArr = data.split(',');
      command = dataArr[0];
      inputTerm = dataArr[1];

      //if multi-word search term, add.
      for(i=2; i<dataArr.length; i++){
        inputTerm = inputTerm + "+" + dataArr[i];
      };
    }

    selectFunction();
  });
}

var selectFunction = function(){

  if (command === "my-tweets"){
    runTwitter();
  } else if (command === "spotify-this-song"){
    runSpotify();
  } else if (command === "movie-this"){
    runMovie();
  } else if (command === "do-what-it-says"){
    runRandom();
  } else {
  
  };

}

selectFunction();

