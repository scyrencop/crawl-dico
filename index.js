#!/usr/bin/env node


const request = require('request');
const cheerio = require('cheerio');

var program = require('commander');

var internaute = require("./dico/fr_internaute.js")
var collins = require("./dico/en_collins.js")

// console.log("what : " + internaute.recursiveMap());
//  return false;
program
	.version('0.1.0')
	.option('-l, --lang [lang]', 'Choose language [fr,en,fr-en,en-fr]', /^(fr|en|fr-en|en-fr)$/i,  'fr')
	.option('-w, --word [word]', 'Add a word [word]')
	.option('-s, --syn', 'Synonymes')
	.option('-c, --cit', 'Citation')
	.option('-d, --def', 'Definition', 'def')
	.parse(process.argv);


if (program.word) {
	console.log('Your word is : ' + program.word);
	word = program.word;
} else {
	console.log('you must input a word --help');
	process.exit();
}


defaultDef = 'def';

var definitions = {};
var synonymes = [];
var citations = {};



	if( program.lang == 'fr' ){
		url_dico = 'https://www.linternaute.fr/dictionnaire/fr/definition/';
	}else if( program.lang == 'en' ){
		url_dico = 'https://www.collinsdictionary.com/dictionary/english/';
	}


function initialize() {
	// Setting URL and headers for request
	var options = {
		url: url_dico + word,
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

				console.log('program def ', program.def);
				
				// Get Synonymes
				if (program.syn){
					defaultDef = '';
					if (program.lang == 'fr') {
						internaute.getSynonymes($, synonymes);
					} else if (program.lang == 'en') {
						collins.getSynonymes($, synonymes);
					}
				}
				
				// Get Citations
				if (program.cit){
					defaultDef = '';
					if (program.lang == 'fr') {
						internaute.getCitations($, citations);
					} else if (program.lang == 'en') {
						collins.getCitations(citations);
					}
				}
				
				//Get Definition
				if (defaultDef == 'def' || program.def){
					if (program.lang == 'fr' ) {
						internaute.getDefinition($, definitions);
					}else if(program.lang =='en'){
						collins.getDefinition($, definitions);				
					}
				}
				

				result = {
					"definitions": definitions,
					"synonymes": synonymes,
					"citations": citations,
				}
				// console.log('result: ',result);
				
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