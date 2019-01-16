// Global variables for npm package managers and APIs
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

// Take terminal input and store in variables to be used below
var input = process.argv[2];
var url = process.argv.slice(3).join("+");
var songName = process.argv.slice(3).join(" ");

var cases = function (input) {

    switch (input) {

        case "concert-this":

            axios.get("https://rest.bandsintown.com/artists/" + url + "/events?app_id=codingbootcamp").then(
                function (response) {
                    const show = response.data[0]
                    if (show == undefined) {
                        console.log("This band is not on tour, or check your spelling and rerun app")
                    } else {
                        console.log("Venue Name: " + show.venue.name);
                        console.log("Venue Location: " + show.venue.city + ", " + response.data[0].venue.country);
                        console.log("Concert Time: " + show.datetime);
                    };
                }
            );
            break

        case "spotify-this-song":

            spotify
                .search({ type: 'track', query: songName })
                .then(function (response) {
                    const info = response.tracks.items;
                    if (info.length == 0) {
                        spotify
                            .search({ type: 'track', query: "the sign ace of base" })
                            .then(function (response) {
                                const info2 = response.tracks.items;
                                songInfo(info2);
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    } else {
                        songInfo(info);
                    };
                })
                .catch(function (err) {
                    console.log(err);
                });

            var songInfo = function (info) {
                console.log("Artist Name: " + info[0].album.artists[0].name)
                console.log("Song Name: " + info[0].name)
                console.log("Preview Link: " + info[0].preview_url)
                console.log("Album Name: " + info[0].album.name)
            };
            break

        case "movie-this":

            var queryUrl = "http://www.omdbapi.com/?t=" + url + "&y=&plot=short&apikey=trilogy";

            axios.get(queryUrl).then(
                function (response) {

                    // if movie title is invalid, then return Mr. Nobody's film info. Else return user input movie info.
                    if (response.data.Title === undefined) {

                        queryUrl2 = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
                        axios.get(queryUrl2).then(
                            function (response) {
                                console.log("INVALID MOVIE, here's Mr. Nobody");
                                movieInfo(response);
                            }
                        );

                    } else {

                        movieInfo(response);
                    }
                }
            );

            // function to display movie info
            var movieInfo = function (response) {

                console.log("The movie's title is: " + response.data.Title);
                console.log(response.data.Title + "'s release date is: " + response.data.Year);
                console.log(response.data.Title + "'s IMDB rating is: " + response.data.imdbRating);
                const ratings = response.data.Ratings;
                console.log(response.data.Title + "'s Rotten Tomatoes score is: " + ratings[1].Value);
                console.log("The movie was produced in: " + response.data.Country);
                console.log(response.data.Title + "'s language is: " + response.data.Language);
                console.log("Movie Plot: " + response.data.Plot);
                console.log("Actors Include: " + response.data.Actors);
            }
            break
            
        default:
            console.log("error");
    };
};

// If input was entered in random.txt 
if (process.argv[2] === "do-what-it-says") {

    fs.readFile("random.txt", 'utf8', function (err, data) {

        if (err) {
            return console.log(err);
        }

        input = data.slice(0, data.indexOf(" "));
        url = data.slice(data.indexOf(" ") + 1, data.length);
        url = url.split(" ").join("+")
        songName = data.slice(data.indexOf(" ") + 1, data.length);
        cases(input);

    });

} else {

    cases(input);
}