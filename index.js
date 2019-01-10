#!/usr/bin/env node


const request = require('request');
const cheerio = require('cheerio');

var program = require('commander');

var internaute = require("./dico/fr_internaute.js")

// console.log("what : " + internaute.recursiveMap());
//  return false;
program
	.version('0.1.0')
	.option('-l, --lang [lang]', 'Choose language [fr,en,fr-en,en-fr]')
	.option('-w, --word [word]', 'Add a word [word]')
	.option('-s, --syn', 'Synonymes')
	.option('-c, --cit', 'Citation')
	.option('-d, --def', 'Definition')
	.parse(process.argv);


if (program.word) {
	console.log('Your word is : ' + program.word);
	word = program.word;
} else {
	console.log('you must input a word --help');
	process.exit();
}

var definitions = {};
var synonymes = [];
var citations = {};


function initialize() {
	// Setting URL and headers for request
	var options = {
		url: 'https://www.linternaute.fr/dictionnaire/fr/definition/' + word,
	};
	// Return new promise 
	return new Promise(function (resolve, reject) {


		// Do async job
		request.get(options, function (err, resp, body) {
			if (err) {
				reject(err);
			} else {

				const $ = cheerio.load(body, {
					normalizeWhitespace: false
				});

				// Definition
				internaute.getDefinition($, definitions);

				// Get synonymes
				internaute.getSynonymes($, synonymes);

				// Get Citations
				internaute.getCitations($, citations);

				result = {
					"definitions": definitions,
					"synonymes": synonymes,
					"citations": citations,
				}
				resolve(result);
			}
		})
	})
}

function main() {
	var initializePromise = initialize();
	initializePromise.then(function (result) {
		// userDetails = result.syn;
		console.log("Initialized ");

		defaultDef = 'def';
		if (program.syn) {
			console.log(result.synonymes);
			defaultDef = '';
		}

		if (program.cit) {
			console.log(result.citations);
			defaultDef = '';
		}

		if (program.def || defaultDef == 'def') {
			console.log(JSON.stringify(result.definitions, null, " ").trim());
		}

	}, function (err) {
		console.log(err);
	})
}

main();