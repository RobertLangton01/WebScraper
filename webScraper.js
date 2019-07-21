/* In Javascript, command line
 arguements are stored in process.argv, with the first
 two usually being 'node' and the path to the script.
 So we should take the third commandline arg.
*/
var myargs = process.argv.slice(2);
let emailAddress = myargs[0];

function urlFinder(email) {
    if(email == undefined) {
        console.log("Error: No email address was entered");
        return "";
    }
    var ind = email.indexOf("@");
    if(ind == -1) {
        console.log("Error: This is not a valid email address");
        return "";
    }
    var end = email.slice(ind + 1);
    var url = "https://www.";
    url += end;
    return url;
}

var request = require('request');
var cheerio = require('cheerio');

request(urlFinder(emailAddress) , function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
  }
});

