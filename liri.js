require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

switch (process.argv[2]) {
    case "concert-this":
        var artist = process.argv.slice(3).join("+");
        console.log(artist)
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
            function (response) {
                console.log(response);
            }
        );
        break
    case "spotify-this-song":
        var songName = process.argv.slice(3).join("")
        spotify
            .search({ type: 'track', query: songName })
            .then(function (response) {
                //console.log(JSON.stringify(response));
                console.log(response)
            })
            .catch(function (err) {
                console.log(err);
            });
        break
    case "movie-this":

        break
    case "do-what-it-says":

        break
    default:
        console.log("error")
}
