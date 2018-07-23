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
  // var client = new Twitter({
  //   consumer_key: '',
  //   consumer_secret: '',
  //   access_token_key: '',
  //   access_token_secret: ''
  // });
  var client = new Twitter(keys.twitter);
   
  var params = {screen_name: 'WSchwartz12', count: 20};
  
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
//    console.log(tweets);

      console.log("Tweets printing for " + params.screen_name + ":" + '\n');

      for (i=0; i<tweets.length; i++) {
        var tweetData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
        console.log(tweetData);
        console.log("-------------------------");
      }      
    }
  });  
};

var runSpotify = function() {
  // var spotify = new Spotify({
  //   id: "",
  //   secret: ""
  // });
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
    console.log(data); 
    var songData = ("Artist: " + data.tracks.items[0].artist[0].name + '\n' + 
      "Album: " + data.tracks.items[0].album.name + '\n' +
      "Preview Here: " + data.tracks.items[0].preview_url);
    console.log(songData);
    console.log("-------------------------");


  });
}

var runMovie = function() {

  console.log("Printing Movie: " + inputTerm + "." + '\n');

  if (inputTerm === ""){
    inputTerm = "Mr. Nobody.";
  };

  var url = "http://www.omdbapi.com/?t=" + inputTerm + "&y=&plot=short&apikey=trilogy";
  // var url = "http://www.omdbapi.com/?t=" + inputTerm + "&y=&plot=long&tomatoes=true&r=json";


  request(url, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); 

      console.log("Title: " + JSON.parse(body)["Title"]);
      console.log("Year: " + JSON.parse(body)["Year"]);
      console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
      console.log("Country: " + JSON.parse(body)["Country"]);
      console.log("Language: " + JSON.parse(body)["Language"]);
      console.log("Plot: " + JSON.parse(body)["Plot"]);
      console.log("Actors: " + JSON.parse(body)["Actors"]);

    } else {
      console.log('error:', error); // Print the error if one occurred
    }

  });

}


if (command === "my-tweets"){
  runTwitter();
} else if (command === "spotify-this-song"){
  runSpotify();
} else if (command === "movie-this"){
  runMovie();
} else if (command === "do-what-it-says"){

} else {

};

