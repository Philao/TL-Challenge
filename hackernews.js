
// Load node.js modules
const fs = require('fs');
const request = require('request');
const program = require('commander');


// variables that hold number of articles that should be printed
let numPosts;
let intNum;

//creates functionality to create an oprion on the command.
program
  .version('0.0.1')
  .option('-p, --posts <number>', 'Number of posts', numPosts)
  .action(function (num) {
    intNum = num;
  });
 
program.parse(process.argv);
 
if (intNum === undefined || intNum > 100) {
  console.error('Please specify number of posts <= 100');
  process.exit(1);
} 


//creates json file 
fs.appendFile('articles.json','' , (err) => {
	if (err) console.log(err);	
						 	 });


// function to set an iteger to 0
function setZero(input) {
	if (!Number.isInteger(input)) {
		input = 0;
		return input;
	} else {
		return input;
	}
};

// function to check a strung is under 256 characters and is not blank
function checkStringValid(input) {
	if (input.length <= 256 && input != "") {
		return true;
	} else {
		return false;
	} 
};





//requests an array of article numbers for the last 500 articles 
function generate() { 
  (request('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty', function(err, res, body) {


	//removes square brackets from an array
	body = body.replace('[', '');
	body = body.replace(']', '');

	// Splits the list into a javascript array
	articleArray = body.split(',');
	articleNum = intNum.posts;

	 //decides number of articles to be output
	articleRec = 0 // keeps a record of how many have been collected.
	var i = 0; //iterates through the articleArray

		
			// Loops through each article and adds to a file 
			while (i < articleNum) {
					//takes a article number from the array
					let currArt = articleArray[i];
					//formats the article number
				    currArt = currArt.trim();
				    rank = 0	
				    //calls the articlle	
					request('https://hacker-news.firebaseio.com/v0/item/' + currArt +'.json?print=pretty', function(err, res, json) {
						obj = JSON.parse(json);
						obj.score = setZero(obj.score);
						obj.descendents = setZero(obj.descendents);
						rank++
						titleValid = checkStringValid(obj.title);
						byValid = checkStringValid(obj.by);
						// creates an object for the article if the title and author are valid
						if (titleValid && byValid) {
							var fileContent = new Object();
								fileContent.title = obj.title;
								fileContent.url = obj.url;
								fileContent.author = obj.by;
								fileContent.points = obj.score;
								fileContent.comments = obj.descendents;
								fileContent.rank = rank;
								

						// create file to prepare JSON
						var prepareJSON = ''

						//Puts comma between JSON objects
						if (rank != 1) {
							prepareJSON += ','
						}
						//Makes the object a string
						prepareJSON += JSON.stringify(fileContent);

						//adds the json to the article file
						fs.appendFile('articles.json', prepareJSON , (err) => {
						  		if (err) console.log(err);	
						 	 });
					};
				});
			i++;
		}; // end of while loop

	 })); 
  	
 console.log("Successfully Written to File.");
}; // end of generate function
		


		
		//finction to read json file and print to console
		function printArticles() {
			fs.readFile('articles.json', 'utf8', function (err,contents) {
					console.log("starting print");
					console.log(contents);	
			});
		};
		// function  to delete the json file
		function deleteFile() {
			fs.unlinkSync('articles.json');
		}

// to get functions to go asyncronously, I set them to start at different times.
setTimeout(generate,2000);
setTimeout(printArticles, 6000);
setTimeout(deleteFile, 8000);




