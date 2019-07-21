/* In Javascript, command line
 arguements are stored in process.argv, with the first
 two usually being 'node' and the path to the script.
 So we should take the third commandline arg.
*/
var myargs = process.argv.slice(2);
let emailAddress = myargs[0];

/* function urlFinder
   
   Accepts a string as an agrument and 
   tests that the string is a valid email address.
   Returns the website of the domain name.
   Throws error if email is invalid.
*/
function urlFinder(email) {
    if(email == undefined) {
        throw new Error("Error: no email address entered.");
    }
    var ind = email.indexOf("@");
    var dot = email.indexOf(".");
    if(ind == -1 || dot == -1) {
        throw new Error("Error: not a valid email address:" + email);
    }
    if(email.slice(dot) != ".com" && email.slice(dot) != ".co.uk") {
        throw new Error("Error: not a valid email address:" + email);
    }
    var end = email.slice(ind + 1);
    var url = "https://www.";
    url += end;
    return url;
}

var request = require('request');
var cheerio = require('cheerio');
var Knwl = require('knwl.js');
var knwlInstance = new Knwl('english');

/* We use try in anticipation of an incorrectly entered email address.
   
   We also check that an error did not occur in the request and that we
   recieved a successful http response. (statusCode == 200).

   Whilst I'm learning about HTML and cheerio I decided just to try the knwl
   plug-ins on the entire html. From what I've tried it can find email address
   quite decently but is no use for finding dates & phones.
*/
try {
    request(urlFinder(emailAddress) , function (error, response, html) {  
        if (!error && response.statusCode == 200) {
            // const $ = cheerio.load(html);
            knwlInstance.register('dates', require('knwl.js/default_plugins/dates'));
            knwlInstance.register('phones', require('knwl.js/default_plugins/phones'));
            knwlInstance.register('emails', require('knwl.js/default_plugins/emails'));

            knwlInstance.init(html);
            var dates = knwlInstance.get('dates');
            var phones = knwlInstance.get('phones');
            var emails = knwlInstance.get('emails');

            console.log(dates);
            console.log(phones);
            console.log(emails);
        }
    });
} catch(error) {
    console.log("Please enter a correct email address as a command argument.");
}
