/* In Javascript, command line
 arguements are stored in process.argv, with the first
 two usually being 'node' and the path to the script.
 So we should take the third commandline arg.
*/
var myargs = process.argv.slice(2);
let emailAddress = myargs[0];

/* function validateEmail
   This function take in a general email address
   and checks whether this email is in a valid form,
   i.e. in the form string @ string.string
   This function uses the test method on the
   regular expression /\S+@\S+\.\S/
   to perform this.
   Input: string
   output: boolean

   In regular expressions, \S is a non-whitespace
   character, following something with a + indicates it
   may be repeated more than once.
*/
function validateEmail(email) {
    var emailTester = /\S+@\S+\.\S/;
    return emailTester.test(email);
}

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
    if(validateEmail(email) == false) {
        throw new Error("Error: Invalid email adress.");
    }
    var ind = email.indexOf("@");
    var end = email.slice(ind + 1);
    var url = "https://www.";
    url += end;
    return url;
}

var request = require('request');
var cheerio = require('cheerio');
var Knwl = require('knwl.js');
var knwlInstance1 = new Knwl('english');
var knwlInstance2 = new Knwl('english');

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
            var $ = cheerio.load(html);
            var web = $.html();
            var web1 = web.replace(/[\s]/g, '-');
            var web2 = web1.replace(/[\", \+]/g, ' ');

            knwlInstance1.register('dates', require('knwl.js/default_plugins/dates'));
            knwlInstance1.register('emails', require('knwl.js/default_plugins/emails'));
            knwlInstance2.register('phones', require('knwl.js/default_plugins/phones'));

            knwlInstance1.init(web);
            knwlInstance2.init(web2);
            var dates = knwlInstance1.get('dates');
            var emails = knwlInstance1.get('emails');
            var phones = knwlInstance2.get('phones');

            for(let i = 0; i < phones.length; i++) {
                console.log(phones[i]);
            }

            for(let i = 0; i < emails.length; i++) {
                console.log(emails[i]);
            }
        }
    });
} catch(error) {
    console.log("Please enter a correct email address as a command argument.");
}

